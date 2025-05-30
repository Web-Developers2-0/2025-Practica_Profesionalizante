import os
from django.shortcuts import render, redirect
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
import mercadopago
from django.conf import settings
from Order.models import Order
from Order.serializers import OrderCreateSerializer, OrderSerializer

# Crear orden sin descontar stock
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save(user=request.user)  # Guardar la orden con el usuario actual
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar órdenes del usuario autenticado
class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

# Crear preferencia MercadoPago para checkout
class CreateOrderCheckoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save(user=request.user)

            sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)

            items = []
            for item in order.order_items.all():
                items.append({
                    "title": item.product.name,
                    "quantity": item.quantity,
                    "unit_price": float(item.product.price),
                    "currency_id": "ARS"
                })


            preference_data = {
            "items": items,
            "external_reference": str(order.id_order),
            "back_urls": {
            "success": f"https://planetsuperheroes.vercel.app/dashboard",
            "failure": f"https://planetsuperheroes.vercel.app/cart",
            "pending": f"https://planetsuperheroes.vercel.app/home",
                            },
            "auto_return": "approved",
             "notification_url": "https://planetsuperheroes.onrender.com/api/orders/webhook"
                                }
            preference_response = sdk.preference().create(preference_data)

            if preference_response["status"] == 201:
                preference = preference_response["response"]
                order.preference_id = preference["id"]
                order.external_reference = preference["external_reference"]
                order.save()

                return Response({"checkout_url": preference["init_point"]}, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)  # <-- para ver errores en consola

                return Response({"error": "Error creando preferencia en MercadoPago"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.shortcuts import redirect
def payment_success_view(request):
    order_id = request.GET.get('external_reference')
    if not order_id:
        return HttpResponse("No se encontró el pedido.", status=400)
    try:
        order = Order.objects.get(id_order=order_id)
    except Order.DoesNotExist:
        return HttpResponse("Pedido no encontrado.", status=404)
    if order.payment_status == 'paid':
        # Ya está pagada, redirigimos al dashboard
        return redirect("https://planetsuperheroes.vercel.app/dashboard")
    else:
        # Aquí podrías mostrar un mensaje de "pago en proceso" o similar
        return HttpResponse("El pago está en proceso o no fue confirmado aún.")
    
def payment_failure_view(request):
    return HttpResponse("El pago fue rechazado o cancelado.")

def payment_pending_view(request):
    return HttpResponse("El pago está pendiente. Te notificaremos cuando esté aprobado.")
from Notification.models import Notification 
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
@method_decorator(csrf_exempt, name='dispatch')
class MercadoPagoWebhookView(APIView):
    permission_classes = []  # Sin autenticación

    def post(self, request, *args, **kwargs):
        # Intentar obtener topic e id desde query params
        topic = request.query_params.get("topic")
        payment_id = request.query_params.get("id")

        # Si no existen en query params, intentar obtenerlos desde el body JSON (payload)
        if not topic or not payment_id:
            topic = request.data.get("type")  # en el body, 'type' es equivalente a topic
            payment_id = request.data.get("data", {}).get("id")

        # Validar datos
        if topic != "payment" or not payment_id:
            return Response({"detail": "Notificación no válida"}, status=400)

        #Mock o llamada real al SDK
        if payment_id == "123456789" or settings.DEBUG:
            payment_response = {
                "status": 200,
                "response": {
                    "external_reference": "1",
                    "status": "approved"
                }
            }
        else:
            sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
            payment_response = sdk.payment().get(payment_id)

        if payment_response["status"] != 200:
            return Response({"detail": "Error al consultar el pago"}, status=400)

        payment = payment_response["response"]
        external_reference = payment.get("external_reference")

        try:
            id_order = int(external_reference)
            order = Order.objects.get(id_order=id_order)
        except (ValueError, Order.DoesNotExist):
            return Response({"detail": "Orden no encontrada"}, status=404)

        if payment["status"] == "approved" and order.payment_status != "paid":
            # Verificar stock
            for item in order.order_items.all():
                if item.product.stock < item.quantity:
                    return Response({"detail": f"Stock insuficiente para {item.product.name}"}, status=400)

            # Descontar stock
            for item in order.order_items.all():
                product = item.product
                product.stock -= item.quantity
                product.save()

            # Actualizar estado orden
            order.payment_status = 'paid'
            order.state = 'completado'
            order.save()

            # Crear notificación al usuario
            Notification.objects.create(
                usuario=order.user,
                mensaje=f"Tu pedido #{order.id_order} fue pagado exitosamente. ¡Gracias por tu compra!",
                tipo="info"
            )
            print(f"✅ Notificación creada para el usuario {order.user.username} por el pedido #{order.id_order}")

        return Response({"detail": "Notificación recibida"}, status=200)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def success_view(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print("Webhook recibido:", data)
        return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "Método no permitido"}, status=405)

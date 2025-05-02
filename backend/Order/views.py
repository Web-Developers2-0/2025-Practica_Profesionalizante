from django.shortcuts import render
from .models import Order
from .serializers import OrderCreateSerializer,OrderSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status,permissions
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

#CREAR ORDENES CON USUARIO AUTENTICADO 
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save(id_user=request.user)
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#VER LISTA DE ORDENES DE USUARIO AUTENTICADO      
class UserOrdersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        return Order.objects.filter(id_user=user_id)    
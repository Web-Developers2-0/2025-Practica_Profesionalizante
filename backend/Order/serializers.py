from django.utils import timezone  
from decimal import Decimal
from rest_framework import serializers

from Order.models import OrderItem,Order

#Order Serializer---> Order Items Serializer 
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']



class OrderCreateSerializer(serializers.ModelSerializer):
    order_items = OrderItemCreateSerializer(many=True)
    id_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Order
        fields = ['id_user', 'state', 'payment_method', 'shipping_method', 'payment_status', 'total_amount', 'order_items']

    def validate(self, attrs):
        order_items_data = attrs.get('order_items', [])
        for order_item_data in order_items_data:
            if 'product' not in order_item_data:
                raise serializers.ValidationError("Cada elemento de 'order_items' debe tener una clave 'product'.")
            product = order_item_data['product']
            quantity = order_item_data['quantity']
            if product.stock < quantity:
                raise serializers.ValidationError(f"No hay suficiente stock para {product.name}")
        attrs.setdefault('state', 'En proceso')
        attrs.setdefault('order_date', timezone.now().date())
        attrs.setdefault('payment_method', 'credit_card')
        attrs.setdefault('shipping_method', 'express')
        attrs.setdefault('payment_status', 'pagado')
        return attrs

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        total_amount = Decimal(0)
        
        for order_item_data in order_items_data:
            product = order_item_data['product']
            quantity = order_item_data['quantity']
            subtotal = product.price * quantity
            total_amount += subtotal
            
            # Actualizar el stock del producto
            product.stock -= quantity
            product.save()
        
        validated_data['total_amount'] = total_amount
        order = Order.objects.create(**validated_data)
        
        for order_item_data in order_items_data:
            OrderItem.objects.create(order=order, **order_item_data)
        
        return order

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = ['id_order_items', 'product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ['id_order', 'user', 'state', 'order_date', 'payment_method', 'shipping_method', 'payment_status', 'total_amount', 'order_items']


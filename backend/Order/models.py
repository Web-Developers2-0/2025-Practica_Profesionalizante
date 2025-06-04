from django.db import models
from django.conf import settings
from Product.models import Product
class Order(models.Model):
    id_order = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name='orders', db_column='user_id')
    state = models.CharField(max_length=45, blank=True)
    order_date = models.DateField(null=True)
    payment_method = models.CharField(max_length=45, blank=True)
    shipping_method = models.CharField(max_length=45, null=True)
    payment_status = models.CharField(max_length=45, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    # Agrego campo adicional para gestionar boton de arrepentimiento
    cancelled_at = models.DateField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=255, blank=True, null=True)

    # Campos adicionales para MercadoPago
    preference_id = models.CharField(max_length=100, blank=True, null=True)
    external_reference = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f'Order {self.id_order}'

class OrderItem(models.Model):
    id_order_items = models.AutoField(primary_key=True)
    quantity = models.IntegerField(blank=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, related_name='order_items')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    class Meta:
        db_table = 'order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f'{self.quantity} of {self.product.name} in Order {self.order.id_order}'

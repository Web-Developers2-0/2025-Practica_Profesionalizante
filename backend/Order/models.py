from django.db import models
from Product.models import Product
from django.conf import settings 

class Order(models.Model):
    id_order = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, related_name='orders',db_column='user_id')

    state = models.CharField(max_length=45, blank=True)
    order_date = models.DateField(null=True)
    payment_method = models.CharField(max_length=45, blank=True)
    shipping_method = models.CharField(max_length=45, null=True)
    payment_status = models.CharField(max_length=45, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)

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
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
        
    def __str__(self):
        return f'{self.quantity} of {self.product.name} in Order {self.order.id_order}'
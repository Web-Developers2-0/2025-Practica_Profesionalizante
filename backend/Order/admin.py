from django.contrib import admin
from .models import  Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id_order', 'user_id', 'state', 'order_date', 'payment_method', 'shipping_method', 'payment_status', 'total_amount', 'cancelled_at', 'cancel_reason')
    list_filter = ('state', 'order_date', 'payment_method', 'shipping_method', 'payment_status')
    search_fields = ('id_order', 'id_user__email', 'cancel_reason')
    inlines = [OrderItemInline]

   
    def order_items(self, obj):
        return ", ".join([str(item) for item in obj.order_items.all()])
    order_items.short_description = 'Order Items'

    
    def has_view_permission(self, request, obj=None):
     
        if request.user.groups.filter(name='Vendedor').exists():
            return True

        return super().has_view_permission(request, obj)


admin.site.register(Order, OrderAdmin)

from django.contrib import admin
from .models import User, Role
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Permission
from django.contrib import admin
from .models import User, Role
from django.utils.html import format_html


class UserAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'username',
        'first_name',
        'last_name',
        'email',
        'address',
        'get_image',  # Aquí usas el método con img tag
        'display_orders',
        'role'
    )
    filter_horizontal = ('user_permissions',)

    def get_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:5px;"/>', obj.image.url)
        return "Sin imagen"
    get_image.short_description = "Imagen"
    get_image.allow_tags = True

    def display_orders(self, obj):
        return ", ".join([str(order.id_order) for order in obj.orders.all()])
    display_orders.short_description = 'Pedidos'

    # Control de permisos por grupo (Vendedor)
    def has_add_permission(self, request):
        return not request.user.groups.filter(name='Vendedor').exists()

    def has_change_permission(self, request, obj=None):
        return not request.user.groups.filter(name='Vendedor').exists()

    def has_delete_permission(self, request, obj=None):
        return not request.user.groups.filter(name='Vendedor').exists()

    def has_view_permission(self, request, obj=None):
        if request.user.groups.filter(name='Vendedor').exists():
            return True
        return super().has_view_permission(request, obj)

admin.site.register(User, UserAdmin)

class RoleAdmin(admin.ModelAdmin):
    list_display = ('id_role', 'name')

admin.site.register(Role, RoleAdmin)


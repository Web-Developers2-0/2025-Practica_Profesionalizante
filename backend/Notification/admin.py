from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'mensaje', 'tipo', 'leida', 'fecha')
    list_filter = ('tipo', 'leida')
    search_fields = ('mensaje', 'usuario__email')


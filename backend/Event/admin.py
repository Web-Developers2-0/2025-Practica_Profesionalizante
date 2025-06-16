from django.contrib import admin
from .models import Event
from django.utils.html import format_html

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'date', 'location', 'get_image_preview', 'created_at')
    search_fields = ('title', 'location')
    list_filter = ('date',)

    def get_image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="60" height="60" style="object-fit:cover;border-radius:5px;" />',
                obj.image.url
            )
        return "Sin imagen"
    get_image_preview.short_description = "Imagen"

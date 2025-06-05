
from django.apps import AppConfig


class EventConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Event'

    def ready(self):
        import Event.signals  # Esto activa las señales


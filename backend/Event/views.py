
from rest_framework import generics
from Event.models import Event
from Event.serializers import EventSerializer
from Notification.models import Notification

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        evento = serializer.save()
        Notification.enviar_notificacion_evento(evento)  # Envía la notificación

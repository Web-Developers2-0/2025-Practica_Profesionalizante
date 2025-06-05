from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Event
from Notification.models import Notification
from User.models import User  
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

@receiver(post_save, sender=Event)
def crear_notificacion_evento(sender, instance, created, **kwargs):
    if created:
        def crear_notificaciones():
            usuarios = User.objects.all()
            for usuario in usuarios:
                try:
                    Notification.objects.create(
                        usuario_id=usuario.id,  
                        mensaje=f"Nuevo evento: {instance.title} - {instance.date} - {instance.description}",
                        tipo='info'
                    )
                except Exception as e:
                    print(f"Error al crear notificación para usuario {usuario.id}: {e}")

        transaction.on_commit(crear_notificaciones)

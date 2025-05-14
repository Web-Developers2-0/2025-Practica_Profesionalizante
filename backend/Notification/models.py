from django.db import models
from django.conf import settings

class Notification(models.Model):
    TIPO_CHOICES = [
        ('info', 'Información'),
        ('alert', 'Alerta'),
        ('promo', 'Promoción'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notificaciones')
    mensaje = models.TextField()
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='info')
    leida = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.tipo.upper()}] {self.usuario.username}: {self.mensaje[:30]}"
        

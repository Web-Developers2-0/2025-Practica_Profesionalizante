from django.db import models
from cloudinary.models import CloudinaryField
# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = CloudinaryField('image', null=True, blank=True)
    date = models.DateField()
    location = models.CharField(max_length=200, blank=True)
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
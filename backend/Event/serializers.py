from rest_framework import serializers
from Event.models import Event

class EventSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'image_url', 'date', 'location', 'link', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

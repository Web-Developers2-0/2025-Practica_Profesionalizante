from django.shortcuts import render
from rest_framework import generics
from Event.models import Event
from Event.serializers import EventSerializer


class EventListView(generics.ListAPIView):
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
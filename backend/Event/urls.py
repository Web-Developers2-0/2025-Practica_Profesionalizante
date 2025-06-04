from django.urls import path, include
from rest_framework import routers
from .views import EventListView

urlpatterns = [
    path('events/', EventListView.as_view(), name='event-list'),
    
]
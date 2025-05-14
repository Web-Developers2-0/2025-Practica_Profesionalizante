from django.urls import path
from .views import NotificationListCreateView, NotificationDetailView

urlpatterns = [
    path('notifications/', NotificationListCreateView.as_view(), name='notification-list-create'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
]
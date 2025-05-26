from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Order.views import CreateOrderView, UserOrdersView, OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('orders/create/', CreateOrderView.as_view(), name='orders_create_create'),
    path('orders/user/', UserOrdersView.as_view(), name='orders_user_list'),
    path('', include(router.urls)),
]   
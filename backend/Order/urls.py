from django.urls import path
from .views import (
    CreateOrderView,
    UserOrdersView,
    CreateOrderCheckoutView,
    payment_success_view,
    payment_failure_view,
    payment_pending_view,
    MercadoPagoWebhookView
)

urlpatterns = [
    path('orders/create/', CreateOrderView.as_view(), name='orders_create'),
    path('orders/user/', UserOrdersView.as_view(), name='orders_user_list'),  
    path('orders/create-checkout/', CreateOrderCheckoutView.as_view(), name='orders_create_checkout'),
    path('orders/payment/success/', payment_success_view, name='payment_success'),
    path('orders/payment/failure/', payment_failure_view, name='payment_failure'),
    path('orders/payment/pending/', payment_pending_view, name='payment_pending'),
    path('orders/webhook/', MercadoPagoWebhookView.as_view()),  
]

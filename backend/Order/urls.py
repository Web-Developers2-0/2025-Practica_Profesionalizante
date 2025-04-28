from django.urls import path
from Order import views  # Importar las vistas desde la app 'orders'

urlpatterns = [
    path('orders/create/', views.CreateOrderView.as_view(), name='orders_create_create'),
    path('orders/user/', views.UserOrdersView.as_view(), name='orders_user_list'),
]

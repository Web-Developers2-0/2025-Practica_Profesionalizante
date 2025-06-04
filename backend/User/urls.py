from django.urls import path, include
from rest_framework import routers
from User import views
from rest_framework_simplejwt.views import TokenVerifyView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from User.views import PasswordResetRequestView, PasswordResetConfirmView, ContactView, ChangePasswordView

router = routers.DefaultRouter()

router.register(r'roles', views.RoleViewSet)


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.Login.as_view(), name='login'), 
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user/', views.UserView.as_view(), name='user'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
]
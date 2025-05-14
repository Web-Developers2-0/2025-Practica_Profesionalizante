import time
import re
import cloudinary
from rest_framework import status,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import GenericAPIView
from rest_framework.generics import RetrieveUpdateAPIView
from django.contrib.auth import authenticate
from .serializers import RoleSerializer, UserSerializer, CustomTokenObtainPairSerializer,LogoutSerializer
from .models import Role, User
from User.serializers import (CustomTokenObtainPairSerializer, UserSerializer)
from User.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.conf import settings

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        user = authenticate(email=email, password=password)

        if user:
            login_serializer = self.serializer_class(data=request.data)
            if login_serializer.is_valid():
                user_serializer = UserSerializer(user)
                return Response({
                    'token': login_serializer.validated_data['access'],
                    'refresh-token': login_serializer.validated_data['refresh'],
                    'user': user_serializer.data,
                    'message': 'Inicio de Sesión Exitoso'
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Contraseña o nombre de usuario incorrectos'}, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            refresh_token = serializer.validated_data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
class UserView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    
class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]

class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email', '').strip()
        # Validación de email vacío
        if not email:
            return Response({'error': 'Debes ingresar un correo electrónico.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de formato de email
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return Response({'error': 'El formato del correo electrónico no es válido.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de longitud
        if len(email) > 100:
            return Response({'error': 'El correo electrónico es demasiado largo.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Mensaje genérico por seguridad
            return Response({'message': 'Si el correo existe, se enviará un enlace para restablecer la contraseña.'}, status=status.HTTP_200_OK)

        token = get_random_string(64)
        user.reset_token = token
        user.reset_token_expiry = timezone.now() + timedelta(hours=2)
        user.save()

        reset_url = f"http://localhost:4200/change-password/{token}"

        subject = 'Restablecé tu contraseña en PlanetSuperheroes'
        from_email = settings.EMAIL_HOST_USER
        to = [email]
        html_content = render_to_string('reset_password_email.html', {
            'reset_url': reset_url,
            'user_first_name': user.first_name,
            'year': timezone.now().year,
            'logo_url': 'https://postimg.cc/sQKGr0BY',
        })

        try:
            msg = EmailMultiAlternatives(subject, '', from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            print(f"[SUCCESS] Correo de recuperación enviado a {email}")
        except Exception as e:
            print(f"[ERROR] Error al enviar el correo: {e}")
            return Response({'error': 'Ocurrió un error al enviar el correo. Intenta nuevamente más tarde.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Si el correo existe, se enviará un enlace para restablecer la contraseña.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request, token):
        password = request.data.get('password', '').strip()
        # Validación de contraseña vacía
        if not password:
            return Response({'error': 'La contraseña es requerida.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de longitud mínima
        if len(password) < 8:
            return Response({'error': 'La contraseña debe tener al menos 8 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de longitud máxima
        if len(password) > 30:
            return Response({'error': 'La contraseña no debe superar los 30 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de mayúsculas y minúsculas
        if not (re.search(r'[A-Z]', password) and re.search(r'[a-z]', password)):
            return Response({'error': 'La contraseña debe contener mayúsculas y minúsculas.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de número o caracter especial
        if not re.search(r'[\d!@#$%^&*(),.?":{}|<>]', password):
            return Response({'error': 'La contraseña debe contener al menos un número o caracter especial.'}, status=status.HTTP_400_BAD_REQUEST)
        # Validación de espacios
        if ' ' in password:
            return Response({'error': 'La contraseña no debe contener espacios.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(reset_token=token, reset_token_expiry__gte=timezone.now()) # Establece la expiración del token de reinicio a 2 horas a partir del momento actual
        except User.DoesNotExist:
            return Response({'error': 'El enlace es inválido o ha expirado. Solicita uno nuevo.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.reset_token = None
        user.reset_token_expiry = None
        user.save()
        print(f"[SUCCESS] Contraseña restablecida para el usuario {user.email}")
        return Response({'message': 'Contraseña restablecida correctamente.'}, status=status.HTTP_200_OK)
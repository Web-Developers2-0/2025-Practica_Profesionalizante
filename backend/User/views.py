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
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.conf import settings


# --- Registro de usuario ---
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # --- Enviar correo de bienvenida ---
            subject = '¡Bienvenido a PlanetSuperheroes!'
            from_email = settings.EMAIL_HOST_USER
            to = [user.email]
            html_content = render_to_string('welcome_email.html', {
                'user_first_name': user.first_name,
                'year': timezone.now().year,
                'logo_url': 'https://i.ibb.co/6RPpCJfF/logo-blanco.png',
            })
            try:
                msg = EmailMultiAlternatives(subject, '', from_email, to)
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                print(f"Correo de bienvenida enviado a {user.email}")
            except Exception as e:
                print(f"Error al enviar el correo de bienvenida: {e}")

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

# --- Solicitud de reseteo de contraseña ---
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
        # Generar token y guardar expiración
        token = get_random_string(64)
        user.reset_token = token
        user.reset_token_expiry = timezone.now() + timedelta(hours=2)
        user.save()
        # URL de reseteo
        reset_url = f"{settings.RESET_PASSWORD_FRONTEND_URL}/change-password/{token}"
        subject = 'Restablecé tu contraseña en PlanetSuperheroes'
        from_email = settings.EMAIL_HOST_USER
        to = [email]
        html_content = render_to_string('reset_password_email.html', {
            'reset_url': reset_url,
            'user_first_name': user.first_name,
            'year': timezone.now().year,
            'logo_url': 'https://i.ibb.co/6RPpCJfF/logo-blanco.png',
        })
        try:
            msg = EmailMultiAlternatives(subject, '', from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            print(f"Correo de recuperación enviado a {email}")
        except Exception as e:
            print(f"Error al enviar el correo: {e}")
            return Response({'error': 'Ocurrió un error al enviar el correo. Intenta nuevamente más tarde.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'message': 'Si el correo existe, se enviará un enlace para restablecer la contraseña.'}, status=status.HTTP_200_OK)

# --- Confirmación de reseteo de contraseña ---
class PasswordResetConfirmView(APIView):
    permission_classes = []
    def post(self, request, token):
        password = request.data.get('password', '').strip()
        # Validaciones 
        if not password:
            return Response({'error': 'La contraseña es requerida.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({'error': 'La contraseña debe tener al menos 8 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) > 30:
            return Response({'error': 'La contraseña no debe superar los 30 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        if not (re.search(r'[A-Z]', password) and re.search(r'[a-z]', password)):
            return Response({'error': 'La contraseña debe contener mayúsculas y minúsculas.'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.search(r'[\d!@#$%^&*(),.?":{}|<>]', password):
            return Response({'error': 'La contraseña debe contener al menos un número o caracter especial.'}, status=status.HTTP_400_BAD_REQUEST)
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
        print(f"Contraseña restablecida para el usuario {user.email}")
        return Response({'message': 'Contraseña restablecida correctamente.'}, status=status.HTTP_200_OK)

# --- Contacto ---
class ContactView(APIView):
    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        message = request.data.get('message', '').strip()
        # Validaciones
        if not name:
            return Response({'name': ['El nombre es obligatorio.']}, status=status.HTTP_400_BAD_REQUEST)
        if len(name) < 4:
            return Response({'name': ['El nombre debe tener al menos 4 caracteres.']}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'email': ['El correo es obligatorio.']}, status=status.HTTP_400_BAD_REQUEST)
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return Response({'email': ['El correo no es válido.']}, status=status.HTTP_400_BAD_REQUEST)
        if not message:
            return Response({'message': ['El mensaje es obligatorio.']}, status=status.HTTP_400_BAD_REQUEST)
        if len(message) < 10:
            return Response({'message': ['El mensaje debe tener al menos 10 caracteres.']}, status=status.HTTP_400_BAD_REQUEST)
        # Limpieza de mensaje para evitar HTML y enlaces
        message = re.sub(r'<.*?>', '', message)
        message = re.sub(r'http[s]?://\S+', '[enlace removido]', message)
        subject = f'Contacto desde la web: {name}'
        body = f'Nombre: {name}\nEmail: {email}\n\nMensaje:\n{message}'
        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
            )
            return Response({'detail': '¡Mensaje enviado correctamente!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Ocurrió un error al enviar el mensaje. Intenta nuevamente más tarde.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Cambiar contraseña ---
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({'error': 'La contraseña actual es incorrecta.'}, status=status.HTTP_400_BAD_REQUEST)

        # Validaciones
        if len(new_password) < 8 or len(new_password) > 30:
            return Response({'error': 'La contraseña debe tener entre 8 y 30 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        if not any(c.isupper() for c in new_password) or not any(c.islower() for c in new_password):
            return Response({'error': 'La contraseña debe tener mayúsculas y minúsculas.'}, status=status.HTTP_400_BAD_REQUEST)
        if not any(c.isdigit() or c in '!@#$%^&*(),.?":{}|<>' for c in new_password):
            return Response({'error': 'La contraseña debe tener al menos un número o símbolo.'}, status=status.HTTP_400_BAD_REQUEST)
        if ' ' in new_password:
            return Response({'error': 'La contraseña no debe contener espacios.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Enviar correo de notificación
        subject = 'Tu contraseña ha sido cambiada'
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]
        html_content = render_to_string('password_changed_email.html', {
            'user_first_name': user.first_name,
            'year': timezone.now().year,
            'logo_url': 'https://i.ibb.co/6RPpCJfF/logo-blanco.png',
        })
        msg = EmailMultiAlternatives(subject, '', from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=True)

        return Response({'message': 'Contraseña cambiada correctamente.'}, status=status.HTTP_200_OK)


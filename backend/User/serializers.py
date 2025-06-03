import uuid
import re
from datetime import time
from rest_framework import serializers
from .models import Role, User
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from decimal import Decimal
import cloudinary
import cloudinary.uploader
import time
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator


class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este correo ya está registrado.")]
    )
    username = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=15,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Este usuario ya existe."),
            RegexValidator(
                regex=r'^[a-zA-Z0-9_]{3,15}$',
                message="El usuario solo puede contener letras, números y guiones bajos (3-15 caracteres)."
            )
        ]
    )
    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,15}$",
                message="El nombre solo puede contener letras y espacios."
            )
        ]
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,15}$",
                message="El apellido solo puede contener letras y espacios."
            )
        ]
    )
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        max_length=30,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'address', 'phone', 'image']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("La contraseña debe tener al menos una mayúscula.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("La contraseña debe tener al menos una minúscula.")
        if not re.search(r'[\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]', value):
            raise serializers.ValidationError("La contraseña debe tener al menos un número o símbolo.")
        if ' ' in value:
            raise serializers.ValidationError("La contraseña no puede contener espacios.")
        return value

    def create(self, validated_data):
        username = validated_data.get('username')
        if not username or username.strip() == '':
            base_username = validated_data['email'].split('@')[0][:10]
            username = f"{base_username}_{uuid.uuid4().hex[:4]}"
        user = User.objects.create(
            username=username,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data['email'],
            address=validated_data.get('address', ''),
            phone=validated_data.get('phone', ''),
            image=validated_data.get('image')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.address = validated_data.get('address', instance.address)
        instance.phone = validated_data.get('phone', instance.phone)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        image = validated_data.get('image', None)
        if image:
            instance.image = image

        instance.save()
        return instance


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'





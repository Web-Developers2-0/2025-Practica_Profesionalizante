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

class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Este correo ya está registrado.")]
    )
    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name', 'email', 'password', 'address', 'phone', 'image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data.get('username', ''),      # Opcional
            first_name=validated_data.get('first_name', ''),  # Opcional
            last_name=validated_data.get('last_name', ''),    # Opcional
            email=validated_data['email'],
            address=validated_data.get('address', ''),        # Opcional
            phone=validated_data.get('phone', ''),            # Opcional
            image=validated_data.get('image')                 # Opcional
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

    # Asignar directamente la imagen
        image = validated_data.get('image', None)
        if image:
             instance.image = image  # << No usar uploader

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
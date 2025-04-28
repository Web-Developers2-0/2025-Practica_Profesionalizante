from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import Group 


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, role=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, role, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True) 
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, default='',blank=False, null=True) 
    first_name = models.CharField(max_length=30,default='', blank=False)
    last_name = models.CharField(max_length=30,default='', blank=False)
    address = models.CharField(max_length=255, default='', blank=False)
    phone = models.CharField(max_length=20, default='', blank=False)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    is_superuser = models.BooleanField(default=False)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True, default=1, related_name='users')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def user_orders(self):
        from Order.models import Order  # import interno (lazy import)
        return Order.objects.filter(id_user=self)

    
    class Meta:
        db_table = 'user'

class Role(models.Model):
    id_role = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45, blank=False)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'roles'
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.name
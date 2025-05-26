from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    available = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id_product', 'name', 'description', 'price', 'discount', 'stock', 'image',
            'pages', 'format', 'weight', 'isbn', 'category', 'calification', 'available'
        ]

    def get_available(self, obj):
        return obj.stock > 0
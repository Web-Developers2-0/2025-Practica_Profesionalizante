from django.contrib import admin
from .models import Category, Product

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id_category', 'name')

admin.site.register(Category, CategoryAdmin)

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id_product', 'name', 'description', 'price', 'discount', 'stock', 'image', 'pages', 'format', 'weight', 'isbn', 'category')

admin.site.register(Product, ProductAdmin)



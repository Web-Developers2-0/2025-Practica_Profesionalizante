from django.db import models

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    name = models.CharField(max_length=45, blank=False)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name    

class Product(models.Model):
    id_product = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=5000, blank=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    discount = models.IntegerField(blank=True, null=True)
    stock = models.IntegerField(blank=False)
    image = models.CharField(max_length=255, blank=True, null=True)
    pages = models.IntegerField(blank=True, null=True)
    format = models.CharField(max_length=45, blank=True, null=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    isbn = models.CharField(max_length=45, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    calification = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)

    class Meta: 
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.name
    
    
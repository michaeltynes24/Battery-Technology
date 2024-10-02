from rest_framework import serializers
from .models import Listings, Category

class ListingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listings
        fields = ('id', 'title', 'image', 'category', 'seller', 'description', 'price', 'created_at', 'updated_at')  

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')
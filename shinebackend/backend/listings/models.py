from django.db import models
from django.urls import reverse

import uuid

class Category(models.Model):
    name = models.CharField(max_length=20, primary_key=True, unique=True)
    help_text = "Enter a category (e.g. Furniture)"
    def __str__(self):
        return self.name
    def get_absolute_url(self):
        return reverse('category-detail', args=[str(self.name)])


class Listings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4) #help_text= "Unique ID for this particular listing"
    title = models.CharField(max_length=32)
    image = models.CharField( max_length=200, null=True, blank=True)
    category = models.CharField(max_length=20, null=True, choices = (("Apparel", "Apparel"), ("HomeFurniture", "Home Furniture"), ("Free Stuff", "Free Stuff"),
  ("Vehicles", "Vehicles"), ("Toys&Games", "Toys & Games"), ("Plants&Outdoor", "Plants & Outdoor"),
  ("SportingGoods", "Sporting Goods"), ("PropertyRentals", "Property Rentals"), ("PetSupplies", "Pet Supplies"),
  ("Hobbies", "Hobbies"), ("MusicInstruments", "Music Instruments"), ("Textbooks&Books", "Textbooks & Books"),
  ("Entertainment", "Entertainment"), ("Clothes", "Clothes"), ("Health&Beauty", "Health & Beauty"),
  ("Jewelry&Watches", "Jewelry & Watches"), ("Electronics", "Electronics"), ("OfficeSupplies", "Office Supplies"),
  ("SeasonalDecorations", "Seasonal Decorations"), ("HomeAppliances", "Home Appliances")))
    seller = models.CharField(max_length=35)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.id} {self.title}'
    def get_absolute_url(self):
        return reverse('listings-detail', args=[str(self.id)])


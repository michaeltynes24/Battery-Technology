# from django.db import models

# # Create your models here.
# from django.contrib.auth.base_user import BaseUserManager
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
# from django.db import models
# from django.contrib.auth.models import User


# class EnergyUsage(models.Model):
#     timestamp = models.DateTimeField()
#     kwh = models.FloatField()
#     #link data to a user
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "EnergyUsage")

# class Optimizer(models.Model):
#     timeOfDay = models.TimeField()
#     kwh = models.FloatField()
#     #link data to a user
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "EnergyUsage")

# class Savings(models.Model):
#     NoBatteryPrice = models.PositiveIntegerField()
#     LithiumPrice = models.PositiveIntegerField()
#     SodiumPrice = models.PositiveIntegerField()
#     #link data to a user
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "EnergyUsage")

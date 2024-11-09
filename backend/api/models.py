from django.db import models
from django.contrib.auth.models import User



class UserExtension(models.Model):
    batterytype = models.CharField(max_length=100, blank=True, null=True)
    utility = models.CharField(max_length=100, blank=True, null=True)
    importGreenButton = models.BooleanField(default=False)
    batterySize = models.IntegerField(default=50)
    solar = models.BooleanField(default=False)
    username = models.CharField(max_length=100, blank=True, null=True)

class EnergyUsage(models.Model):
    timestamp = models.DateTimeField()
    kwh = models.FloatField()
    #link data to a user
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "EnergyUsage")

class Optimizer(models.Model):
    timeOfDay = models.TimeField()
    kwh = models.FloatField()
    #link data to a user
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "Optimizer")

class Savings(models.Model):
    NoBatteryPrice = models.PositiveIntegerField()
    LithiumPrice = models.PositiveIntegerField()
    SodiumPrice = models.PositiveIntegerField()
    #link data to a user
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = "Savings")

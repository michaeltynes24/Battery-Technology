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


class FileModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_files")
    file_hash = models.CharField(max_length=64, unique=False)
    meter = models.CharField(blank=True,null=True)
    date = models.CharField(blank=True,null=True)
    time = models.CharField(blank=True,null=True)
    duration = models.CharField(blank=True,null=True)
    consumption = models.CharField(blank=True,null=True)
    generation = models.CharField(blank=True,null=True)
    net = models.CharField(blank=True,null=True)
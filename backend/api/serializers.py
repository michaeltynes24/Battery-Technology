from django.contrib.auth.models import User
from rest_framework import serializers
from .models import EnergyUsage,Optimizer,Savings,UserExtension


class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id","username", "email", "password",'first_name','last_name']
            extra_kwargs = {"password": {"write_only": True}} #no one can read password

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        def validate_username(self, value):
        # Check if the username already exists in the database
            if UserExtension.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username already exists. Please choose another one.")
            return value
        
class OptimizerSerializer(serializers.ModelSerializer):
       class Meta:
              model = Optimizer
              fields = ['timestamp', 'kwh','owner']
              extra_kwargs = {'owner':{'read_only': True}}

class EnergyUsageSerializer(serializers.ModelSerializer):
       class Meta:
              model = EnergyUsage
              fields = ['timestamp', 'kwh','owner']
              extra_kwargs = {'owner':{'read_only': True}}

class SavingsSerializer(serializers.ModelSerializer):
       class Meta:
              model = Savings
              fields = ['NoBatteryPrice', 'LithiumPrice','SodiumPrice']
              extra_kwargs = {'owner':{'read_only': True}}

class UserExtensionSerializer(serializers.ModelSerializer):
       class Meta:
              model = UserExtension
              fields = ['batterytype','utility','importGreenButton','batterySize','solar','username' ]
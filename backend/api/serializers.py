from django.contrib.auth.models import User
from rest_framework import serializers
from .models import EnergyUsage,Optimizer,Savings,UserExtension, FileModel


class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["id","username", "email", "password",'first_name','last_name']
            extra_kwargs = {"password": {"write_only": True}} #no one can read password
        def __init__(self, *args, **kwargs):
            super(UserSerializer, self).__init__(*args, **kwargs)
            # If 'instance' is provided, it indicates an update operation, so set username/password to read-only
            if self.instance:
                self.fields['username'].read_only = True
                self.fields['password'].read_only = True

        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        def validate_username(self, value):
        # Check if the username already exists in the database
            if UserExtension.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username already exists. Please choose another one.")
            return value
        
        def update(self, instance, validated_data):
            # Check if password is in validated data, if so, hash it
            password = validated_data.pop("password", None)
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            
            if password:
                instance.set_password(password)  # Hash the password before saving
            
            instance.save()
            return instance
    
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
       def __init__(self, *args, **kwargs):
            super(UserExtensionSerializer, self).__init__(*args, **kwargs)
            # If 'instance' is provided, it indicates an update operation, so set username/password to read-only
            if self.instance:
                self.fields['username'].read_only = True

class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileModel
        fields = ['date', 'meter', 'time', 'duration', 'consumption', 'generation', 'net']


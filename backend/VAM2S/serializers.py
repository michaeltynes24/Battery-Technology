# serializers.py
from rest_framework import serializers
from .models import JsonModel
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError


# Import the user model from Django's authentication module
UserModel = get_user_model()

# Serializer for user registration
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    # Custom create method to handle user registration
    def create(self, clean_data):
        # Create a user object using the provided email and password
        user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
        
        # Set the username and save the user object
        user_obj.username = clean_data['username']
        user_obj.save()

        # Return the created user object
        return user_obj

# Serializer for user login
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    # Custom method to check user authentication
    def check_user(self, clean_data):
        # Authenticate the user using the provided email and password
        user = authenticate(username=clean_data['email'], password=clean_data['password'])

        # If authentication fails, raise a validation error
        if not user:
            raise ValidationError('User not found')

        # Return the authenticated user
        return user

# Serializer for user data
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')

# Serializer for JSON file model
class JsonModelSerializer(serializers.Serializer):
    file = serializers.FileField()

    # Custom create method to handle JSON file creation
    def create(self, validated_data):
        # Create a JsonModel object with the validated file data
        return JsonModel.objects.create(file=validated_data['file'])

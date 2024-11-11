from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status
from .serializers import UserSerializer, EnergyUsageSerializer, SavingsSerializer,OptimizerSerializer, UserExtensionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EnergyUsage,Savings,Optimizer, UserExtension
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

class GetUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        
        if username:
            return User.objects.filter(username=username)
        else:
            return User.objects.all()  
        
    def put(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=False)  # Set partial=True for partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateUserExtension(generics.CreateAPIView, generics.ListCreateAPIView):
    queryset = UserExtension.objects.all()
    serializer_class = UserExtensionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Retrieve the 'username' from the request query parameters
        username = self.request.query_params.get('username', None)
        
        if username:
            return UserExtension.objects.filter(username=username)
        else:
            return UserExtension.objects.all()  
        
class InputEnergyUsageView(generics.ListCreateAPIView):
    queryset = EnergyUsage.objects.all()
    serializer_class = EnergyUsageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return EnergyUsage.objects.filter(owner = user)
    
class InputOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Optimizer.objects.filter(owner = user)
    
class InputSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Savings.objects.filter(owner = user)
    



class DeleteEnergyUsageView(generics.ListCreateAPIView):
    serializer_class = EnergyUsageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return EnergyUsage.objects.filter(owner = user)
    
class DeleteOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Optimizer.objects.filter(owner = user)
    
class DeleteSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Savings.objects.filter(owner = user)   
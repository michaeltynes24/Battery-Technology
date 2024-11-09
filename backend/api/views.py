from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, EnergyUsageSerializer, SavingsSerializer,OptimizerSerializer, UserExtensionSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EnergyUsage,Savings,Optimizer, UserExtension

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateUserExtension(generics.CreateAPIView):
    queryset = UserExtension.objects.all()
    serializer_class = UserExtensionSerializer
    permission_classes = [AllowAny]

    # def get_queryset(self):
    #     user = self.request.user
    #     return UserExtension.objects.filter(userna=user)

    # def perform_create(self, serializer):
    #     if serializer.is_valid():
    #         serializer.save(owner=self.request.user)
    #     else:
    #         print(serializer.errors)

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
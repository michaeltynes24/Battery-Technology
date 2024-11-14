from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status, viewsets
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
          
class UpdateUserAPIView(viewsets.ModelViewSet): 
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]


    def get_object(self):
    # This method retrieves the object based on username instead of id
        username = self.kwargs.get("username")
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)     
        
    def put(self, request, username=None):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)  # Set partial=True for partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserExtensionAPIView(viewsets.ModelViewSet): 
    queryset = UserExtension.objects.all()
    serializer_class = UserExtensionSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]


    def get_object(self):
    # This method retrieves the object based on username instead of id
        username = self.kwargs.get("username")
        try:
            return UserExtension.objects.get(username=username)
        except UserExtension.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)     
        
    def put(self, request, username=None):
        try:
            user = UserExtension.objects.get(username=username)
        except UserExtension.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserExtensionSerializer(user, data=request.data, partial=True)  # Set partial=True for partial updates
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
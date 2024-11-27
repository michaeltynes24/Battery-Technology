from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,status, viewsets
from .serializers import UserSerializer, EnergyUsageSerializer, SavingsSerializer,OptimizerSerializer, UserExtensionSerializer, FileModelSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EnergyUsage,Savings,Optimizer, UserExtension
from rest_framework.response import Response
from rest_framework.views import APIView
#for file uploads
import os
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes
from .models import FileModel

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
    
class UserFileDataView(generics.ListAPIView):
    serializer_class = FileModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileModel.objects.filter(user=self.request.user)
 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])

def upload_csv(request):
    print(request.headers.get('Authorization'))
    if request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']

        # Save file temporarily
        file_path = default_storage.save(f'media/{file.name}', file)
        print("file saved...\n")
        print(f"Authenticated: {request.user.is_authenticated}, User: {request.user}")


        try:
            df = pd.read_csv(file_path, skiprows=13)  # Read CSV into a Pandas DataFrame
            print("file parsed...\n")
        except Exception as e:
            os.remove(file_path)
            return Response({"error": f"Failed to parse the CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Associate data with the authenticated user

       # if not request.user.is_authenticated:
       #     print("User must be logged in to upload")
       #     return JsonResponse({"error": "User must be logged in to upload"}, status=403)
        try:
            print(f"trying to save the data...\n{request.user}{request.user.is_anonymous}")
            for _, row in df.iterrows():
                FileModel.objects.create(
                    user=request.user,  # Link to the logged-in user
                    date=row['Meter Number'],
                    meter=row['Date'],
                    time=row['Start Time'],
                    duration=row['Duration'],
                    consumption=row['Consumption'],
                    generation=row['Generation'],
                    net=row['Net']
                )
            os.remove(file_path)
            return JsonResponse({"message": "File uploaded and processed successfully!"}, status=200)
        except Exception as e:
            os.remove(file_path)
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


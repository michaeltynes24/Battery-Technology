from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from .serializers import (
    UserSerializer,
    EnergyUsageSerializer,
    SavingsSerializer,
    OptimizerSerializer,
    UserExtensionSerializer,
    FileModelSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import EnergyUsage, Savings, Optimizer, UserExtension, FileModel
from rest_framework.response import Response
from rest_framework.views import APIView
import hashlib
import os
import pandas as pd
from django.http import JsonResponse
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings

# Import Julia and initialize the Julia environment
from julia.api import Julia
jl = Julia(compiled_modules=False)  # Initialize Julia without precompiled modules
from julia import Main

# Include your Julia scripts
Main.include(os.path.join(settings.BASE_DIR, 'api', 'energySavings.jl'))
Main.include(os.path.join(settings.BASE_DIR, 'api', 'Ch_DisCh.jl'))
Main.include(os.path.join(settings.BASE_DIR, 'api', 'batteryTest.jl'))
Main.include(os.path.join(settings.BASE_DIR, 'api', 'batteryFunction.jl'))
Main.include(os.path.join(settings.BASE_DIR, 'api', 'BatteryDeg.jl'))

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
        return EnergyUsage.objects.filter(owner=user)


class InputOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Optimizer.objects.filter(owner=user)


class InputSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Savings.objects.filter(owner=user)


class DeleteEnergyUsageView(generics.ListCreateAPIView):
    serializer_class = EnergyUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return EnergyUsage.objects.filter(owner=user)


class DeleteOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Optimizer.objects.filter(owner=user)


class DeleteSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Savings.objects.filter(owner=user)


class UserFileDataView(generics.ListAPIView):
    serializer_class = FileModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileModel.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    if request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        # Check to see if file exists before saving
        existing_file = FileModel.objects.filter(file_hash=generate_file_hash(file)).exists()
        if existing_file:
            return JsonResponse({"error": "File has already been uploaded."}, status=400)
        # Save file temporarily
        file_path = default_storage.save(f'media/{file.name}_{request.user}', file)

        try:
            df = pd.read_csv(file_path)  # Read CSV into a Pandas DataFrame
        except Exception as e:
            os.remove(file_path)
            return Response({"error": f"Failed to parse the CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert DataFrame to dictionary
        df_dict = df.to_dict(orient='list')

        # Call Julia functions and get results
        try:
            # Assuming your Julia functions are structured to accept data and return results
            # Adjust the function names and parameters as necessary

            # Energy Savings
            Main.include(os.path.join(settings.BASE_DIR, 'api', 'energySavings.jl'))
            energy_savings = Main.eval("spending_with_batteries")  # Get the spending_with_batteries dictionary from Julia
            energy_savings = {k: float(v) for k, v in energy_savings.items()}

            # Battery Optimization Test
            Main.include(os.path.join(settings.BASE_DIR, 'api', 'batteryTest.jl'))
            optimal_cost = Main.eval("optimal_cost")
            battery_test_results = {'optimal_cost': float(optimal_cost)}

            # Battery Function Optimization
            Main.include(os.path.join(settings.BASE_DIR, 'api', 'batteryFunction.jl'))
            battery_function_results = Main.eval("results")
            battery_function_results = {
                'objective_value': float(battery_function_results['objective_value']),
                # Add other relevant data from results if needed
            }

            # Battery Degradation
            Main.include(os.path.join(settings.BASE_DIR, 'api', 'BatteryDeg.jl'))
            battery_deg_results = Main.eval("results")
            battery_deg_results = {
                'objective_value': float(battery_deg_results['objective_value']),
                # Add other relevant data from results if needed
            }

            # Save data to the database
            for idx, row in df.iterrows():
                FileModel.objects.create(
                    user=request.user,  # Link to the logged-in user
                    file_hash=generate_file_hash(file),  # Create file hash to identify file and prevent duplicates
                    meter=row.get('Meter Number', ''),
                    date=row.get('Date', ''),
                    time=row.get('Start Time', ''),
                    duration=row.get('Duration', ''),
                    consumption=row.get('Consumption', 0.0),
                    generation=row.get('Generation', 0.0),
                    net=row.get('Net', 0.0)
                )
            os.remove(file_path)
            return JsonResponse({
                "message": "File uploaded and processed successfully!",
                "energy_savings": energy_savings,
                "battery_test_results": battery_test_results,
                "battery_function_results": battery_function_results,
                "battery_degradation_results": battery_deg_results
            }, status=200)
        except Exception as e:
            os.remove(file_path)
            return JsonResponse({"error": f"Failed to process the file with Julia functions: {str(e)}"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


def generate_file_hash(file):
    hasher = hashlib.sha256()
    for chunk in file.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def uploaded_files(request):
    files = FileModel.objects.filter(user=request.user)
    serializer = FileModelSerializer(files, many=True)
    return Response(serializer.data)

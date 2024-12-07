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
from .julia_initializer import Main  # Import the centralized Julia initialization


def generate_file_hash(file):
    """Generate a unique hash for the uploaded file."""
    hasher = hashlib.sha256()
    for chunk in file.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    """Handle CSV file uploads and process using Julia functions."""
    if request.method == 'POST' and request.FILES['file']:
        file = request.FILES['file']
        existing_file = FileModel.objects.filter(file_hash=generate_file_hash(file)).exists()
        if existing_file:
            return JsonResponse({"error": "File has already been uploaded."}, status=400)

        file_path = default_storage.save(f'media/{file.name}_{request.user}', file)

        try:
            # Detect the header dynamically
            with open(file_path, 'r') as f:
                lines = f.readlines()
            header_index = next((i for i, line in enumerate(lines) if line.strip().startswith("Meter Number,Date")), None)
            if header_index is None:
                raise ValueError("Invalid CSV format. Header row not found.")

            # Read the CSV starting from the header row
            df = pd.read_csv(file_path, skiprows=header_index)

        except Exception as e:
            os.remove(file_path)
            return JsonResponse({"error": f"Failed to parse the CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call Julia functions with detailed error handling
            try:
                energy_savings = Main.eval("spending_with_batteries()")
                energy_savings = {k: float(v) for k, v in energy_savings.items()}
            except Exception as julia_error:
                raise RuntimeError(f"Error in 'spending_with_batteries': {julia_error}")

            try:
                optimal_cost = Main.eval("optimal_cost()")
                battery_test_results = {'optimal_cost': float(optimal_cost)}
            except Exception as julia_error:
                raise RuntimeError(f"Error in 'optimal_cost': {julia_error}")

            # Save data to the database
            for idx, row in df.iterrows():
                FileModel.objects.create(
                    user=request.user,
                    file_hash=generate_file_hash(file),
                    meter=row.get("Meter Number", ""),
                    date=row.get("Date", ""),
                    time=row.get("Start Time", ""),
                    duration=row.get("Duration", ""),
                    consumption=row.get("Consumption", 0.0),
                    generation=row.get("Generation", 0.0),
                    net=row.get("Net", 0.0),
                )

            os.remove(file_path)
            return JsonResponse({
                "message": "File uploaded and processed successfully!",
                "energy_savings": energy_savings,
                "battery_test_results": battery_test_results
            }, status=200)

        except RuntimeError as julia_error:
            os.remove(file_path)
            return JsonResponse({"error": f"Failed to process the file with Julia: {str(julia_error)}"}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def uploaded_files(request):
    """Retrieve a list of uploaded files for the logged-in user."""
    files = FileModel.objects.filter(user=request.user)
    serializer = FileModelSerializer(files, many=True)
    return Response(serializer.data)


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
        return User.objects.all()


class UpdateUserAPIView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]

    def get_object(self):
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

        serializer = UserSerializer(user, data=request.data, partial=True)
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

        serializer = UserExtensionSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateUserExtension(generics.CreateAPIView, generics.ListCreateAPIView):
    queryset = UserExtension.objects.all()
    serializer_class = UserExtensionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username:
            return UserExtension.objects.filter(username=username)
        return UserExtension.objects.all()


class InputEnergyUsageView(generics.ListCreateAPIView):
    queryset = EnergyUsage.objects.all()
    serializer_class = EnergyUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EnergyUsage.objects.filter(owner=self.request.user)


class InputOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Optimizer.objects.filter(owner=self.request.user)


class InputSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Savings.objects.filter(owner=self.request.user)


class DeleteEnergyUsageView(generics.ListCreateAPIView):
    serializer_class = EnergyUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EnergyUsage.objects.filter(owner=self.request.user)


class DeleteOptimizer(generics.ListCreateAPIView):
    serializer_class = OptimizerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Optimizer.objects.filter(owner=self.request.user)


class DeleteSavings(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Savings.objects.filter(owner=self.request.user)


class UserFileDataView(generics.ListAPIView):
    serializer_class = FileModelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileModel.objects.filter(user=self.request.user)

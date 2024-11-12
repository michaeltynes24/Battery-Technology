from django.urls import path
from . import views

app_name = "green_button"

urlpatterns = [
    path("authorize/<str:provider_name>/", views.green_button_authorize, name="authorize"),
    path("callback/<str:provider_name>/", views.green_button_callback, name="callback"),
    path("dashboard/", views.fetch_energy_data, name="dashboard"),
]

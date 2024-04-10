from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shineapp.urls')),  
]


from django.http import HttpResponse
from django.urls import path, include

def home_view(request):
    return HttpResponse("Welcome to the API server.")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('shineapp.urls')),
    path('', home_view, name='home'),  # Add this line for the root path
]
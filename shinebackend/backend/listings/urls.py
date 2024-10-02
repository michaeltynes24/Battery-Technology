from django.urls import path
from . import views
# from .views import getListings

urlpatterns = [
     #path('', include(router.urls)),
     path('get/<str:category>/', views.getListings, name="listings"),
     path('my/<str:pk>', views.getMyListings, name="mylistings"),
     path('create/', views.createListing, name="create"),
     ]

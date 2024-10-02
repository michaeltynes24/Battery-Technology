
from django.urls import path
from . import views
from .views import UploadJsonView, Delete_File
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('hello/', views.api_hello, name='api_hello'),
    path('json_upload/', UploadJsonView.as_view(), name="json_upload"),
    path('grabJson/<str:filename>/<str:period>/', views.grab_json, name='grabJson'),
    path('file_list/', views.file_list, name='file_list'),
 	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout/', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
    path('selectionchart/<str:filename>/', views.SelectionChart, name='selectionchart'),
    path('grab_cost_data/<str:filename>/<str:period>/', views.grab_cost_data, name='grab_cost_data'),
    path('DeleteFile/<str:filename>/', views.Delete_File.as_view(), name='DeleteFile'),
]


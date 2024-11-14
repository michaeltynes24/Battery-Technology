from django.urls import path
from . import views

urlpatterns = [
    path('userextension/', views.CreateUserExtension.as_view(), name = 'User-Extension'),
    path('userextension/<str:username>/update/', views.UpdateUserExtensionAPIView.as_view({'put':'update'}), name = 'user_extension_update'),
    path('energyusage/', views.InputEnergyUsageView.as_view(), name = 'Energy-Usage-History'),
    path('optimizer/', views.InputOptimizer.as_view(), name = 'Savings-List'),
    path('savings/', views.InputSavings.as_view(), name = 'Optimizer-List'),
    path('energyusage/delete/<int:pk>/', views.DeleteEnergyUsageView.as_view(), name = 'delete-energy-usage'),
    path('savings/delete/<int:pk>/', views.DeleteSavings.as_view(), name = 'delete-savings'),
    path('energyusage/delete/<int:pk>/', views.DeleteOptimizer.as_view(), name = 'delete-optimizer'),

]
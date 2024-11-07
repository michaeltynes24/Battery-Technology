from django.urls import path
from . import views

urlpatterns = [
    path('energyusage/', views.InputEnergyUsageView.as_view(), name = 'Energy-Usage-History'),
    path('savings/', views.InputOptimizer.as_view(), name = 'Savings-List'),
    path('optimizer/', views.InputSavings.as_view(), name = 'Optimizer-List'),
    path('energyusage/delete/<int:pk>/', views.DeleteEnergyUsageView.as_view(), name = 'delete-energy-usage'),
    path('savings/delete/<int:pk>/', views.DeleteSavings.as_view(), name = 'delete-savings'),
    path('energyusage/delete/<int:pk>/', views.DeleteOptimizer.as_view(), name = 'delete-optimizer'),

]
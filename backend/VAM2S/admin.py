from django.contrib import admin
from .models import JsonModel
from .models import AppUser

admin.site.register(JsonModel)

admin.site.register(AppUser)



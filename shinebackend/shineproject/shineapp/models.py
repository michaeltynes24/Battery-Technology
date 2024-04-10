from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    battery_type = models.CharField(max_length=50)
    utility_company = models.CharField(max_length=50)
    import_energy_data = models.BooleanField(default=False)
    battery_size = models.IntegerField()
    has_solar = models.BooleanField(default=False)

    def __str__(self):
        return self.email

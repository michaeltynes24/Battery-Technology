# Generated by Django 5.0.4 on 2024-04-09 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('battery_type', models.CharField(max_length=50)),
                ('utility_company', models.CharField(max_length=50)),
                ('import_energy_data', models.BooleanField(default=False)),
                ('battery_size', models.IntegerField()),
                ('has_solar', models.BooleanField(default=False)),
            ],
        ),
    ]
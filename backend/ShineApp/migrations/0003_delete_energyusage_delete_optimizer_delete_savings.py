# Generated by Django 5.0.3 on 2024-11-07 04:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ShineApp', '0002_optimizer_savings'),
    ]

    operations = [
        migrations.DeleteModel(
            name='EnergyUsage',
        ),
        migrations.DeleteModel(
            name='Optimizer',
        ),
        migrations.DeleteModel(
            name='Savings',
        ),
    ]
# Generated by Django 3.0.2 on 2020-05-06 04:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_auto_20200506_0347"),
    ]

    operations = [
        migrations.RemoveField(model_name="user", name="auth_token",),
    ]
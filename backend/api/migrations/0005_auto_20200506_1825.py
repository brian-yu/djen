# Generated by Django 3.0.2 on 2020-05-06 18:25

from django.db import migrations, models
import shortuuid.main


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_remove_user_auth_token"),
    ]

    operations = [
        migrations.AlterField(
            model_name="submission",
            name="id",
            field=models.UUIDField(
                default=shortuuid.main.ShortUUID.uuid,
                editable=False,
                primary_key=True,
                serialize=False,
            ),
        ),
    ]
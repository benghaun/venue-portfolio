# Generated by Django 2.1.2 on 2018-11-23 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_auto_20181123_1309'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='fb',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='user',
            name='insta',
            field=models.TextField(default=''),
        ),
    ]
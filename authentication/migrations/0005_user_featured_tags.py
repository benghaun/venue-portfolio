# Generated by Django 2.1.2 on 2018-11-22 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_user_about_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='featured_tags',
            field=models.TextField(default='{}'),
        ),
    ]
# Generated by Django 2.1.2 on 2018-11-15 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20181108_1736'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='assistant',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]

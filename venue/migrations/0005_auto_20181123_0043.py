# Generated by Django 2.1.2 on 2018-11-22 22:43

from django.db import migrations, models
import django_postgres_extensions.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('venue', '0004_auto_20181111_1456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='tags',
            # field=django_postgres_extensions.models.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, form_size=None, size=None),
            field=django_postgres_extensions.models.fields.ArrayField(base_field=models.CharField(max_length=200),
                                                                      blank=True, size=None),
        ),
    ]

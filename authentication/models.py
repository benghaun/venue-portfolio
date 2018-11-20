from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    liked_images = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    assistant = models.IntegerField(null=True, blank=True, default=None)
    about_text = models.CharField(max_length=300, default="")


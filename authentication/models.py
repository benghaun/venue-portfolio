from django.db import models
from django_postgres_extensions.models.fields import ArrayField
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    liked_images = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    assistant = models.IntegerField(null=True, blank=True, default=None)
    about_text = models.CharField(max_length=300, default="")
    featured_tags = models.TextField(default="{}")
    profile_txt_1 = models.CharField(default="Insert a short description of yourself here", max_length=300)
    profile_txt_2 = models.CharField(default="Insert more about yourself here e.g work experiences", max_length=300)
    skillset = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    software_and_mediums = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    fb = models.TextField(default="")
    insta = models.TextField(default="")


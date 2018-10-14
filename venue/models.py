from django.db import models
from django.contrib.postgres.fields import ArrayField


class Image(models.Model):
    tags = ArrayField(models.CharField(max_length=200), blank=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.id


class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name

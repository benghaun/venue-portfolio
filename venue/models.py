from django.db import models
from django.contrib.postgres.fields import ArrayField


class Image(models.Model):
    tags = ArrayField(models.CharField(max_length=200), blank=True)
    name = models.CharField(max_length=200)
    title = models.TextField()
    ext = models.CharField(max_length=5)
    description = models.TextField()
    uploader_id = models.IntegerField()

    def __str__(self):
        return self.id


class Tag(models.Model):
    name = models.CharField(max_length=13, unique=True)
    description = models.TextField()
    uploader_id = models.IntegerField()

    def __str__(self):
        return self.name

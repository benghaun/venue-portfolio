from django.db import models
from django_postgres_extensions.models.fields import ArrayField
from authentication.models import User


class Image(models.Model):
    tags = ArrayField(models.CharField(max_length=200), blank=True)
    name = models.CharField(max_length=200)
    title = models.TextField()
    ext = models.CharField(max_length=5)
    description = models.TextField()
    uploader_id = models.IntegerField()
    likes = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)


class Tag(models.Model):
    class Meta:
        unique_together = (('name', 'uploader_id'),)
    name = models.CharField(max_length=13)
    description = models.TextField()
    uploader_id = models.IntegerField()

    def __str__(self):
        return self.name



import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
S3_BUCKET = os.environ.get('S3_BUCKET')


def assistant(request):
    return render(request, 'assistant/assistant.html')


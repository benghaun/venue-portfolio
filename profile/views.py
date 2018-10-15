import os
import json
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
S3_BUCKET = os.environ.get('S3_BUCKET')


def profile(request):
    return render(request, 'profile/profile.html')


def category(request, category):
    images = Image.objects.filter(tags__contains=[category.lower()])
    urls = []
    for image in images:
        image_id = str(image.id)
        s3 = boto3.client('s3', region_name='eu-west-3')
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': image_id},
                                        ExpiresIn=60)
        urls.append(url)

    try:
        tag_description = Tag.objects.get(name=category.lower()).description
    except Tag.DoesNotExist:
        tag_description = ""

    return render(request, 'profile/category.html', {'urls': urls, 'category': category, 'description': tag_description})


def image(request, category):
    return render(request, 'profile/img-view.html')

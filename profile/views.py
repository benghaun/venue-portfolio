import os
import json
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image
S3_BUCKET = os.environ.get('S3_BUCKET')


def profile(request):
    return render(request, 'profile/profile.html')


def category(request, category):
    images = Image.objects.filter(tags__contains=[category.lower()])
    urls = []
    for image in images:
        image_id = str(image.id)
        print(image.tags)
        print(image_id)
        s3 = boto3.client('s3', region_name='eu-west-3')
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': image_id},
                                        ExpiresIn=60)
        urls.append(url)

    return render(request, 'category/category.html', {'urls': urls})
import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
from venue.utils import in_bucket
S3_BUCKET = os.environ.get('S3_BUCKET')


def profile(request):
    return render(request, 'profile/profile.html')


def category(request, category):
    images = Image.objects.filter(tags__contains=[category.lower()])
    urls = {}
    for i in range(len(images)):
        image = images[i]
        image_id = str(image.id)
        key = image_id + "." + image.ext
        s3 = boto3.client('s3', region_name='eu-west-3')
        if in_bucket("resized/" + key, s3=s3):
            s3_key = "resized/" + key
        else:
            s3_key = key
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': s3_key},
                                        ExpiresIn=86400)
        urls[url] = {'key': image_id, 'idx': i}

    try:
        tag_description = Tag.objects.get(name=category.lower()).description
    except Tag.DoesNotExist:
        tag_description = ""

    return render(request, 'profile/category.html', {'urls': urls, 'category': category, 'description': tag_description})


def image(request, category):
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = {}
    thumbnail_urls = {}
    selected = request.GET.get("selected")
    images = Image.objects.filter(tags__contains=[category.lower()])
    image_ids = []
    for i in range(images.count()):
        image = images[i]
        image_id = str(image.id)
        image_ids.append(image_id)
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': image_id + "." + image.ext},
                                        ExpiresIn=86400)
        urls[url] = {"key": image_id, "idx": i}
        thumbnail_url = s3.generate_presigned_url(ClientMethod="get_object",
                                                  Params={'Bucket': S3_BUCKET,
                                                          'Key': 'resized/' + image_id + "." + image.ext},
                                                  ExpiresIn=86400)
        thumbnail_urls[thumbnail_url] = {"key": image_id, "idx": i}

    if selected not in image_ids:
        selected = None

    return render(request, 'profile/img-view.html', {'urls': urls, 'selected': selected, 'thumbnail_urls': thumbnail_urls})

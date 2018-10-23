import os
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
from venue.utils import in_bucket
S3_BUCKET = os.environ.get('S3_BUCKET')


def profile(request, username):
    return render(request, 'profile/profile.html', {'uploader': username})


def category_view(request, username, category):
    uploader = User.objects.get(username=username)
    images = Image.objects.filter(tags__contains=[category.lower()], uploader_id=uploader.id)
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

    return render(request, 'profile/category.html', {'urls': urls, 'category': category,
                                                     'description': tag_description, 'uploader': username})


def image(request, username, category):
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = {}
    thumbnail_urls = {}
    selected = request.GET.get("selected")
    uploader = User.objects.get(username=username)
    images = Image.objects.filter(tags__contains=[category.lower()], uploader_id=uploader.id)
    image_ids = []
    for i in range(images.count()):
        image = images[i]
        image_id = str(image.id)
        image_ids.append(image_id)
        title = image.title
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': image_id + "." + image.ext},
                                        ExpiresIn=86400)
        urls[url] = {"key": image_id, "idx": i, "title": title}
        thumbnail_url = s3.generate_presigned_url(ClientMethod="get_object",
                                                  Params={'Bucket': S3_BUCKET,
                                                          'Key': 'resized/' + image_id + "." + image.ext},
                                                  ExpiresIn=86400)
        thumbnail_urls[thumbnail_url] = {"key": image_id, "idx": i, "title": title}

    if selected not in image_ids:
        selected = '0'
    selected_title = Image.objects.get(id=int(selected)).title.upper()
    return render(request, 'profile/img-view.html', {'urls': urls, 'selected': selected,
                                                     'thumbnail_urls': thumbnail_urls, 'selected_title': selected_title})


@login_required()
def edit_profile(request):
    return HttpResponse(json.dumps('ok'))
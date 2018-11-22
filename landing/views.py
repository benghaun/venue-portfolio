import os
import json
from django.contrib.auth.decorators import login_required
from authentication.models import User
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
from venue.utils import in_bucket
S3_BUCKET = os.environ.get('S3_BUCKET')


def landing(request, username):
    return render(request, 'landing/landing.html')


def get_image_page(request):
    """
    Gets a page of images as a list of dictionaries.
    Each dictionary contains the url to the image, the image ID, and the uploader username.
    """
    urls = []
    s3 = boto3.client('s3', region_name='eu-west-3')
    page_size = request.GET.get("page_size", 50)
    page_start = request.GET.get("page_start", 0)
    try:
        page_size = int(page_size)
        page_start = int(page_start)
    except ValueError:
        return HttpResponse(status=400, content="Invalid size/start provided")
    image_ids = Image.objects.all().values_list('pk', flat=True).order_by("-id")
    images = Image.objects.filter(id__in=image_ids[page_start:page_start + page_size]).order_by("-id")
    for image in images:
        image_id = str(image.id)
        uploader = User.objects.get(id=int(image.uploader_id)).username
        if in_bucket('resized/' + image_id + "." + image.ext, s3=s3):
            url = s3.generate_presigned_url(ClientMethod="get_object",
                                            Params={'Bucket': S3_BUCKET,
                                                    'Key': 'resized/' + image_id + "." + image.ext}
                                            )
            urls.append({"url": url, "id": image_id, "uploader": uploader})
    return HttpResponse(json.dumps(urls), content_type="application/json")

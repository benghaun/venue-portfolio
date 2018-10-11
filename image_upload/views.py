import os
import json
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image


def upload_view(request):
    return render(request, 'image_upload/upload_page.html')


def sign_s3(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')
    file_name = request.GET.get('file_name')
    file_type = request.GET.get('file_type')
    tags = request.GET.get('tags').split(",")
    s3 = boto3.client('s3', region_name='eu-west-3')
    image = Image(name=file_name, tags=tags)
    image.save()
    image_id = str(image.id)
    presigned_post = s3.generate_presigned_post(
                        Bucket=S3_BUCKET,
                        Key=image_id,
                        Fields={"acl": "public-read", "Content-Type": file_type},
                        Conditions=[
                          {"acl": "public-read"},
                          {"Content-Type": file_type}
                        ],
                        ExpiresIn=60
                        )
    return HttpResponse(json.dumps({
                    'data': presigned_post,
                    'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name),
                    }), content_type="application/json")

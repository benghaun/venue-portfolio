import os
import json
from django.shortcuts import render, HttpResponse, redirect
import boto3
from venue.models import Image, Tag


def upload_view(request):
    tags = Tag.objects.all()
    message = request.GET.get('message')
    return render(request, 'image_upload/upload_page.html', {'tags': tags, 'message': message})


def sign_s3(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')
    file_name = request.GET.get('file_name')
    file_type = request.GET.get('file_type')
    description = request.GET.get('description')
    tags = request.GET.get('tags').lower().split(",")
    tags = [x for x in tags if x]  # remove empty strings
    # remove leading and trailing whitespaces in tags
    for i in range(len(tags)):
        tags[i] = tags[i].strip()
    s3 = boto3.client('s3', region_name='eu-west-3')
    image = Image(name=file_name, tags=tags, description=description)
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


def add_tag(request):
    tag_name = request.POST.get("tag_name")
    tag_description = request.POST.get("tag_description")
    tag = Tag(name=tag_name.lower(), description=tag_description)
    tag.save()
    return redirect('/upload?message=tag%20created')

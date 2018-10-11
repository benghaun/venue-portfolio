import os
import json
from django.shortcuts import render, HttpResponse
import boto3


def upload_view(request):
    return render(request, 'image_upload/upload_page.html')


def sign_s3(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')
    file_name = request.GET.get('file_name')
    file_type = request.GET.get('file_type')

    s3 = boto3.client('s3', region_name='eu-west-3')

    presigned_post = s3.generate_presigned_post(
                        Bucket=S3_BUCKET,
                        Key=file_name,
                        Fields={"acl": "public-read", "Content-Type": file_type},
                        Conditions=[
                          {"acl": "public-read"},
                          {"Content-Type": file_type}
                        ],
                        ExpiresIn=3600
                        )

    return HttpResponse(json.dumps({
                    'data': presigned_post,
                    'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
                    }), content_type="application/json")

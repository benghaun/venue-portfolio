import os
import json
from django.shortcuts import render, HttpResponse
import boto3


def show_images(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')

    s3 = boto3.client('s3', region_name='eu-west-3')
    response = s3.list_objects(Bucket=S3_BUCKET)['Contents']
    image_filenames = [item['Key'] for item in response]
    urls = []
    for filename in image_filenames:
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': filename},
                                        ExpiresIn=60)
        urls.append(url)
    print(urls)
    return render(request, 'image_view/image_view.html', {'urls': urls})


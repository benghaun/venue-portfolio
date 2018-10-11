import os
from django.shortcuts import render
import boto3


def show_images(request):
    S3_BUCKET = os.environ.get('S3_BUCKET')
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = []
    response = s3.list_objects(Bucket=S3_BUCKET).get('Contents')
    if response:
        image_filenames = [item['Key'] for item in response]
        for filename in image_filenames:
            url = s3.generate_presigned_url(ClientMethod="get_object",
                                            Params={'Bucket': S3_BUCKET,
                                                    'Key': filename},
                                            ExpiresIn=60)
            urls.append(url)
    return render(request, 'image_view/image_view.html', {'urls': urls})


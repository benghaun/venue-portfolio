import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image

S3_BUCKET = os.environ.get('S3_BUCKET')


def show_images(request):
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = {}
    response = s3.list_objects(Bucket=S3_BUCKET).get('Contents')
    if response:
        image_filenames = [item['Key'] for item in response]
        for filename in image_filenames:
            url = s3.generate_presigned_url(ClientMethod="get_object",
                                            Params={'Bucket': S3_BUCKET,
                                                    'Key': filename},
                                            ExpiresIn=60)
            tags = ""
            try:
                if filename.isdigit():
                    tags = Image.objects.get(id=filename).tags
                    tags = ", ".join(tags)
            except Image.DoesNotExist:
                pass
            urls[url] = {"key": filename, "tags": tags}
    return render(request, 'image_view/image_view.html', {'urls': urls})


def delete_image(request):
    key = request.POST.get("key")
    s3 = boto3.client('s3', region_name='eu-west-3')
    s3.delete_object(Bucket=S3_BUCKET,
                     Key=key)
    if key.isdigit():
        Image.objects.filter(id=int(key)).delete()
    return HttpResponse(status=200)

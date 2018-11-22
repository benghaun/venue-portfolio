import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag

S3_BUCKET = os.environ.get('S3_BUCKET')


def show_images(request):
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = {}
    response = s3.list_objects(Bucket=S3_BUCKET).get('Contents')
    if response:
        image_filenames = [item['Key'] for item in response]
        for filename in image_filenames:
            if 'resized' not in filename:
                url = s3.generate_presigned_url(ClientMethod="get_object",
                                                Params={'Bucket': S3_BUCKET,
                                                        'Key': filename},
                                                ExpiresIn=86400)
                tags = ""
                try:
                    img_id = filename.split('.')[0]
                    image = Image.objects.get(id=img_id)
                    tags = image.tags
                    tags = ", ".join(tags)
                    title = image.title
                except Image.DoesNotExist:
                    title = ""
                    pass
                urls[url] = {"key": filename, "tags": tags, "title": title}
    return render(request, 'image_view/image_view.html', {'urls': urls})


def delete_image(request):
    key = request.POST.get("key")
    imgid = key.split('.')[0]
    s3 = boto3.client('s3', region_name='eu-west-3')
    s3.delete_object(Bucket=S3_BUCKET,
                     Key=key)
    s3.delete_object(Bucket=S3_BUCKET,
                     Key="resized/"+key)
    Image.objects.filter(id=int(imgid)).delete()
    return HttpResponse(status=200)



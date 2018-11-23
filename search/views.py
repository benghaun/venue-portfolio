import os
import json
import boto3
from django.shortcuts import HttpResponse, render
from authentication.models import User
from venue.models import Tag, Image
from .utils import levenshtein_distance

S3_BUCKET = os.environ.get("S3_BUCKET")


def results_view(request):
    query = request.GET.get("query")
    return render(request, "search/search_results.html", {'query': query})


def image_search_page(request):
    query = request.GET.get("query")
    page_size = request.GET.get("page_size", 50)
    page_start = request.GET.get("page_start", 0)
    try:
        page_size = int(page_size)
        page_start = int(page_start)
    except ValueError:
        return HttpResponse(status=400, content="Invalid size/start provided")
    all_tags = Tag.objects.order_by().values_list("name", flat=True).distinct()
    results = Image.objects.filter(tags__contains=[query.lower()])\
                           .union(Image.objects.filter(title__icontains=query))
    count = results.count()
    if count == 0:
        for tag in all_tags:
            if levenshtein_distance(tag, query) <= 2:
                results = Image.objects.filter(tags__contains=[tag.lower().replace(" ", "")])
                count = results.count()
                break
    if page_size + page_start > count:
        end = count
    else:
        end = page_size + page_start
    results = results.order_by("-id")[page_start:end]
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = []
    for image in results:
        filename = str(image.id) + "." + str(image.ext)
        if 'resized' not in filename:
            url = s3.generate_presigned_url(ClientMethod="get_object",
                                            Params={'Bucket': S3_BUCKET,
                                                    'Key': "resized/" + filename},
                                            ExpiresIn=86400)
            try:
                img_id = filename.split('.')[0]
                image = Image.objects.get(id=img_id)
            except Image.DoesNotExist:
                pass
            urls.append({"url": url, "id": str(image.id), "uploader": User.objects.get(id=image.uploader_id).username})
    return HttpResponse(status=200, content=json.dumps(urls), content_type="application/json")

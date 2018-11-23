import os
import html
import json
from django.contrib.auth.decorators import login_required
from authentication.models import User
from django.db.models import F
from django_postgres_extensions.models.functions import ArrayRemove, ArrayAppend
from django.shortcuts import render, HttpResponse
import boto3
from profile.utils import is_liked
from venue.models import Image, Tag
from venue.utils import in_bucket

S3_BUCKET = os.environ.get('S3_BUCKET')


def profile(request, username):
    about_text = html.escape(User.objects.get(username=username).about_text)
    current_user = request.user.username
    uploader = User.objects.get(username=username)
    featured_tags = json.loads(uploader.featured_tags)
    s3 = boto3.client('s3', region_name='eu-west-3')
    featured_image_ids = []
    for idx in featured_tags:
        tag = featured_tags[idx]['tag']
        i = 0
        if tag == "all":
            images = Image.objects.all()
        else:
            images = Image.objects.filter(uploader_id=uploader.id, tags__contains=[tag.lower().replace(" ", "")]).order_by("-likes")
        most_liked = None
        if images.first() is not None:
            most_liked = images[i]
            while most_liked.id in featured_image_ids:
                i += 1
                if i < images.count():
                    most_liked = images[i]
                else:
                    most_liked = images[0]
            featured_image_ids.append(most_liked.id)
        if most_liked is not None:
            s3_key = "resized/" + str(most_liked.id) + "." + most_liked.ext
        else:
            s3_key = "placeholder"
        featured_tags[idx]['url'] = s3.generate_presigned_url(ClientMethod="get_object",
                                                              Params={'Bucket': S3_BUCKET,
                                                                      'Key': s3_key},
                                                              ExpiresIn=86400)
    return render(request, 'profile/profile.html', {'uploader': username, 'about_text': about_text,
                                                    'current_user': current_user, 'featured_tags': featured_tags})


def category_view(request, username, category):
    uploader = User.objects.get(username=username)
    current_user = request.user.username
    if category == "all":
        images = Image.objects.filter(uploader_id=uploader.id)
    else:
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
                                                     'description': tag_description, 'uploader': username,
                                                     'current_user': current_user})


def image(request, username, category):
    current_user = request.user.username
    s3 = boto3.client('s3', region_name='eu-west-3')
    urls = {}
    thumbnail_urls = {}
    selected = request.GET.get("selected")
    uploader = User.objects.get(username=username)
    try:
        selected_image = Image.objects.get(id=int(selected))
    except Image.DoesNotExist:
        return HttpResponse(404)
    selected_image_tags = selected_image.tags
    if category == "all":
        images = Image.objects.filter(uploader_id=uploader.id)
    else:
        images = Image.objects.filter(tags__contains=[category.lower()], uploader_id=uploader.id)
    image_ids = []
    for i in range(images.count()):
        image = images[i]
        image_id = str(image.id)
        image_ids.append(image_id)
        tags = ",".join(image.tags)
        title = image.title
        description = image.description
        liked = image_id in User.objects.get(username=current_user).liked_images
        url = s3.generate_presigned_url(ClientMethod="get_object",
                                        Params={'Bucket': S3_BUCKET,
                                                'Key': image_id + "." + image.ext},
                                        ExpiresIn=86400)
        medium_url = s3.generate_presigned_url(ClientMethod="get_object",
                                               Params={'Bucket': S3_BUCKET,
                                                       'Key': 'resized_med/' + image_id + "." + image.ext},
                                               ExpiresIn=86400)
        urls[i] = {"key": image_id, "idx": i, "title": title, 'url': url, 'medium_url': medium_url,
                   'description': description, 'liked': liked, 'tags': tags}
        thumbnail_url = s3.generate_presigned_url(ClientMethod="get_object",
                                                  Params={'Bucket': S3_BUCKET,
                                                          'Key': 'resized/' + image_id + "." + image.ext},
                                                  ExpiresIn=86400)
        thumbnail_urls[i] = {"key": image_id, "idx": i, "title": title, 'url': thumbnail_url,
                             'description': description, 'liked': liked, 'tags': tags}
    if selected not in image_ids:
        selected = '0'
    selected_title = Image.objects.get(id=int(selected)).title
    selected_description = Image.objects.get(id=int(selected)).description
    selected_liked = selected in User.objects.get(username=current_user).liked_images
    return render(request, 'profile/img-view.html', {'urls': urls, 'selected': selected,
                                                     'thumbnail_urls': thumbnail_urls, 'selected_title': selected_title,
                                                     'uploader': username, 'current_user': current_user,
                                                     'selected_liked': selected_liked,
                                                     'selected_description': selected_description,
                                                     'tags': selected_image_tags})


@login_required()
def toggle_like(request):
    """Handles POST request which toggles the liking of a given image by the user"""
    image_id = request.POST.get("image_id")
    username = request.user.username
    user = User.objects.get(username=username)
    if is_liked(username, image_id):
        Image.objects.filter(id=int(image_id)).update(likes=F('likes') - 1)
        user.liked_images.remove(image_id)
        response = "Unliked"
    else:
        Image.objects.filter(id=int(image_id)).update(likes=F('likes') + 1)
        user.liked_images.append(image_id)
        response = "Liked"
    user.save()
    return HttpResponse(content=response, content_type="text/plain")


@login_required()
def edit_tag_description(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    tag_name = request.POST.get("tag").lower()
    if tag_name:
        Tag.objects.filter(name=tag_name, uploader_id=request.user.id).update(
            description=request.POST.get("description"))
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400, content="tag not provided")


@login_required()
def edit_about_text(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    new_text = request.POST.get("about_text")
    if new_text:
        User.objects.filter(id=request.user.id).update(about_text=new_text)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400, content="new text not provided")


@login_required()
def edit_image_description(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    new_desc = request.POST.get("description")
    image_id = request.POST.get('imageid')
    try:
        image_id = int(image_id)
    except ValueError:
        return HttpResponse(status=400, content="Invalid image id")
    Image.objects.filter(id=image_id).update(description=new_desc)
    return HttpResponse(status=200)


@login_required()
def edit_image_title(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    new_title = request.POST.get("title")
    image_id = request.POST.get('imageid')
    try:
        image_id = int(image_id)
    except ValueError:
        return HttpResponse(status=400, content="Invalid image id")
    Image.objects.filter(id=image_id).update(title=new_title)
    return HttpResponse(status=200)


@login_required()
def edit_featured_tags(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    new_featured_tags = request.POST.get("data")
    User.objects.filter(id=request.user.id).update(featured_tags=new_featured_tags)
    return HttpResponse(status=200)


@login_required()
def delete_tag(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    image_id = request.POST.get('imageid')
    tag = request.POST.get('tag')
    try:
        image_id = int(image_id)
    except ValueError:
        return HttpResponse(status=400, content="Invalid image id provided")
    Image.objects.filter(id=image_id).update(tags=ArrayRemove('tags', tag))
    return HttpResponse(status=200)


@login_required()
def add_tag(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    tag = request.POST.get('tag')
    image_id = request.POST.get('imageid')
    if Tag.objects.filter(name=tag.lower().replace(" ", ""), uploader_id=request.user.id).count() == 0:
        new_tag = Tag(name=tag.lower().replace(" ", ""), uploader_id=request.user.id)
        new_tag.save()
    try:
        image_id = int(image_id)
    except ValueError:
        return HttpResponse(status=400, content="Invalid image id provided")
    Image.objects.filter(id=image_id).update(tags=ArrayAppend('tags', tag))
    return HttpResponse(status=200)


def about(request, username):
    return render(request, 'profile/about.html', {'uploader': username})

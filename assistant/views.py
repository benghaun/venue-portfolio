import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
S3_BUCKET = os.environ.get('S3_BUCKET')


def assistant(request):
    action = request.GET.get("action")
    tags = Tag.objects.all()
    buttons = {}
    text = ""
    if not action:
        text = "Welcome to Leakyjar's gallery. I can show you what's on display, or help you get in touch with him."
        buttons = {'Browse': {'type': '1', 'onClick': "location.href='/assistant?action=browse'"},
                   'Leave a message': {'type': '2', 'onClick': ''}}
    elif action == 'browse':
        text = "Sure, what type of art are you interested in?"
        for tag in tags:
            buttons[tag.name] = {'type': '1', 'onClick': "window.top.location.href='/profile/leakyjar/%s'" % tag.name}
    elif action == 'landing':
        text = "Hi there, welcome to Venue! Jeff here, I can help you around the site. What would you like to do?"
        buttons = {'Browse': {'type': '1', 'onClick': "location.href='/assistant?action=browse'"},
                   'Login': {'type': '2', 'onClick': "location.href='/assistant?action=login'"},
                   'Register': {'type': '3', 'onClick': "location.href='/assistant?action=register'"}}

    return render(request, 'assistant/assistant.html', {'text': text, 'buttons': buttons})


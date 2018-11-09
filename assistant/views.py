import os
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image, Tag
S3_BUCKET = os.environ.get('S3_BUCKET')


def assistant(request):
    action = request.GET.get("action")
    username = request.GET.get("username")
    current_user = request.user.username
    tags = Tag.objects.all()
    buttons = {}
    inputs = None
    header_text = ""
    text = ""
    if action == 'profile':
        if username != current_user:
            header_text = "Welcome to " + username + "'s gallery!"
            text = "I can show you what's on display, or help you get in touch with him."
            buttons = {'Browse': {'type': '1',
                                  'onClick': "location.href='/assistant?action=browse&username=" + username + "'"},
                       'Leave a message': {'type': '2', 'onClick': ''}}
        else:
            header_text = "Welcome back, " + username + "!"
            text = "What do you need to do today?"
            buttons = {'Upload an image': {'type': '1',
                                  'onClick': "location.href='/assistant?action=browse&username=" + username + "'"},
                       'Manage existing artwork': {'type': '2', 'onClick': ''}}
    elif action == 'browse':
        header_text = "Let me see what artwork " + username + " has..."
        text = "These are the main categories in " + username + "'s gallery"
        for tag in tags:
            buttons[tag.name] = {'type': '1', 'onClick': "window.top.location.href='/profile/leakyjar/%s'" % tag.name}
    elif action == 'search':
        header_text = "Searching for artwork?"
        text = "Sure, what type of art are you interested in?"
        for tag in tags:
            buttons[tag.name] = {'type': '1', 'onClick': "window.top.location.href='/profile/leakyjar/%s'" % tag.name}
    elif action == 'landing':
        header_text = "Hi there, my name is Jeff... lol"
        text = "Welcome to Venue! I can help you around this portfolio site. What would you like to do?"
        buttons = {'Browse': {'type': '1', 'onClick': "location.href='/assistant?action=search'"},
                   'Login': {'type': '2', 'onClick': "location.href='/assistant?action=login'"},
                   'Register': {'type': '3', 'onClick': "location.href='/assistant?action=register'"}}
    elif action == 'login':
        header_text = "Welcome back! Hope things have been well."
        inputs = {'Username': "",
                  'Password': ""}
    elif action == 'register':
        header_text = "So you’re a new user? Looking forward to working with you!"
        inputs = {'Username': "",
                  'Password': "",
                  'Confirm Password': ""}


    return render(request, 'assistant/assistant.html', {'header_text': header_text, 'text': text, 'buttons': buttons, 'inputs': inputs})


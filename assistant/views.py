import os
import json
import boto3
from django.contrib.auth import logout
from django.shortcuts import render, HttpResponse, redirect
from authentication.models import User
from venue.models import Tag, Image
S3_BUCKET = os.environ.get('S3_BUCKET')


def assistant(request):
    action = request.GET.get("action")
    username = request.GET.get("username")
    message = request.GET.get("message")
    nxt = request.GET.get("next")
    current_user = request.user.username
    tags = Tag.objects.all()
    buttons = {}
    inputs = None
    header_text = ""
    text = ""
    search = None
    form = ""
    upload = False
    tagging = False
    rec_tags = []
    if username:
        user = User.objects.get(username=username)
        assistant = user.assistant
        if assistant:
            assistant_image = Image.objects.get(id=assistant)
            s3 = boto3.client('s3', region_name='eu-west-3')
            assistant_url = s3.generate_presigned_url(ClientMethod="get_object",
                                                      Params={'Bucket': S3_BUCKET,
                                                              'Key': "resized/" + str(assistant_image.id) + "." + assistant_image.ext},
                                                      ExpiresIn=86400)
        else:
            assistant_url = None
    else:
        assistant_url = None
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
            buttons = {'Upload an image': {'type': '1', 'onClick': "location.href='/assistant?action=upload'"},
                       'Manage existing artwork': {'type': '2', 'onClick': "window.top.location.href='/profile/leakyjar/all'"},
                       'Logout': {'type': '3', 'onClick': "location.href='/assistant?action=logout'"}}
    elif action == 'upload':
        header_text = "What would you like to upload?"
        upload = True
    elif action == 'tagging':
        header_text = "Are these image tags correct?"
        tagging = True
        rec_tags = request.GET.get("tags")
        print(rec_tags)
        rec_tags = json.loads(rec_tags)
        print(rec_tags)
    elif action == 'browse':
        header_text = "Let me see what artwork " + username + " has..."
        text = "These are the main categories in " + username + "'s gallery"
        for tag in tags:
            buttons[tag.name] = {'type': '1', 'onClick': "window.top.location.href='/profile/leakyjar/%s'" % tag.name}
    elif action == 'search':
        header_text = "Searching for artwork?"
        text = "Sure, what type of art are you interested in?"
        search = {'Search': "Enter the name or tag you're interested in..."}
    elif action == 'landing':
        header_text = "Hi there! Ven here, at your service."
        text = "Welcome to Venue! I can help you around this portfolio site. What would you like to do?"
        if not request.user.username:
            buttons = {'Search': {'type': '1', 'onClick': "location.href='/assistant?action=search'"},
                       'Login': {'type': '2', 'onClick': "location.href='/assistant?action=login'"},
                       'Register': {'type': '3', 'onClick': "location.href='/assistant?action=register'"}}
        else:
            buttons = {'Search': {'type': '1', 'onClick': "location.href='/assistant?action=search'"},
                       'Profile': {'type': '2', 'onClick': "window.top.location.href='/profile/leakyjar/'"},
                       'Logout': {'type': '3', 'onClick': "location.href='/assistant?action=logout'"}}
    elif action == 'login':
        header_text = "Welcome back! Hope things have been well."
        inputs = {'Username': {"type": "", "name": "Username"},
                  'Password': {"type": "password", "name": "Password"}}
        if nxt:
            form = "/accounts/login/?next=" + nxt
        else:
            form = "/accounts/login/"
    elif action == 'register':
        header_text = "So you’re a new user? Looking forward to working with you!"
        inputs = {'Username': {"type": "", "name": "username"},
                  'Password': {"type": "password", "name": "password1"},
                  'Confirm Password': {"type": "password", "name": "password2"}}
        form = "/accounts/register/"
    elif action == 'logout':
        logout(request)
        return redirect("/assistant/?action=landing")
    elif action == 'contact':
        header_text = "Send me a message"

    if message:
        text = message

    return render(request, 'assistant/assistant.html',
                  {'header_text': header_text, 'text': text, 'buttons': buttons, 'inputs': inputs, 'search': search,
                   'form': form, 'upload': upload, 'assistant_url': assistant_url, 'tagging': tagging, 'rec_tags': rec_tags})


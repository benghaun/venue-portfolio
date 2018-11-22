from django.shortcuts import render
import os
from django.conf import settings
BASE_DIR = settings.BASE_DIR


# def home(request):
#     return render(request, 'profile/profile.html', {"uploader": "leakyjar"})

def home(request):
    if request.session.get('visited', False):
        first_timer = False
    else:
        request.session['visited'] = True
        first_timer = True
    print(first_timer)
    return render(request, 'landing/landing.html', {'first_timer': first_timer})


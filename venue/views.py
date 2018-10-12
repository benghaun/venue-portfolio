from django.shortcuts import render
import os
from django.conf import settings
BASE_DIR = settings.BASE_DIR

def home(request):
    return render(request, 'profile/profile.html')


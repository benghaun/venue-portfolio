import os
import json
from django.shortcuts import render, HttpResponse
import boto3
from venue.models import Image


def profile(request):
    return render(request, 'profile/profile.html')

def category(request, category):
    print(category)
    return render(request, 'category/category.html')
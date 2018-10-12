from django.shortcuts import render


def home(request):
    return render(request, 'profile/profile.html')


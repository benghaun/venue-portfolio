from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import logout
from .forms import SignUpForm


def register(request):
    if request.method == 'POST':
        f = SignUpForm(request.POST)
        if f.is_valid():
            f.save()
            messages.success(request, 'Account created successfully')
            return redirect('/accounts/login')

    else:
        f = SignUpForm()

    return render(request, 'authentication/register.html', {'form': f})


def logout_view(request):
    logout(request)
    return redirect('/')


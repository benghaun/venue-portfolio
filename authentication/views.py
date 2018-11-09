from django.shortcuts import render, redirect, HttpResponse
from django.contrib import messages
from django.contrib.auth import logout, login, authenticate
from .forms import SignUpForm


def login_view(request):
    nxt = request.GET.get("next", "")
    if request.method == 'POST':
        username = request.POST.get("Username")
        password = request.POST.get("Password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if nxt == "":
                return redirect("/assistant/?action=landing")
            else:
                return redirect(nxt)
        else:
            return redirect("/assistant/?action=login&message=Incorrect username or password.")
    else:
        return redirect("/assistant/?action=login&next=" + nxt)


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


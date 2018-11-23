import html
from django.shortcuts import render, redirect, HttpResponse
from django.contrib import messages
from django.contrib.auth import logout, login, authenticate
from .forms import SignUpForm


def login_view(request):
    nxt = request.GET.get("next", "")
    if request.method == 'POST':
        username = request.POST.get("Username")
        password = request.POST.get("Password")
        print('next:' + nxt)
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
        return redirect("/assistant/?action=login&next=" + html.escape(nxt))


def register(request):
    if request.method == 'POST':
        f = SignUpForm(request.POST)
        if f.is_valid():
            f.save()
            messages.success(request, 'Account created successfully')
            return redirect('/assistant/?action=login&message=Registration was successful, you can login now!')
        else:
            error_message = "Registration failed.\n"
            for error in f.errors:
                print(str(f.errors[error]))
                error_message += html.unescape(str(f.errors[error])[26:-10]) + "\n"
    return redirect("/assistant/?action=register&message=" + error_message)


def logout_view(request):
    nxt = '/assistant?action=' + request.GET.get('next_action')
    logout(request)
    print(nxt)
    return redirect(nxt)


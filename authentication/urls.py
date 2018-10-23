from django.contrib.auth import views as auth_views
from django_registration.views import RegistrationView
from django.urls import path
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name="authentication/login.html",)),
    path('register/', views.register)  #  RegistrationView.as_view(template_name="authentication/register.html"))
]
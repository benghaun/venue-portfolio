from django.contrib.auth import views as auth_views
from django.urls import path
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name="authentication/login.html")),
    path('register/', views.register),
    path('logout/', views.logout_view)
]

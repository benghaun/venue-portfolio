from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_view),
    path('sign_s3/')
]
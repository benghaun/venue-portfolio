from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_view),
    path('sign_s3/', views.sign_s3),
    path('add_tag/', views.add_tag),
    path('profilepic/', views.upload_profile_pic),
    path('getTags/', views.get_tag_view)
]
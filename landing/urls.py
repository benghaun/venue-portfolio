from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^getpg/', views.get_image_page),
]
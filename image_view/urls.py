from django.urls import path
from . import views

urlpatterns = [
    path('', views.show_images),
    path('delete_image', views.delete_image)
]
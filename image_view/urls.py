from django.urls import path
from . import views

urlpatterns = [
    path('', views.show_images),
    path('search/', views.image_search),
    path('delete_image/', views.delete_image)
]
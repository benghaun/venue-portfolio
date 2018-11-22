from django.urls import path
from . import views

urlpatterns = [
    path('', views.results_view),
    path('getpg/', views.image_search_page),
]

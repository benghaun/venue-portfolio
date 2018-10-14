from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.profile),
    path(r'(?P<category>.*)/', views.category)
]
from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.profile),
    re_path('(?P<category>.*)', views.category),
    re_path('(?P<category>.*)/', views.category)
]
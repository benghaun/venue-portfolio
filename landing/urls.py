from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<username>[^/]*)/$', views.landing),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/img-view/$', views.image),
]
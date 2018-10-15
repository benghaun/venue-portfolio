from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.profile),
    url(r'^(?P<category>.*)/img-view$', views.image),
    url(r'^(?P<category>.*)/img-view/$', views.image),
    url(r'^(?P<category>.*)/$', views.category, name='category'),
]
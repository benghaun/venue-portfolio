from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<username>[^/]*)/$', views.profile),
    url(r'^edit/', views.edit_profile),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/img-view/$', views.image),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/$', views.category_view, name='category'),
]
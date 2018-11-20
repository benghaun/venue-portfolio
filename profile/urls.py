from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^edit_desc/', views.edit_description),
    url(r'^like/', views.toggle_like),
    url(r'^(?P<username>[^/]*)/$', views.profile),
    url(r'^(?P<username>[^/]*)/about/$', views.about),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/img-view/$', views.image),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/$', views.category_view, name='category'),
]
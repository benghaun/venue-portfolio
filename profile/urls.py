from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^edit_tag_desc/', views.edit_tag_description),
    url(r'^edit_about/', views.edit_about_text),
    url(r'^del_tag/', views.delete_tag),
    url(r'^add_tag/', views.add_tag),
    url(r'^like/', views.toggle_like),
    url(r'^(?P<username>[^/]*)/$', views.profile),
    url(r'^(?P<username>[^/]*)/about/$', views.about),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/img-view/$', views.image),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/$', views.category_view, name='category'),
]
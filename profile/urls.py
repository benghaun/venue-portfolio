from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^edit_tag_desc/', views.edit_tag_description),
    url(r'^edit_img_desc/', views.edit_image_description),
    url(r'^edit_img_title/', views.edit_image_title),
    url(r'^edit_about/', views.edit_about_text),
    url(r'^edit_featured/', views.edit_featured_tags),
    url(r'^del_tag/', views.delete_tag),
    url(r'^add_tag/', views.add_tag),
    url(r'^add_skill/', views.add_skill),
    url(r'^del_skill/', views.del_skill),
    url(r'^add_medium/', views.add_medium),
    url(r'^del_medium/', views.del_medium),
    url(r'^edit_profile_desc/', views.edit_profile_text),
    url(r'^edit_work_exp/', views.edit_work_exp),
    url(r'^edit_fb/', views.edit_fb),
    url(r'^edit_insta/', views.edit_insta),
    url(r'^like/', views.toggle_like),
    url(r'^(?P<username>[^/]*)/$', views.profile),
    url(r'^(?P<username>[^/]*)/about/$', views.about),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/img-view/$', views.image),
    url(r'^(?P<username>[^/]*)/(?P<category>.*)/$', views.category_view, name='category'),
]
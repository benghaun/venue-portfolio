from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^send/', views.send_message),
    url(r'^inbox', views.inbox),
    url(r'^', views.message_view)
]
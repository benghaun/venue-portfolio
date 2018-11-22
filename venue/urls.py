"""venue URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home),
    path('admin/', admin.site.urls),
    path('upload/', include('image_upload.urls')),
    path('view/', include('image_view.urls')),
    path('profile/', include('profile.urls')),
    path('assistant/', include('assistant.urls')),
    path('accounts/', include('authentication.urls')),
    path('landing/', include('landing.urls')),
    path('messaging/', include('messaging.urls')),
    path('search/', include('search.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

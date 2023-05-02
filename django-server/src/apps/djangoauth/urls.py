from django.conf.urls import url
from . import views


app_name = 'djangoauth'

urlpatterns = [
	url(r'^django-login/$', views.django_login, name='django_login'),
]

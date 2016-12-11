from django.conf.urls import url
from . import views


app_name = 'health'

urlpatterns = [
	url(r'^$', views.health_check, name='check'),
]

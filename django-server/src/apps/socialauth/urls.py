from django.conf.urls import url
from . import views


app_name = 'socialauth'

urlpatterns = [
	url(r'^facebook-login/$', views.facebook_login, name='facebook'),
]

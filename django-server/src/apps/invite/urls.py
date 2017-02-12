from django.conf.urls import url
from . import views


app_name = 'invite'

urlpatterns = [
	url(r'^facebook-login/$', views.facebook_login, name='facebook'),
	url(r'^(?P<key>\w+)/(?P<player>\d*)/$', views.invite, name='invite_with_player'),
	url(r'^(?P<key>\w+)/$', views.invite, name='invite'),
]
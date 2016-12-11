from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^bgg/$', views.bgg_games, name='bgg-games'),

	url(r'(?P<game_id>\d+)/owners/$', views.owners, name='owners'),
	url(r'(?P<game_id>\d+)/knowers/$', views.knowers, name='knowers'),

	url(r'^(?P<filter_>\w+)/$', views.list_games, name='list'),
	url(r'^$', views.list_games, name='list'),
]
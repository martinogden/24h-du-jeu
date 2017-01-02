from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^bgg/$', views.bgg_games, name='bgg-games'),

	url(r'^pdf/recap/$', views.pdf_recap, name='pdf-recap'),
	url(r'^pdf/jeu_genre/$', views.pdf_jeu_genre, name='pdf-jeu-genre'),

	url(r'(?P<game_id>\d+)/owners/$', views.owners, name='owners'),
	url(r'(?P<game_id>\d+)/knowers/$', views.knowers, name='knowers'),

	url(r'^(?P<filter_>\w+)/$', views.list_games, name='list'),
	url(r'^$', views.list_games, name='list'),
]
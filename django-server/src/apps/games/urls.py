from django.conf.urls import url
from . import views, pdfs

urlpatterns = [
	url(r'^facebook-login/$', views.facebook_login, name='facebook'),

	url(r'^bgg/$', views.bgg_games, name='bgg-games'),
	url(r'^bgg/(?P<game_id>\d+)/$', views.bgg_game, name='bgg-game'),

	url(r'^pdf/recap/$', pdfs.pdf_recap, name='pdf-recap'),
	url(r'^pdf/jeu_genre/$', pdfs.pdf_jeu_genre, name='pdf-jeu-genre'),
	url(r'^pdf/par_genre/$', pdfs.pdf_par_genre, name='pdf-par-genre'),
	url(r'^pdf/a_apporter/$', pdfs.pdf_a_apporter, name='pdf-a-apporter'),

	url(r'(?P<game_id>\d+)/owners/$', views.owners, name='owners'),
	url(r'(?P<game_id>\d+)/knowers/$', views.knowers, name='knowers'),

	url(r'^(?P<filter_>\w+)/$', views.list_games, name='list'),
	url(r'^$', views.list_games, name='list'),
]
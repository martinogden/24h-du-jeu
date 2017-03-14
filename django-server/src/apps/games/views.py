# -*- coding: utf-8 -*-
from django.http import (
	Http404,
	HttpResponseServerError,
	HttpResponseBadRequest,
	JsonResponse,
	HttpResponse,
)
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from boardgamegeek import BoardGameGeek
from boardgamegeek.exceptions import BoardGameGeekError
import requests

from socialauth.views import facebook_login as sa_facebook_login
from .models import Game, User, Knower, Owner


AC_MIN_LENGTH = 3
BGG_MAX_ITEMS = 15
HTTP_STATUS_CODE_OK = 200
HTTP_STATUS_CODE_BAD_REQUEST = 400
HTTP_STATUS_CODE_SERVER_ERROR = 500

@csrf_exempt
@require_http_methods(['POST'])
def facebook_login(request):
	backend = 'games.backends.GameFacebookBackend'
	return sa_facebook_login(request)

@login_required
def list_games(request, filter_='all'):
	data = {}
	player = get_object_or_404(User, pk=request.user.id)

	if filter_ == 'all':
		games = Game.objects.all()
	elif filter_ == 'iknow':
		games = player.known_games.all()
	elif filter_ == 'iown':
		games = player.owned_games.all()
	else:
		data['errors'] = ['invalid filter %s' % filter_ ]

	if 'errors' in data:
		status = HTTP_STATUS_CODE_BAD_REQUEST
	else:
		data = [game.as_json() for game in games]
		status = HTTP_STATUS_CODE_OK
	return JsonResponse(data, status=status, safe=False)

@login_required
@require_http_methods(['PATCH'])
def owners(request, game_id):
	return _owner_knower_helper(game_id, 'owners', Owner, request.user)


@login_required
@require_http_methods(['PATCH'])
def knowers(request, game_id):
	return _owner_knower_helper(game_id, 'knowers', Knower, request.user)


def _owner_knower_helper(game_id, attr, model_name, current_user):
	""" Remove or add from the knowers or owners list,
		depending if it's there or not.
		Toggle ownership/knowledge
	"""
	game = get_object_or_404(Game, pk=game_id)

	kwargs = {'fk_game': game, 'fk_player': current_user}
	game_player, created = model_name.objects.get_or_create(**kwargs)
	if not created:
		game_player.delete()

	data = game.as_json()
	return JsonResponse(data)


@login_required
def bgg_games(request):
	q = request.GET.get('q')
	if not q or len(q) < AC_MIN_LENGTH:
		return JsonResponse([], safe=False)

	url = 'https://boardgamegeek.com/search/boardgame'
	headers = { 'Accept': 'application/json' }
	params = { 'q': q , 'showcount': BGG_MAX_ITEMS }

	response = requests.get(url, params, headers=headers)
	if not response.ok:
		return HttpResponseServerError()

	data = response.json()
	if not 'items' in data:
		raise Http404

	return JsonResponse(data['items'], safe=False)

# The possible game types are: 
# 1 Ambiance
# 2 Coopératif
# 3 Enchères
# 4 Enfants
# 5 Gestion
# 6 Parcours
# 7 Placement
# 8 Stratégie

@login_required
def bgg_game(request, game_id):

	bgg = BoardGameGeek()

	# we return error if game already in DB
	try:
		game = Game.objects.get(id_bgg=game_id)
	except Game.DoesNotExist:
		# the game is not in the DB. All fine
		# fetch game data from BGG
		try:
			bgg_game = bgg.game(game_id=game_id)
		except BoardGameGeekError:
			pass

		# We try to guess the game type - for suggestion to the user
		if "Children's Game" in bgg_game.categories:
			type_genre = 'Enfants'
		elif 'Abstract Strategy' in bgg_game.categories:
			type_genre = 'Stratégie'
		elif 'Area Control / Area Influence' in bgg_game.mechanics or 'Tile Placement' in bgg_game.mechanics:
			type_genre = 'Placement'
		elif 'Worker Placement' in bgg_game.mechanics:
			type_genre = 'Gestion'
		elif 'Racing' in bgg_game.mechanics:
			type_genre = 'Parcours'
		elif 'Auction/Bidding' in bgg_game.mechanics:
			type_genre = 'Enchères'
		elif 'Co-operative Play' in bgg_game.mechanics:
			type_genre = 'Coopératif'
		elif 'Party Game' in bgg_game.categories:
			type_genre = 'Ambiance'
		else:
			type_genre = None

		data = {
			'id_bgg': game_id, 
			'name': bgg_game.name,
			'type_genre': type_genre,
			'min_player': bgg_game.min_players,
			'max_player': bgg_game.max_players,
			'min_age': bgg_game.min_age,
			'duration': bgg_game.playing_time,
			'description': bgg_game.description,
			'thumbnail': bgg_game.thumbnail
		}

		return JsonResponse(data)
		
	else:
		# Game is already in DB - return 400
		return HttpResponseBadRequest('Ce jeu existe d&eacute;j&agrave;. Nom du jeu: %s (ID BGG: %s)' % (game.name, game_id))


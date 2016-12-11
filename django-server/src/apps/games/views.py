from django.http import Http404, HttpResponseServerError, JsonResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
import requests

from .models import Game, User


AC_MIN_LENGTH = 3
BGG_MAX_ITEMS = 15


@login_required
def list_games(request, filter_='all'):
	errors = {}
	player = get_object_or_404(User, pk=request.user.id)

	if filter_ == 'all':
		pass
	elif filter_ == 'iknow':
		games = player.know_games.all()
	elif filter_ == 'iown':
		games = player.owned_games.all()
	else:
		errors['errors'] = ['invalid filter %s' % filter_ ]

	# TODO djangoify
	result, dump_errors = games_schema.dump(games.all())
	errors.update(dump_errors)

	if errors:
		return jsonify(errors), HTTP_STATUS_CODE_BAD_REQUEST

	return jsonify(result)


@login_required
def owners(request, game_id):
	return _owner_knower_helper(game_id, 'owners', request.user)


@login_required
def knowers(request, game_id):
	return _owner_knower_helper(game_id, 'knowers', request.user)


def _owner_knower_helper(game_id, attr, current_user):
	game = get_object_or_404(Game, pk=game_id)

	rel = getattr(game, attr)

	if current_user in rel:
		rel.remove(current_user)
	else:
		rel.add(current_user)
    
    # TODO djangoify
	rel.save()
	# db.session.add(game)
	# db.session.commit()

	result, errors = game_schema.dump(game)

	if errors:
		return jsonify(errors), HTTP_STATUS_CODE_BAD_REQUEST

	return jsonify(result)


@login_required
def bgg_games(request):
	q = request.GET.get('q')
	if not q or len(q) < AC_MIN_LENGTH:
		return JsonResponse({})

	# TODO refactor
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

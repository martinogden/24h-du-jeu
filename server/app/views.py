import requests
from flask import jsonify, request, abort
from flask_jwt import jwt_required, current_identity

from . import app, db
from .models import Game
from .schemas import game_schema, games_schema


HTTP_STATUS_CODE_BAD_REQUEST = 400
HTTP_STATUS_CODE_SERVER_ERROR = 500
AC_MIN_LENGTH = 3
BGG_MAX_ITEMS = 15


def auth_response(access_token, identity):
	return jsonify({
		'access_token': access_token.decode('utf-8'),
		'user_id': identity.id,
	})


@app.route('/api/games', methods=['GET'])
def get_games():
	games = Game.query.all()
	result, errors = games_schema.dump(games)

	if errors:
		return jsonify(errors), HTTP_STATUS_CODE_BAD_REQUEST

	return jsonify(result)


@app.route('/api/games/<game_id>/owners', methods=['PATCH'])
@jwt_required()
def owners(game_id):
	return _owner_knower_helper(game_id, 'owners', current_identity)


@app.route('/api/games/<game_id>/knowers', methods=['PATCH'])
@jwt_required()
def knowers(game_id):
	return _owner_knower_helper(game_id, 'knowers', current_identity)


def _owner_knower_helper(game_id, attr, current_user):
	game = Game.query.filter_by(id=game_id).first_or_404()

	rel = getattr(game, attr)

	if current_user in rel:
		rel.remove(current_user)
	else:
		rel.append(current_user)

	db.session.add(game)
	db.session.commit()

	result, errors = game_schema.dump(game)

	if errors:
		return jsonify(errors), HTTP_STATUS_CODE_BAD_REQUEST

	return jsonify(result)


@app.route('/api/bgg-games')
@jwt_required()
def bgg_games():
	q = request.args.get('q')
	if not q or len(q) < AC_MIN_LENGTH:
		return jsonify([])

	url = 'https://boardgamegeek.com/search/boardgame'
	headers = { 'Accept': 'application/json' }
	params = { 'q': q , 'showcount': BGG_MAX_ITEMS }

	response = requests.get(url, params, headers=headers)
	if not response.ok:
		return abort(HTTP_STATUS_CODE_SERVER_ERROR)

	data = response.json()
	if not 'items' in data:
		return abort(HTTP_STATUS_CODE_SERVER_ERROR)

	return jsonify(data['items'])

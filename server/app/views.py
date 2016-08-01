import json

from flask import jsonify, request, abort
from flask_jwt import jwt_required, current_identity

from . import app, db
from .models import Game, Player
from .schemas import game_schema, games_schema, player_schema


HTTP_STATUS_CODE_BAD_REQUEST = 400


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

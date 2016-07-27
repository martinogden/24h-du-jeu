import json

from flask import Blueprint, jsonify, request, abort

from . import app, db
from .models import Game, Player
from .schemas import game_schema, games_schema, player_schema
from . import auth


HTTP_STATUS_OK = 200
HTTP_STATUS_CODE_CREATED = 201
HTTP_STATUS_CODE_BAD_REQUEST = 400



@app.route('/api/users/login', methods=['POST'])
def login():
	try:
		payload = json.loads(request.data)
		signed_request = payload['signedRequest']
	except (ValueError, KeyError):
		abort(HTTP_STATUS_CODE_BAD_REQUEST)

	try:
		connection = auth.parse_signed_request(signed_request)
	except auth.SignedRequestDecodeException:
		abort(HTTP_STATUS_CODE_BAD_REQUEST)

	# get or create Player
	q = { 'facebook_id': connection['user_id'] }
	player = Player.query.filter_by(**q).first()
	if player:
		return jsonify({}), HTTP_STATUS_OK

	access_token = payload['accessToken']
	facebook_user = auth.get_user(access_token)
	player = Player.from_facebook_user(facebook_user)

	db.session.add(player)
	db.session.commit()

	result, errors = player_schema.dump(player)
	return jsonify(result), HTTP_STATUS_CODE_CREATED


@app.route('/api/games', methods=['GET'])
def get_games():
	try:
		page_num = int(request.args.get('page', 1))
	except ValueError:
		abort(HTTP_STATUS_CODE_BAD_REQUEST)

	page = Game.query.paginate(page=page_num, per_page=app.config['PER_PAGE'])
	result, errors = games_schema.dump(page.items)
	response = jsonify(result)
	return add_link_header(page, response)


@app.route('/api/games/<game_id>/owners', methods=['PATCH', 'DELETE'])
def owners(game_id):
	return _owner_knower_helper(game_id, 'owners')


@app.route('/api/games/<game_id>/knowers', methods=['PATCH', 'DELETE'])
def knowers(game_id):
	return _owner_knower_helper(game_id, 'knowers')


def _owner_knower_helper(game_id, attr):
	# TODO get real logged in user
	current_user = Player.query.filter_by(id=u'C\xc3line').first_or_404()
	game = Game.query.filter_by(id=game_id).first_or_404()

	rel = getattr(game, attr)
	save = True

	if request.method == 'DELETE':
		if current_user not in rel:
			abort(HTTP_STATUS_CODE_BAD_REQUEST)
		rel.remove(current_user)

	else:  # PATCH
		if not current_user in rel:  # idempotent
			rel.append(current_user)
		else:
			save = False

	if save:
		db.session.add(game)
		db.session.commit()

	result, errors = game_schema.dump(game)

	if errors:
		return jsonify(errors), HTTP_STATUS_CODE_BAD_REQUEST

	return jsonify(result)


def add_link_header(pagination, response):
	link = '<%s?page=%d>; rel="%s"';
	links = []

	if pagination.has_prev:
		links.append(link % (request.base_url, pagination.prev_num, 'prev'))

	if pagination.has_next:
		links.append(link % (request.base_url, pagination.next_num, 'next'))

	if links:
		response.headers['Link'] = ', '.join(links)

	return response

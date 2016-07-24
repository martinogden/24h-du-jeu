from flask import Blueprint, jsonify, request, abort

from . import app, db
from .models import Game, Player
from .schemas import game_schema, games_schema, player_schema


@app.route('/api/games', methods=['GET'])
def get_games():
	try:
		page_num = int(request.args.get('page', 1))
	except ValueError:
		abort(400)

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


### STATIC CONTENT ###


def _owner_knower_helper(game_id, attr):
	# TODO get real logged in user
	current_user = Player.query.filter_by(id=u'C\xc3line').first_or_404()
	game = Game.query.filter_by(id=game_id).first_or_404()

	rel = getattr(game, attr)
	save = True

	if request.method == 'DELETE':
		if current_user not in rel:
			abort(400)
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
		return jsonify(errors), 400

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

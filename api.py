# coding=utf-8

import os

from flask import Flask, jsonify, request, abort
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


DEBUG = True
PER_PAGE = 20
DATABASE_PATH = os.path.realpath('./db/24hDuJeuReferentDb2016Full')
IMG_PATH = '/static/img/'


app = Flask(__name__)
app.config.update({
	'DEBUG': DEBUG,
	'SQLALCHEMY_DATABASE_URI': 'sqlite:///%s' % DATABASE_PATH,
	'SQLALCHEMY_TRACK_MODIFICATIONS': False,
})

db = SQLAlchemy(app)
ma = Marshmallow(app)


if DEBUG:
	from flask_cors import CORS
	CORS(app, expose_headers=['Link'])


### DATABASE TABLES ###

knowers = db.Table('knower',
	db.Column('FK_PLAYER_ID', db.Unicode(80), db.ForeignKey('PLAYER.ID')),
	db.Column('FK_GAME_ID', db.Unicode(15), db.ForeignKey('GAME.ID')),
)


owners = db.Table('owner',
	db.Column('FK_PLAYER_ID', db.Unicode(80), db.ForeignKey('PLAYER.ID')),
	db.Column('FK_GAME_ID', db.Unicode(15), db.ForeignKey('GAME.ID')),
)


class Game(db.Model):
	__tablename__ = 'GAME'

	id = db.Column('ID', db.Unicode(15), primary_key=True)
	name = db.Column('NAME', db.Unicode(80))

	knowers = db.relationship('Player',
		secondary=knowers,
		backref=db.backref('known_games', lazy='dynamic')
	)

	owners = db.relationship('Player',
		secondary=owners,
		backref=db.backref('owned_games', lazy='dynamic')
	)

	@property
	def img_uri(self):
		return "%s%s.jpg" % (IMG_PATH, self.id)
	
	def __repr__(self):
		return '<Game %s>' % self.name


class Player(db.Model):
	__tablename__ = 'PLAYER'

	id = db.Column('ID', db.Unicode(80), primary_key=True)
	pseudo = db.Column('PSEUDO', db.Unicode(80))

	def __repr__(self):
		return '<Player %s>' % self.pseudo


### API SCHEMA ###

class GameSchema(ma.ModelSchema):
	class Meta:
		model = Game
		additional = ('img_uri',)


class PlayerSchema(ma.ModelSchema):
	class Meta:
		model = Player

game_schema = GameSchema()
games_schema = GameSchema(many=True)
player_schema = PlayerSchema(many=True)


### API ENDPOINTS ###

@app.route('/api/games', methods=['GET'])
def get_games():
	try:
		page_num = int(request.args.get('page', 1))
	except ValueError:
		abort(400)

	page = Game.query.paginate(page=page_num, per_page=PER_PAGE)
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
	current_user = Player.query.filter_by(id=u'Céline').first_or_404()
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


if __name__ == '__main__':
	app.run()

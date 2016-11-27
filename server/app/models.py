from . import db
from . import app

import logging

logger = logging.getLogger(__name__)


knowers = db.Table('knower',
	db.Column('fk_player_id', db.Integer, db.ForeignKey('player.id')),
	db.Column('fk_game_id', db.Integer, db.ForeignKey('game.id')),
)


owners = db.Table('owner',
	db.Column('fk_player_id', db.Integer, db.ForeignKey('player.id')),
	db.Column('fk_game_id', db.Integer, db.ForeignKey('game.id')),
)


class Game(db.Model):
	__tablename__ = 'game'

	id = db.Column('id', db.Integer, primary_key=True)
	name = db.Column('name', db.Unicode(80))
	sort_name = db.Column('sort_name', db.Unicode(80))
	id_bgg = db.Column('id_bgg', db.Integer, nullable=True)

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
		if not self.id_bgg:
			return ""
		try:
			return "%s%d.jpg" % (app.config['IMG_PATH'], self.id_bgg)
		except TypeError as e:
			import ipdb; ipdb.set_trace()

	def __unicode__(self):
		return u'<Game %s>' % self.name


class Player(db.Model):
	__tablename__ = 'player'

	id = db.Column('id', db.Integer, primary_key=True)
	facebook_id = db.Column(db.Unicode(80), index=True, unique=True)
	email = db.Column(db.Unicode(255), unique=True)
	name = db.Column(db.Unicode(255))
	picture_url = db.Column(db.UnicodeText)
	pseudo = db.Column('PSEUDO', db.Unicode(80))

	# See Connection class. We don't need it.
	# connections = db.relationship('Connection',
	# 	backref='player',
	# 	lazy='dynamic'
	# )

	def __unicode__(self):
		return u'<Player %s>' % (self.pseudo or self.name)

	@classmethod
	def from_facebook_user(cls, user):
		instance = cls()
		instance.id = user['id']
		instance.facebook_id = user['id']
		instance.email = user['email']
		instance.pseudo = user['first_name']
		instance.name = '%s %s' % (user['first_name'], user['last_name'])

		try:
			instance.picture_url = user['picture']['data']['url']
		except KeyError as e:
			logger.debug("from_facebook_user missing picture: %s", e)

		return instance

class Invite(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	key = db.Column(db.Unicode(255))
	player_id = db.Column(db.Integer, db.ForeignKey('player.id'))
	player = db.relationship('Player', backref='invite')
	
		
# We don't need it: 
# class Connection(db.Model):
# 	__tablename__ = 'CONNECTION'

# 	id = db.Column(db.Integer, primary_key=True)
# 	player_id = db.Column(db.Integer, db.ForeignKey('PLAYER.ID'))

# 	user_id = db.Column(db.Unicode(80))
# 	code = db.Column(db.UnicodeText)
# 	issued_at = db.Column(db.DateTime)

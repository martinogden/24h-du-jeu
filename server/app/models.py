from . import db
from . import app


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
		return "%s%s.jpg" % (app.config['IMG_PATH'], self.id)

	def __repr__(self):
		return '<Game %s>' % self.name


class Player(db.Model):
	__tablename__ = 'PLAYER'

	id = db.Column('ID', db.Unicode(80), primary_key=True)
	facebook_id = db.Column(db.Unicode(80), index=True, unique=True)
	email = db.Column(db.Unicode(255), unique=True)
	name = db.Column(db.Unicode(255))
	picture_url = db.Column(db.UnicodeText)
	pseudo = db.Column('PSEUDO', db.Unicode(80))

	connections = db.relationship('Connection',
		backref='player',
		lazy='dynamic'
	)

	def __repr__(self):
		return '<Player %s>' % self.pseudo

	@classmethod
	def from_facebook_user(cls, user):
		instance = cls()
		instance.id = user['id']
		instance.facebook_id = user['id']
		instance.email = user['email']
		instance.name = user['name']
		instance.picture_url = user['picture']['data']['url']
		return instance


class Connection(db.Model):
	__tablename__ = 'CONNECTION'

	id = db.Column(db.Integer, primary_key=True)
	player_id = db.Column(db.Integer, db.ForeignKey('PLAYER.ID'))

	user_id = db.Column(db.Unicode(80))
	code = db.Column(db.UnicodeText)
	issued_at = db.Column(db.DateTime)
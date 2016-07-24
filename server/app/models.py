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
	pseudo = db.Column('PSEUDO', db.Unicode(80))

	def __repr__(self):
		return '<Player %s>' % self.pseudo

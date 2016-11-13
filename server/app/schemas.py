from . import ma
from .models import Game, Player, Invite


class PlayerSchema(ma.ModelSchema):
	class Meta:
		model = Player
		fields = ('id', 'pseudo', 'picture_url', 'name')


class GameSchema(ma.ModelSchema):
	class Meta:
		model = Game
		additional = ('img_uri',)

	owners = ma.Nested(PlayerSchema, many=True)
	knowers = ma.Nested(PlayerSchema, many=True)

class InviteSchema(ma.ModelSchema):
	class Meta:
		model = Invite
		fields = ('key', 'player')

	# player = ma.Nested(PlayerSchema)
		

game_schema = GameSchema()
games_schema = GameSchema(many=True)
player_schema = PlayerSchema()
invite_schema = InviteSchema()
from . import ma
from .models import Game, Player


class PlayerSchema(ma.ModelSchema):
	class Meta:
		model = Player
		fields = ('id', 'name')


class GameSchema(ma.ModelSchema):
	class Meta:
		model = Game
		additional = ('img_uri',)

	owners = ma.Nested(PlayerSchema, many=True)
	knowers = ma.Nested(PlayerSchema, many=True)


game_schema = GameSchema()
games_schema = GameSchema(many=True)
player_schema = PlayerSchema()

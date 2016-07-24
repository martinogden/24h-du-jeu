from . import ma
from .models import Game, Player


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

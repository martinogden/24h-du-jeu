from django import forms
from .models import Game


class GameForm(forms.ModelForm):

	class Meta:
		model = Game
		fields = (
			'name',
			'type_genre',
			'themes',
			'mechanisms',
			'families',
			'min_player',
			'max_player',
			'min_age',
			'max_age',
			'duration',
			'description',
			'thumbnail_uri',
			'id_bgg',
			'image_bgg'
		)

from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser

import logging
logger = logging.getLogger(__name__)

class User(AbstractUser):
    pseudo = models.TextField(blank=True, null=True)
    picture_url = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'player'

class Game(models.Model):
    name = models.TextField()
    type_genre = models.TextField('Type', db_column='type', blank=True, null=True)
    themes = models.TextField(blank=True, null=True)
    mechanisms = models.TextField(blank=True, null=True)
    families = models.TextField(blank=True, null=True)
    min_player = models.IntegerField(blank=True, null=True)
    max_player = models.IntegerField(blank=True, null=True)
    min_age = models.IntegerField(blank=True, null=True)
    max_age = models.IntegerField(blank=True, null=True)
    duration = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image_uri = models.TextField(blank=True, null=True)
    thumbnail_uri = models.TextField(blank=True, null=True)
    sort_name = models.TextField(blank=True, null=True)
    id_trictrac = models.IntegerField(blank=True, null=True)
    id_bgg = models.IntegerField(blank=True, null=True)

    knowers = models.ManyToManyField(User, through='Knower', related_name='known_games')
    owners = models.ManyToManyField(User, through='Owner', related_name='owned_games')

    class Meta:
        db_table = 'game'


class Invite(models.Model):
    key = models.TextField()
    player = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        db_table = 'invite'


class Knower(models.Model):
    fk_game = models.ForeignKey(Game, on_delete=models.CASCADE)
    fk_player = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'knower'
        unique_together = (('fk_game', 'fk_player'),)


class Owner(models.Model):
    fk_game = models.ForeignKey(Game, on_delete=models.CASCADE)
    fk_player = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'owner'
        unique_together = (('fk_game', 'fk_player'),)


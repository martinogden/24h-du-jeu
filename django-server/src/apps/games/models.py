# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.forms.models import model_to_dict
from django.contrib.auth.models import AbstractUser
from django.contrib.staticfiles.templatetags.staticfiles import static

import logging
logger = logging.getLogger(__name__)

class User(AbstractUser):
    pseudo = models.TextField(blank=True, null=True)
    picture_url = models.TextField(blank=True, null=True)

    known_games = models.ManyToManyField('Game', through='Knower', related_name='knowers', verbose_name='Jeux connus', blank=True)
    owned_games = models.ManyToManyField('Game', through='Owner', related_name='owners', verbose_name='Jeux possédés', blank=True)

    class Meta:
        db_table = 'player'
        verbose_name = 'joueur'

    def __unicode__(self):
        return self.pseudo or self.username

    def as_json(self):
        fields = ['id', 'pseudo', 'picture_url', 'username', 'email', 
                   'first_name', 'last_name', 'is_staff', 'last_login',
                   'is_active']
        return model_to_dict(self, fields)

class Game(models.Model):
    name = models.TextField(verbose_name ='Titre')
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

    class Meta:
        db_table = 'game'
        verbose_name = 'jeu'
        verbose_name_plural = 'jeux'
        ordering = ('name',)

    def __unicode__(self):
        return self.name

    @property
    def img_uri(self):
        if not self.id_bgg:
            return ""
        return static("img/%d.jpg" % self.id_bgg)

    def as_json(self):
        fields = ['id', 'name', 'type_genre', 'themes', 'mechanisms', 
                   'families', 'min_player', 'max_player', 'min_age',
                   'max_age', 'duration', 'description',
                   'thumbnail_uri', 'sort_name', 'id_trictrac', 'id_bgg']
        data = model_to_dict(self, fields)
        
        # in the frontend, we also need the list of owners and knowers
        # We display the owners even if they don't bring the game 
        #   as the owners need to specify they own it even if the admin doesn't
        #   want him to bring it.
        owners = []
        for owner in self.owners.all():
            owners.append({
                'id': owner.id,
                'picture_url': owner.picture_url,
                'pseudo': owner.pseudo
            })
        # we add the list of owners to the data
        data['owners'] = owners
        knowers = []
        for knower in self.knowers.all():
            knowers.append({
                'id': knower.id,
                'picture_url': knower.picture_url,
                'pseudo': knower.pseudo
            })
        data['knowers'] = knowers

        data['img_uri'] = self.img_uri
        return data


class Knower(models.Model):
    fk_game = models.ForeignKey(Game, on_delete=models.CASCADE, verbose_name ='Jeu')
    fk_player = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name ='Joueur')

    class Meta:
        db_table = 'knower'
        unique_together = (('fk_game', 'fk_player'),)
        verbose_name = 'connaisseur'

    def __unicode__(self):
        return '%s - %s' % (self.fk_player.pseudo, self.fk_game.name)


class Owner(models.Model):
    fk_game = models.ForeignKey(Game, on_delete=models.CASCADE, verbose_name ='Jeu')
    fk_player = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name ='Joueur')
    is_bringing = models.BooleanField(blank=True, default=False, verbose_name='Apporte')

    class Meta:
        db_table = 'owner'
        unique_together = (('fk_game', 'fk_player'),)
        verbose_name = 'propriétaire'

    def __unicode__(self):
        return '%s - %s' % (self.fk_player.pseudo, self.fk_game.name)

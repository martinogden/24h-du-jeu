# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from unidecode import unidecode

from django.db import models
from django.forms.models import model_to_dict
from django.contrib.auth.models import AbstractUser
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.utils.text import slugify
from django.utils import timezone
from django.conf import settings

from wand.image import Image
import requests
import os
import logging
logger = logging.getLogger(__name__)

IMG_WIDTH = 223
IMG_URI = 'https://ichenil.com/24hdujeu/images/'

class User(AbstractUser):
    pseudo = models.TextField(blank=True, null=True)
    picture_url = models.TextField(blank=True, null=True)
    is_animajoueur = models.BooleanField(blank=True, default=True, verbose_name='Animajoueur')

    known_games = models.ManyToManyField('Game', through='Knower', related_name='knowers', verbose_name='Jeux connus', blank=True)
    owned_games = models.ManyToManyField('Game', through='Owner', related_name='owners', verbose_name='Jeux possédés', blank=True)

    class Meta:
        db_table = 'player'
        verbose_name = 'joueur'

    def __unicode__(self):
        return unidecode(self.pseudo or '') or self.username

    def known_and_owned_games(self):
        return (self.known_games.all() | self.owned_games.all()).distinct()

    def as_json(self):
        fields = ['id', 'pseudo', 'picture_url', 'username', 'email', 
                   'first_name', 'last_name', 'is_staff', 'last_login',
                   'is_active', 'is_animajoueur']
        return model_to_dict(self, fields)

class Game(models.Model):
    GENRE_CHOICES = (
        ('Ambiance', 'Ambiance'),
        ('Coopératif', 'Coopératif'),
        ('Stratégie', 'Stratégie'),
        ('Placement', 'Placement'),
        ('Parcours', 'Parcours'),
        ('Gestion','Gestion'),
        ('Enfants','Enfants'),
        ('Enchères','Enchères'),
    )
    name = models.TextField(verbose_name ='Titre', unique=True)
    type_genre = models.TextField('Genre', db_column='type', default='Gestion', choices=GENRE_CHOICES)
    themes = models.TextField(blank=True, null=True)
    mechanisms = models.TextField(blank=True, null=True)
    families = models.TextField(blank=True, null=True)
    min_player = models.IntegerField(blank=True, null=True, verbose_name='Joueurs min.')
    max_player = models.IntegerField(blank=True, null=True, verbose_name='Joueurs max.')
    min_age = models.IntegerField(blank=True, null=True, verbose_name='Age min.')
    max_age = models.IntegerField(blank=True, null=True, verbose_name='Age max.')
    duration = models.IntegerField(blank=True, null=True, verbose_name='Durée')
    description = models.TextField(blank=True, null=True)
    # image_bgg is the original link to the bgg image
    image_bgg = models.TextField(blank=True, null=True)
    # image_uri is only used by the Android App for now
    image_uri = models.TextField(blank=True, null=True)
    thumbnail_uri = models.TextField(blank=True, null=True)
    image_width = models.IntegerField(blank=True, null=True)
    image_height = models.IntegerField(blank=True, null=True)
    sort_name = models.TextField(blank=True, null=True)
    id_trictrac = models.IntegerField(blank=True, null=True)
    id_bgg = models.IntegerField(blank=True, null=True, unique=True)
    date_added = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'game'
        verbose_name = 'jeu'
        verbose_name_plural = 'jeux'
        ordering = ('name',)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.image_bgg and self.id_bgg:
            # don't download if image already exists
            fn = os.path.join(settings.IMG_DIR, "%s.jpg" % self.id_bgg)
            if not os.path.exists(fn):

                response = requests.get(self.image_bgg, stream=True)

                if response.ok:
                    with Image(file=response.raw) as img:
                        img.transform(resize=str(IMG_WIDTH))
                        img.save(filename=fn)
                        self.image_height=img.height
                    self.image_width=IMG_WIDTH
                    self.image_uri = IMG_URI + str(self.id_bgg) + '.jpg'
        if not self.sort_name:
            self.sort_name = slugify(self.name).replace('-', ' ')
        super(Game, self).save(*args, **kwargs)

    @property
    def img_uri(self):
        if not self.id_bgg:
            return static("img/big_placeholder.png")
        return static("img/%d.jpg" % self.id_bgg)

    @property
    def img_ratio(self):
        if self.image_width and self.image_height and not self.image_width == 0:
            return float(self.image_height)/self.image_width
        else:
            return None

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
        data['img_ratio'] = self.img_ratio
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

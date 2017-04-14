from django.contrib import admin
from django.forms import TextInput
from django.db import models
from .models import Game, Knower, Owner, User


class OwnerInline(admin.TabularInline):
	model = Owner
	extra = 1 # how many rows to show

class KnowerInline(admin.TabularInline):
	model = Knower
	extra = 1 # how many rows to show

class GameAdmin(admin.ModelAdmin):
	inlines = (OwnerInline, KnowerInline, )
	list_display = ('name', 'type_genre')
	list_filter = ('name', 'type_genre')
	ordering = ('name',)
	search_fields = ('name','id_bgg')
	formfield_overrides = {
		models.TextField: {'widget': TextInput(attrs={'size':'20'})},
	}

class UserAdmin(admin.ModelAdmin):

	def formfield_for_manytomany(self, *args, **kwargs):
		# warning: monkey patch
		k_auto_created = Knower._meta.auto_created
		o_auto_created = Owner._meta.auto_created
		Knower._meta.auto_created = True
		Owner._meta.auto_created = True

		ret_val = super(UserAdmin, self).formfield_for_manytomany(*args, **kwargs)

		Knower._meta.auto_created = k_auto_created
		Owner._meta.auto_created = o_auto_created
		return ret_val

	def save_related(self, request, form, *args, **kwargs):
		user = form.instance

		db_known_games = user.known_games.all()
		submitted_known_games = form.cleaned_data.pop('known_games', ())
		known_added = set(submitted_known_games) - set(db_known_games)
		known_deleted = set(db_known_games) - set(submitted_known_games)

		for game in known_added:
			Knower.objects.get_or_create(fk_game=game, fk_player=user)
		for game in known_deleted:
			Knower.objects.get(fk_game=game, fk_player=user).delete()

		db_owned_games = user.owned_games.all()
		submitted_owned_games = form.cleaned_data.pop('owned_games', ())
		owned_added = set(submitted_owned_games) - set(db_owned_games)
		owned_deleted = set(db_owned_games) - set(submitted_owned_games)

		for game in owned_added:
			Owner.objects.get_or_create(fk_game=game, fk_player=user)
		for game in owned_deleted:
			Owner.objects.get(fk_game=game, fk_player=user).delete()

		super(UserAdmin, self).save_related(request, form, *args, **kwargs)


	ordering = ('pseudo',)
	# to select multiple owners/knowers at once
	filter_horizontal = ('known_games', 'owned_games',)
	list_display = ('pseudo', 'is_animajoueur')
	exclude = ('password',)
	formfield_overrides = {
		models.TextField: {'widget': TextInput(attrs={'size':'20'})},
	}


class OwnerAdmin(admin.ModelAdmin):
    list_display = ('fk_player', 'fk_game', 'is_bringing')
    list_editable = ('is_bringing',)
    ordering = ('fk_game__name', 'fk_player__pseudo')
    # raise TypeError('Related Field got invalid lookup: %s' % lookup_name)
    # search_fields = ('fk_game')
    list_filter = ('fk_player', 'fk_game')

class KnowerAdmin(admin.ModelAdmin):
    list_display = ('fk_player', 'fk_game')
    ordering = ('fk_game__name', 'fk_player__pseudo')
    # raise TypeError('Related Field got invalid lookup: %s' % lookup_name)
    # search_fields = ('fk_game')
    list_filter = ('fk_player', 'fk_game')
    # for the ordering the admin is using the ID and not the name
		

admin.site.register(Game, GameAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Knower, KnowerAdmin)
admin.site.register(Owner, OwnerAdmin)

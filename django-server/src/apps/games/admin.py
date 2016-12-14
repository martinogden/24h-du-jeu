from django.contrib import admin
from .models import Game, Knower, Owner, User

class OwnerInline(admin.TabularInline):
	model = Owner
	extra = 1 # how many rows to show

class KnowerInline(admin.TabularInline):
	model = Knower
	extra = 1 # how many rows to show

class GameAdmin(admin.ModelAdmin):
	inlines = (OwnerInline, KnowerInline, )
	list_display = ('name',)
	list_filter = ('name',)
	search_fields = ('name','id_bgg')

class UserAdmin(admin.ModelAdmin):
	inlines = (OwnerInline, KnowerInline,)
	list_display = ('pseudo',)

class OwnerAdmin(admin.ModelAdmin):
    list_display = ('fk_player', 'fk_game')
    # raise TypeError('Related Field got invalid lookup: %s' % lookup_name)
    # search_fields = ('fk_game')
    list_filter = ('fk_player', 'fk_game')

class KnowerAdmin(admin.ModelAdmin):
    list_display = ('fk_player', 'fk_game')
    # raise TypeError('Related Field got invalid lookup: %s' % lookup_name)
    # search_fields = ('fk_game')
    list_filter = ('fk_player', 'fk_game')
    # for the ordering the admin is using the ID and not the name
		

admin.site.register(Game, GameAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Knower, KnowerAdmin)
admin.site.register(Owner, OwnerAdmin)

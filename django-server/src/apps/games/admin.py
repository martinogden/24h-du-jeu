from django.contrib import admin
from .models import Game, Knower, Owner, User

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

admin.site.register(Game)
admin.site.register(User)
admin.site.register(Knower, KnowerAdmin)
admin.site.register(Owner, OwnerAdmin)

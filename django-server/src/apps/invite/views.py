# -*- coding: utf-8 -*-
import json
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.http import (
	JsonResponse,
	HttpResponse,
	HttpResponseForbidden,
)
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.middleware import csrf

from socialauth.backends import get_username, django_user_from_fb_user, get_facebook_user
from games.models import User
from .models import Invite


@csrf_exempt
def invite(request, key, player=None):
	# we return 404 if the the invite_key isn't in DB
	invitation = get_object_or_404(Invite, key=key, player=player)

	if invitation.is_expired:
		html = "<html><body>Cette invitation a expiré.</html></body>"
		return HttpResponse(html)
	else:
		# Display FB login page
		return render(request, 'invitation.html', {
			'invite_key': key,
			'invite_player_id': player,
		})
		#html = "<html><body>key is %s and player is %s</html></body>" % (key, player)


@require_http_methods(['POST'])
def facebook_login(request):
	payload = json.loads(request.body)
	invite_key=payload['invite_key']
	invite_player_id=payload['invite_player_id']

	try:
		fb_username = get_username(payload['user_id'])
		existing_user = User.objects.get(username=fb_username)
		# import ipdb; ipdb.set_trace()
	except User.DoesNotExist:
		fb_user = get_facebook_user(payload['access_token'])
		# if a player_id has been provided with the invite
		if invite_player_id:
			player = get_object_or_404(User, pk=invite_player_id)
			user = django_user_from_fb_user(player, fb_user)
		else:
			# in the case no player_id is provided, we create a new user
			user = django_user_from_fb_user(User(), fb_user)
		# invalidate the invite
		invitation = get_object_or_404(Invite, key=invite_key)
		invitation.is_expired = True
		invitation.save()
		return JsonResponse(dict(
			csrf_token=csrf.get_token(request),
			access_token=payload['access_token'],
			user_id=user.id,
			**user.as_json()
		))
	else:
		return HttpResponseForbidden('Player already associated with this Facebook user')

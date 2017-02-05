# -*- coding: utf-8 -*-
import json
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.http import (
	Http404,
	HttpResponseServerError,
	HttpResponseBadRequest,
	JsonResponse,
	HttpResponse,
)
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.middleware import csrf

from socialauth.views import facebook_login as sa_facebook_login
from games.models import User
from .models import Invite


@csrf_exempt
def invite(request, key, player=None):
	invitation = get_object_or_404(Invite, key=key, player=player)

	if invitation.is_expired:
		html = "<html><body>Cette invitation a expiré.</html></body>"
		return HttpResponse(html)
	else:
		# Display FB login page
		return render(request, 'index.html', {
			'invite_key': key,
			'invite_player_id': player,
		})
		#html = "<html><body>key is %s and player is %s</html></body>" % (key, player)


@require_http_methods(['POST'])
def facebook_login(request):
	backend = 'invite.backends.InviteFacebookBackend'
	payload = json.loads(request.body)

	return sa_facebook_login(request,
		backend=backend,
		invite_key=payload['invite_key'],
		invite_player_id=payload['invite_player_id'],
	)

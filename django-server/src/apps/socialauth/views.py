import json
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.middleware import csrf


DEFAULT_BACKEND = 'socialauth.backends.FacebookBackend'

@require_http_methods(['POST'])
def facebook_login(request, **kwargs):
	try:
		creds = json.loads(request.body)
		access_token = creds['access_token']
		signed_request = creds['signed_request']
	except (ValueError, KeyError):
		raise PermissionDenied

	user = authenticate(
		access_token=access_token,
		signed_request=signed_request,
		**kwargs
	)

	if not user:
		raise PermissionDenied

	login(request, user)

	return JsonResponse(dict(
		csrf_token=csrf.get_token(request),
		access_token=access_token,
		user_id=user.id,
		**user.as_json()
	))

from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.middleware import csrf


@require_http_methods(['POST'])
def facebook_login(request):
	try:
		access_token = request.POST['access_token']
		signed_request = request.POST['signed_request']
	except KeyError:
		raise PermissionDenied

	user = authenticate(
		access_token=access_token,
		signed_request=signed_request
	)

	if not user:
		raise PermissionDenied

	login(request, user, backend='socialauth.backends.FacebookBackend')
	return JsonResponse({ 'token': csrf.get_token(request) })

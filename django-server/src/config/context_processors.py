from django.conf import settings


def exposed_settings(request):
	""" Pass through settings to templates """
	return {
		'FACEBOOK_CLIENT_ID': settings.FACEBOOK_CLIENT_ID,
	}
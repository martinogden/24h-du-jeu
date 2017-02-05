from django.contrib.auth import get_user_model
from socialauth.backends import FacebookBackend, get_username


class InviteFacebookBackend(FacebookBackend):

	def _get_or_create_django_user(self, fb_user, **kwargs):
		username = get_username(fb_user['id'])

		User = get_user_model()

		try:
			return User.objects.get(username=username)

		except User.DoesNotExist:
			pass

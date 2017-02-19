from django.core.exceptions import PermissionDenied

from socialauth.backends import FacebookBackend


class GameFacebookBackend(FacebookBackend):

	def create_django_user(self, fb_user):
		# we don't create a new user if FB user not in DB
		return None

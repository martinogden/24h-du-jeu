from socialauth.backends import FacebookBackend


class GameFacebookBackend(FacebookBackend):

	def django_user_from_fb_user(dj_user, fb_user):
		# we don't create a new user if FB user not in DB
		return None

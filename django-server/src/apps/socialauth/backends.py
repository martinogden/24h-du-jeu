import json
import hashlib
import hmac
import logging
import time
from urlparse import urljoin
from base64 import urlsafe_b64encode, urlsafe_b64decode

import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


logger = logging.getLogger(__name__)


FACEBOOK_API_BASE_URL = 'https://graph.facebook.com'
FACEBOOK_FIELDS = ('id', 'first_name', 'last_name', 'email')
HMAC_SHA256 = 'HMAC-SHA256'
TEN_MINS = 10*60

class SignedRequestDecodeException(Exception):
	pass


class FacebookBackend(object):

	def authenticate(self, access_token=None, signed_request=None, **kwargs):
		try:
			payload = parse_signed_request(signed_request)
		except SignedRequestDecodeException:
			return None

		logger.debug('facebook response: %s', payload)

		if not verify_facebook_user(access_token, payload['user_id']):
			return None

		fb_user = get_facebook_user(access_token)
		if not fb_user:
			return None

		username = get_username(fb_user['id'])
		User = get_user_model()

		try:
			return User.objects.get(username=username)
		except User.DoesNotExist:
			return django_user_from_fb_user(User(), fb_user)


	def get_user(self, user_id):
		User = get_user_model()
		try:
			return User.objects.get(pk=user_id)
		except User.DoesNotExist:
			return None


def _decode(string):
	padding = '=' * (-len(string) % 4)
	return urlsafe_b64decode(str(string) + padding)


def _encode(string):
	return urlsafe_b64encode(string).rstrip('=')

def parse_signed_request(signed_request):
	""" Check provided facebook signed_request against our app
		secret_key to ensure request is from facebook.

		:raises: {SignedRequestDecodeException}
		:returns: {dict} request payload
	"""

	# get payload and signed payload hash
	try:
		exp_signed, b64_payload = signed_request.split('.')
		exp_signed = _decode(exp_signed)
		payload = _decode(b64_payload)
		payload = json.loads(payload)
	except (AttributeError, ValueError, TypeError):
		raise SignedRequestDecodeException

	# ensure payload signed using sha256
	if not payload.get('algorithm', '').upper() == HMAC_SHA256:
		err_msg = "Must use %s algorithm" % HMAC_SHA256
		raise SignedRequestDecodeException(err_msg)

	# validate signed request
	key = settings.FACEBOOK_CLIENT_SECRET
	msg = b64_payload.encode('ascii')
	signed = hmac.new(key, msg=msg, digestmod=hashlib.sha256).digest()

	if signed != exp_signed:
		raise SignedRequestDecodeException("Invalid signed request")

	return payload


def generate_signed_request(payload):
	"""
	Inverse of `parse_signed_request`, useful for testing
	"""
	payload.update({ 'algorithm': HMAC_SHA256 })

	# canonicalize outputted json: remove spaced and sort keys
	serialized = json.dumps(payload, sort_keys=True, separators=(',:'))
	msg = _encode(serialized)
	key = settings.FACEBOOK_CLIENT_SECRET
	digest = hmac.new(key, msg, hashlib.sha256).digest()
	signature = _encode(digest)

	return u'%s.%s' % (signature, msg)


def verify_facebook_user(access_token, user_id):
	url = get_url('/debug_token')
	params = {
		'input_token': access_token,
		'access_token': '|'.join([
			settings.FACEBOOK_CLIENT_ID,
			settings.FACEBOOK_CLIENT_SECRET,
		]),
	}
	response = requests.get(url, params)

	if not response.ok:
		return False

	data = response.json()['data']
	if data['expires_at'] < time.time():
		return False
	if user_id != data['user_id']:
		return False
	return True


def get_facebook_user(access_token):
	url = get_url('/me')
	headers = get_auth_headers(access_token)
	params = {
		'fields': ','.join(FACEBOOK_FIELDS),
	}
	response = requests.get(url, params, headers=headers)

	if not response.ok:
		return None

	data = response.json()

	# log if required fields not present
	msg = 'facebook user %s doesn\'t have requested field \'%s\' set. response: %s'
	for field_name in FACEBOOK_FIELDS:
		if not field_name in data:
			logger.warning(msg, data['id'], field_name, data)

	# `email` will be returned only if valid email address is available.
	# But, we need an email field for django, so we'll have to improvise.
	# We'll also check that the provided email is valid whilst we're here.
	email = data.get('email', '')

	try:
		validate_email(email)
	except ValidationError:
		# make up a valid unique email
		data['email'] = '%s@facebook.com' % data['id']

	data['picture_url'] = get_picture_url(data['id'])
	return data


def get_url(uri):
	return urljoin(FACEBOOK_API_BASE_URL, uri) 


def get_auth_headers(access_token):
	return { 'Authorization': 'OAuth %s' % access_token }


def get_username(facebook_user_id):
	return 'facebook--%s' % facebook_user_id


def get_picture_url(facebook_user_id):
	url = "https://graph.facebook.com/v2.8/%s/picture" % facebook_user_id
	response = requests.get(url, allow_redirects=True)

	if response.ok:
		return response.url


def django_user_from_fb_user(dj_user, fb_user):
	username = get_username(fb_user['id'])
	
	# always overwrite
	dj_user.email = fb_user['email']
	dj_user.username = username
	dj_user.is_staff = False
	dj_user.is_superuser = False

	# never overwrite
	dj_user.first_name = dj_user.first_name or fb_user.get('first_name')
	dj_user.last_name = dj_user.last_name or fb_user.get('last_name')
	dj_user.picture_url = dj_user.picture_url or fb_user['picture_url']
	dj_user.pseudo = dj_user.pseudo or fb_user.get('first_name')

	dj_user.set_unusable_password()
	dj_user.save()
	return dj_user

import base64
import json
import hashlib
import hmac
import logging
import time
from urlparse import urljoin

import requests

from .models import Player
from . import app, db

logger = logging.getLogger(__name__)

## Facebook utils

FACEBOOK_API_BASE_URL = 'https://graph.facebook.com'
HMAC_SHA256 = 'HMAC-SHA256'


class OAuthException(Exception):
	pass


class SignedRequestDecodeException(Exception):
	pass


def _decode(string):
	padding = '=' * (-len(string) % 4)
	return base64.urlsafe_b64decode(str(string) + padding)


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
	except (ValueError, TypeError):
		raise SignedRequestDecodeException

	# ensure payload signed using sha256
	if not payload.get('algorithm', '').upper() == HMAC_SHA256:
		err_msg = "Must use %s algorithm" % HMAC_SHA256
		raise SignedRequestDecodeException(err_msg)

	# validate signed request
	key = app.config['FACEBOOK_CLIENT_SECRET']
	msg = b64_payload.encode('ascii')
	signed = hmac.new(key, msg=msg, digestmod=hashlib.sha256).digest()

	if signed != exp_signed:
		raise SignedRequestDecodeException("Invalid signed request")

	return payload


def verify_facebook_user(access_token, user_id):
	url = get_url('/debug_token')
	params = {
		'input_token': access_token,
		'access_token': '|'.join([
			app.config['FACEBOOK_CLIENT_ID'],
			app.config['FACEBOOK_CLIENT_SECRET'],
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
		'fields': ','.join(app.config['FACEBOOK_FIELDS']),
	}
	response = requests.get(url, params, headers=headers)

	if not response.ok:
		return None

	data = response.json()

	# log if required fields not present
	msg = 'facebook user %s doesn\'t have requested field \'%s\' set. response: %s'
	for field_name in app.config['FACEBOOK_FIELDS']:
		if not field_name in data:
			logger.warning(msg, data['id'], field_name, data)

	# `email` will be returned only if valid email address is available.
	data['email'] = data.get('email', '%s@facebook.com' % data['id'])
	return data


def get_url(uri):
	return urljoin(FACEBOOK_API_BASE_URL, uri) 


def get_auth_headers(access_token):
	return { 'Authorization': 'OAuth %s' % access_token }


def get_username(facebook_user_id):
	return 'facebook::%s' % facebook_user_id


## JWT stuff

def authenticate(access_token, signed_request):
	try:
		request = parse_signed_request(signed_request)
	except SignedRequestDecodeException as e:
		return None

	fb_user_id = request['user_id']
	if not verify_facebook_user(access_token, fb_user_id):
		return None

	fb_user = get_facebook_user(access_token)
	if not fb_user:
		return None

	# get or create facebook user from our db
	player = Player.query.filter_by(facebook_id=fb_user_id).first()

	if not player:
		player = Player.from_facebook_user(fb_user)
		db.session.add(game)
		db.session.commit()

	return player


def identity(payload):
	user_id = payload['identity']
	return Player.query.filter_by(id=user_id).first()


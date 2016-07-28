import base64
import json
import hashlib
import hmac
import requests

from .models import Player
from . import app


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


## JWT stuff

def authenticate(user_id, signed_request):
	try:
		request = parse_signed_request(signed_request)
	except SignedRequestDecodeException:
		return None

	if user_id != request['user_id']:
		return None

	return Player.query.filter_by(facebook_id=user_id).first()


def identity(payload):
	user_id = payload['identity']
	return Player.query.filter_by(facebook_id=user_id).first()


import time

from django.test import TestCase, Client, override_settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from mock import patch, DEFAULT, MagicMock

from . import backends
from .backends import (
	FacebookBackend,
	verify_facebook_user,
	get_facebook_user,
	FACEBOOK_API_BASE_URL,
	FACEBOOK_FIELDS,
)

User = get_user_model()

TEST_ACCESS_TOKEN = 'TEST_ACCESS_TOKEN'
TEST_FB_USER_ID = 123

TEST_FB_USER = {
	'id': TEST_FB_USER_ID,
	'first_name': 'first',
	'last_name': 'last',
	'email': 'test@example.com',
}


def json_response_stub(get, ok=True, user_id=TEST_FB_USER_ID, expires_at=None):
	payload = {
		'data': {
			'expires_at': expires_at == None and time.time() + 10 or expires_at,
			'user_id': user_id,
		}
	}
	stub = MagicMock(return_value=payload)
	get.return_value = MagicMock(ok=ok, json=stub)
	return stub


@override_settings(
	FACEBOOK_CLIENT_ID='CLIENT_ID',
	FACEBOOK_CLIENT_SECRET='CLIENT_SECRET',
)
class BaseFacebookTestCase(TestCase):
	pass


class FacebookBackendTestCase(BaseFacebookTestCase):

	@patch.multiple(
		backends,
		verify_facebook_user=DEFAULT,
		get_facebook_user=lambda *args: TEST_FB_USER,
	)
	def test_backend_authenticates_valid_existing_user(self, **patches):
		patches['verify_facebook_user'].return_value = True
		user = User.objects.create(username='facebook::%s' % TEST_FB_USER_ID)

		payload = {
			'user_id': TEST_FB_USER_ID,
			'code': 'CODE',
		}

		creds = {
			'access_token': TEST_ACCESS_TOKEN,
			'signed_request': backends.generate_signed_request(payload),
		}

		authed_user = FacebookBackend().authenticate(**creds)

		self.assertEqual(authed_user, user)
		self.assertFalse(authed_user.is_staff)
		self.assertFalse(authed_user.is_superuser)
		self.assertEqual(patches['verify_facebook_user'].call_count, 1)

	@patch.multiple(
		backends,
		verify_facebook_user=DEFAULT,
		get_facebook_user=lambda *args: TEST_FB_USER,
	)
	def test_backend_authenticates_valid_new_user(self, **patches):
		patches['verify_facebook_user'].return_value = True

		username = 'facebook::%s' % TEST_FB_USER_ID
		exists = User.objects.filter(username=username).exists()
		self.assertFalse(exists)

		payload = {
			'user_id': TEST_FB_USER_ID,
			'code': 'CODE',
		}

		creds = {
			'access_token': TEST_ACCESS_TOKEN,
			'signed_request': backends.generate_signed_request(payload),
		}

		authed_user = FacebookBackend().authenticate(**creds)

		self.assertIsNotNone(authed_user)
		self.assertFalse(authed_user.is_staff)
		self.assertFalse(authed_user.is_superuser)
		self.assertFalse(authed_user.has_usable_password())
		self.assertEqual(patches['verify_facebook_user'].call_count, 1)

	@patch.multiple(
		backends,
		verify_facebook_user=lambda *args: False,
		get_facebook_user=DEFAULT,
	)
	def test_backend_not_authenticate_corrupted_signed_request(self, **patches):
		creds = {
			'access_token': TEST_ACCESS_TOKEN,
			'signed_request': 'INVALID'
		}

		authed_user = FacebookBackend().authenticate(*creds)

		self.assertIsNone(authed_user)
		self.assertEqual(patches['get_facebook_user'].call_count, 0)

	@patch.multiple(
		backends,
		verify_facebook_user=lambda *args: False,
		get_facebook_user=DEFAULT,
	)
	def test_backend_not_authenticate_unverified_fb_user(self, **patches):
		payload = {
			'user_id': TEST_FB_USER_ID,
			'code': 'CODE',
		}

		creds = {
			'access_token': TEST_ACCESS_TOKEN,
			'signed_request': backends.generate_signed_request(payload)
		}

		authed_user = FacebookBackend().authenticate(*creds)

		self.assertIsNone(authed_user)
		self.assertEqual(patches['get_facebook_user'].call_count, 0)


class UtilsTestCase(BaseFacebookTestCase):

	@patch('requests.get')
	def test_verify_facebook_user_is_false_when_non_2xx_response(self, get):
		json_response_stub(get, ok=False)

		verified = verify_facebook_user(TEST_ACCESS_TOKEN, TEST_FB_USER_ID)
		self.assertFalse(verified)

	@patch('requests.get')
	def test_verify_facebook_user_is_false_when_expired(self, get):
		json = json_response_stub(get, ok=True, expires_at=0)

		verified = verify_facebook_user(TEST_ACCESS_TOKEN, TEST_FB_USER_ID)
		json.assert_called_once_with()
		self.assertFalse(verified)

	@patch('requests.get')
	def test_verify_facebook_user_is_false_with_invalid_user(self, get):
		json = json_response_stub(get, ok=True, user_id='bad_id')

		verified = verify_facebook_user(TEST_ACCESS_TOKEN, TEST_FB_USER_ID)
		json.assert_called_once_with()
		self.assertFalse(verified)

	@patch('requests.get')
	def test_verify_facebook_user_correct_request_params(self, get):
		expected_url = FACEBOOK_API_BASE_URL + '/debug_token'
		expected_params = {
			'access_token': 'CLIENT_ID|CLIENT_SECRET',
			'input_token': TEST_ACCESS_TOKEN,
		}

		json = json_response_stub(get, ok=True)

		verified = verify_facebook_user(TEST_ACCESS_TOKEN, TEST_FB_USER_ID)
		get.assert_called_once_with(expected_url, expected_params)
		json.assert_called_once_with()
		self.assertTrue(verified)

	@patch('requests.get')
	def test_get_facebook_user_correct_request_params(self, get):
		get.return_value = MagicMock(ok=True)
		access_token = 'test_access_token'

		expected_url = FACEBOOK_API_BASE_URL + '/me'
		expected_params = {
			'fields': ','.join(FACEBOOK_FIELDS),
		}
		expected_headers = {
			'Authorization': 'OAuth %s' % access_token
		}

		get_facebook_user(access_token)
		get.assert_called_once_with(
			expected_url,
			expected_params,
			headers=expected_headers,
		)


class ViewsTestCase(BaseFacebookTestCase):

	def setUp(self):
		super(ViewsTestCase, self).setUp()
		self.client = Client()
		self.url = reverse('socialauth:facebook')

	@patch.object(backends, 'get_facebook_user', lambda *args: TEST_FB_USER)
	@patch('requests.get')
	def test_returns_200_with_csrf_token_when_user_authed(self, get):
		json = json_response_stub(get, ok=True)

		payload = {
			'user_id': TEST_FB_USER_ID,
			'code': 'CODE',
		}

		params = {
			'access_token': TEST_ACCESS_TOKEN,
			'signed_request': backends.generate_signed_request(payload)
		}
		response = self.client.post(self.url, params)

		self.assertEqual(json.call_count, 1)
		self.assertEqual(response.status_code, 200)
		self.assertTrue('token' in response.content)  # json

	@patch('requests.get')
	def test_raises_permission_denied_bad_get_params(self, get):
		bad_params = {
			'foo': 'bar',
		}
		response = self.client.post(self.url, bad_params)
		self.assertEqual(response.status_code, 403)

	@patch('requests.get')
	def test_raises_permission_denied_bad_creds(self, get):
		params = {
			'access_token': 'bad_access_token',
			'signed_request': 'bad_signed_request',
		}
		response = self.client.post(self.url, params)
		self.assertEqual(response.status_code, 403)

	@patch.object(backends, 'verify_facebook_user', lambda *args: False)
	@patch('requests.get')
	def test_raises_permission_denied_user_not_verified(self, get):
		payload = {
			'user_id': TEST_FB_USER_ID,
			'code': 'CODE',
		}

		params = {
			'access_token': 'bad_access_token',
			'signed_request': backends.generate_signed_request(payload),
		}
		response = self.client.post(self.url, params)
		self.assertEqual(response.status_code, 403)

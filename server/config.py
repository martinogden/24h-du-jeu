import os
from datetime import timedelta

DEBUG = True

PER_PAGE = 20
IMG_PATH = '/static/img/'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % (
	os.path.realpath('./db/24hDuJeuReferentDb2016Full')
)

FACEBOOK_CLIENT_ID = '322217561499723'
FACEBOOK_CLIENT_SECRET = 'e8401f063db5bf76cf50e290b91e0cd9'
FACEBOOK_FIELDS = ('id', 'first_name', 'last_name', 'email', 'picture')

# todo replace in prod
SECRET_KEY = '5f7654d8bacaf957e4c5855206d1286805fe5bd938b51d1e'

# use facebook response to sign in
JWT_AUTH_USERNAME_KEY = 'accessToken'
JWT_AUTH_PASSWORD_KEY = 'signedRequest'
JWT_EXPIRATION_DELTA = timedelta(days=1)
# JWT_AUTH_URL_RULE = None
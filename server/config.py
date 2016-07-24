import os

DEBUG = True

PER_PAGE = 20
IMG_PATH = '/static/img/'

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % (
	os.path.realpath('./db/24hDuJeuReferentDb2016Full')
)

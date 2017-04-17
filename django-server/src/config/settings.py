import os
import sys
from django.conf import global_settings


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

FIXTURE_DIRS = [os.path.join(BASE_DIR, 'fixtures')]


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
if os.environ.get('DJANGO_DEBUG', 'True') == 'True':
	DEBUG = True
else:
	DEBUG = False


ALLOWED_HOSTS = ['ludotheque.24hdujeu.fr', 'localhost']
if 'DJANGO_ALLOWED_HOST' in os.environ:
	ALLOWED_HOSTS += [os.environ['DJANGO_ALLOWED_HOST']]


# allow AWS health check to ping us
if not DEBUG:
	import requests
	url = 'http://169.254.169.254/latest/meta-data/local-ipv4'

	try:
		EC2_PRIVATE_IP = requests.get(url, timeout=1).text
	except requests.exceptions.RequestException:
		pass
	else:
		ALLOWED_HOSTS.append(EC2_PRIVATE_IP)


# Application definition
INSTALLED_APPS = [
	'solo',
	'backend',
	'health',
	'socialauth',
	'invite',
	'games',

	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',

]

MIDDLEWARE_CLASSES = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.gzip.GZipMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [ os.path.join(BASE_DIR, 'templates') ],
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
				'config.context_processors.exposed_settings',
			],
			'loaders': [
				'django.template.loaders.filesystem.Loader',
				'django.template.loaders.app_directories.Loader',
			]
		},
	}
]

WSGI_APPLICATION = 'config.wsgi.application'


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST_USER = os.environ.get('DJANGO_EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('DJANGO_EMAIL_HOST_PASSWORD', '')
SERVER_EMAIL = DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_SUBJECT_PREFIX = '[24hduJeu] '
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587


ADMINS = [
	('Celine Aussourd', 'celine.aussourd@gmail.com',)
]


LOGGING = {
	'version': 1,
	'disable_existing_loggers': False,
	'filters': {
		'require_debug_false': {
			'()': 'django.utils.log.RequireDebugFalse',
		},
		'require_debug_true': {
			'()': 'django.utils.log.RequireDebugTrue',
		},
	},
	'handlers': {
		'null': {
			'class': 'logging.NullHandler',
		},
		'console': {
			'level': 'DEBUG',
			'class': 'logging.StreamHandler',
			'formatter': 'colored',
			'filters': ['require_debug_true'],
		},
		'file': {
			'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
			'class': 'logging.FileHandler',
			'filename': os.environ.get('DJANGO_LOG_FILE', 'django.log'),
			'formatter': 'colored',
			'filters': ['require_debug_false'],
		},
		'mail_admins': {
			'level': 'ERROR',
			'class': 'django.utils.log.AdminEmailHandler',
			'include_html': True,
			'filters': ['require_debug_false'],
		}
	},
	'loggers': {
		'django.security.DisallowedHost': {
			'handlers': ['null'],
			'propagate': False,
		},
		'': {
			'handlers': ['console', 'file', 'mail_admins'],
			'level': 'DEBUG',
			'propagate': False,
		},
	},
	'formatters': {
		'colored': {
			'()': 'coloredlogs.ColoredFormatter',
			'format': '(%(name)s) %(message)s %(levelname)s',
		},
	},
}

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

if DEBUG:
	# use sqlite in development
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.sqlite3',
			'NAME': '../db/24hDuJeuReferentDb2016Full',
		}
	}

else:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.sqlite3',
			'NAME': '/var/www/ludotheque/db/24hDuJeuReferentDb',
		}
	}


FILESYSTEM_CACHE_LOCATION = os.environ.get('DJANGO_FILESYSTEM_CACHE_LOCATION', './var/tmp/django_cache')

CACHES = {
	'default': {
		'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
		'LOCATION': os.path.join(FILESYSTEM_CACHE_LOCATION, 'default'),
		'OPTIONS': { 'MAX_ENTRIES': 1000 },
	}
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	}
]


AUTHENTICATION_BACKENDS = (
	'django.contrib.auth.backends.ModelBackend',
	'games.backends.GameFacebookBackend',
)


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'fr'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
if DEBUG:
	IMG_DIR = os.path.realpath('../client/static/img')
else:
	STATIC_ROOT= os.environ['STATIC_ROOT']
	IMG_DIR=STATIC_ROOT + '/img'
STATICFILES_DIRS = [
	os.path.join(BASE_DIR, "static"),
]


# custom admin
LIST_PER_PAGE = 10
SITE_ID = 1
SITE_TITLE = u'24h du Jeu'
SITE_HEADER = 'Administration'


SESSION_COOKIE_HTTPONLY = False
CSRF_COOKIE_HTTPONLY = False


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'media')

AUTH_USER_MODEL = 'games.User'


FACEBOOK_CLIENT_ID = os.environ['FACEBOOK_CLIENT_ID']
FACEBOOK_CLIENT_SECRET = os.environ['FACEBOOK_CLIENT_SECRET']


try:
	from local_settings import *
except ImportError as e:
	pass

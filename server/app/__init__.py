from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_jwt import JWT
import os
import logging.config


app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)
ma = Marshmallow(app)


if app.config['DEBUG']:
	db.create_all()
	db.session.commit()

# Logging

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': os.environ.get('FLASK_LOG_LEVEL', 'INFO'),
            'class': 'logging.FileHandler',
            'filename': os.environ.get('FLASK_LOG_FILE', './flask.log'),
        },
    },
    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    }
}

logging.config.dictConfig(LOGGING_CONFIG)

# eugh. avoid circular imports
from . import views
from .auth import authenticate, identity

jwt = JWT(app, authenticate, identity)
jwt.auth_response_handler(views.auth_response)


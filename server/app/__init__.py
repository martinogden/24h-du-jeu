from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_jwt import JWT


app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)
ma = Marshmallow(app)


if app.config['DEBUG']:
	db.create_all()
	db.session.commit()


# eugh. avoid circular imports
from . import views
from .auth import authenticate, identity

jwt = JWT(app, authenticate, identity)
jwt.auth_response_handler(views.auth_response)

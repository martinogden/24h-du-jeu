from flask_script import Manager
from app import app


@manager.command
def run():
	app.run()


if __name__ == "__main__":
	manager.run()
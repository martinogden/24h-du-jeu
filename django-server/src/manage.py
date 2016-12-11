#!/usr/bin/env python
import os
import sys
import dotenv

if __name__ == "__main__":
	# read env vars
	path = os.path.abspath('.env')
	dotenv.read_dotenv(dotenv=path)

	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

	from django.core.management import execute_from_command_line

	execute_from_command_line(sys.argv)

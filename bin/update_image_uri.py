#!/usr/bin/env python

import os
import sqlite3

DATABASE = 'db/24hDuJeuReferentDb2016Full'


def run():
	""" Replace image_uri by new value """

	conn = sqlite3.connect(DATABASE)
	cur = conn.cursor()

	query = cur.execute("select id,image_uri from game")

	for game_id, image_uri in query.fetchall():
		try:
			# we replace http by https
			new_image_uri = 'https' + image_uri[4:]
			cur.execute('''UPDATE game set image_uri=? where id=?''', (new_image_uri, game_id))
		except TypeError as e:
			print "ERROR", image_uri
			pass

	conn.commit()
	conn.close()


if __name__ == "__main__":
	run()
#!/usr/bin/env python

import os
import sqlite3

DATABASE = 'db/24hDuJeuReferentDb2016Full'


def run():
	""" Replace non-numerical game id by numerical ones """

	conn = sqlite3.connect(DATABASE)
	cur = conn.cursor()
	# q = cur.execute("SELECT ID, NAME, TYPE, THEMES, MECHANISMS, FAMILIES, MIN_PLAYER, MAX_PLAYER, MIN_AGE, MAX_AGE, DURATION, DESCRIPTION, IMAGE_URI, THUMBNAIL_URI, SORT_NAME, ID_TRICTRAC FROM GAME WHERE id like 'bgg%'")

	# for g_id, name, g_type, themes, mechanisms, families, min_player, max_player, min_age, max_age, duration, description, image_uri, thumbnail_uri, sort_name, id_trictrac in q.fetchall():
		# remove "bgg"
		# int_id = g_id[3:]
		# print g_id, name
		# i = cur.execute('''INSERT INTO new_game(name, type, themes, mechanisms, families, min_player, max_player, min_age, max_age, duration, description, image_uri, thumbnail_uri, sort_name, id_trictrac, id_bgg, old_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (name, g_type, themes, mechanisms, families, min_player, max_player, min_age, max_age, duration, description, image_uri, thumbnail_uri, sort_name, id_trictrac, int_id, g_id))

	""" We update the knower and owner table """

	knowers = cur.execute("select fk_game_id, fk_player_id from owner")

	for k_game_id, k_player_id in knowers.fetchall():
		try:
			cur.execute("select id from game where old_id=?", (k_game_id,))
			game_id = cur.fetchone()[0]
			cur.execute("select id from player where old_id=?", (k_player_id,))
			player_id = cur.fetchone()[0]
			print k_game_id, game_id, k_player_id, player_id
			cur.execute('''INSERT INTO new_owner(fk_game_id, fk_player_id) values (?, ?)''', (game_id, player_id))
		except TypeError as e:
			print "ERROR", k_game_id, k_player_id
			pass

	conn.commit()
	conn.close()


if __name__ == "__main__":
	run()
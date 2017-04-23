import os
import sqlite3
from wand.image import Image


DATABASE = 'db/24hDuJeuReferentDb2016Full'
IMG_DIR = os.path.realpath('client/static/img')

def get_width_height(cur, game_id, bgg_id, name):

	if not bgg_id:
		print "no bgg id for that game:", name
		try:
			cur.execute('''UPDATE game set image_width=?, image_height=? where id=?''', (223, 223, game_id))
		except TypeError as e:
			print "ERROR", name
			pass
		return

	# check that the image exists
	fn = os.path.join(IMG_DIR, "%s.jpg" % bgg_id)
	if not os.path.exists(fn):
		print "no image for that game:", name
		try:
			cur.execute('''UPDATE game set image_width=?, image_height=? where id=?''', (223, 223, game_id))
		except TypeError as e:
			print "ERROR", name
			pass
		return

	with Image(filename=fn) as i:
		try:
			# we update the image width and height
			# print "width:", i.width, 'height:', i.height 
			cur.execute('''UPDATE game set image_width=?, image_height=? where id=?''', (i.width, i.height, game_id))
		except TypeError as e:
			print "ERROR", name
			pass



def run():
	conn = sqlite3.connect(DATABASE)
	cur = conn.cursor()
	q = cur.execute('SELECT ID, ID_BGG, NAME, IMAGE_WIDTH, IMAGE_HEIGHT FROM GAME')

	for game_id, bgg_id, name, i_width, i_height in q.fetchall():
		if not i_width or not i_height:
			get_width_height(cur, game_id, bgg_id, name)
		else:
			# print "This game has already his height and width:", name
			pass

	conn.commit()
	conn.close()


if __name__ == "__main__":
	run()
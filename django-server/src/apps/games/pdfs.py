# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle, PageBreak

from .models import Game, User, Knower, Owner

@login_required
def pdf_recap(request):
    # # Create the HttpResponse object with the appropriate PDF headers.
	response = HttpResponse(content_type='application/pdf')
	response['Content-Disposition'] = 'inline; filename="RECAP.pdf"'

	doc = SimpleDocTemplate(response, rightMargin=20,leftMargin=20, topMargin=20,bottomMargin=20)
	doc.pagesize = landscape(A4)
	elements = []

	# Get data
	games = Game.objects.filter(owner__is_bringing = True).distinct()
	 
	data = [
	["TITRE", "PROPRIETAIRES", "SAVENT EXPLIQUER", "GENRE"],
	]

	styles = getSampleStyleSheet()
	
	# We build the data
	for game in games:

		game_owners = ""
		for owner in game.owners.filter(owner__is_bringing = True):
			game_owners = owner.pseudo + " " + game_owners

		game_knowers = ""
		for knower in game.knowers.all():
			game_knowers = knower.pseudo + " " + game_knowers

		data.append([Paragraph(game.name, styles['BodyText']), Paragraph(game_owners, styles['BodyText']), Paragraph(game_knowers, styles['BodyText']), game.type_genre])

	t=Table(data, colWidths=(None,None,300,60))

	# Styling the titles and the grid
	style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
	                    ('VALIGN',(0,0),(-1,0),'MIDDLE'),
	                    ('ALIGN',(0,0),(-1,0),'CENTER'),
	                    ('INNERGRID', (0,0), (-1,-1), 0.25, colors.grey),
	                    ('BOX', (0,0), (-1,-1), 0.25, colors.grey),
	                    ])
	
	t.setStyle(style)

	# we color lines alternatively
	for each in range(len(data)):
		if each % 2 == 0:
			bg_color = colors.white
		else:
			bg_color = colors.lightblue

		t.setStyle(TableStyle([('BACKGROUND', (0, each), (-1, each), bg_color)]))
	

	#Send the data and build the file
	elements.append(t)
	doc.build(elements)
	return response

@login_required
def pdf_jeu_genre(request):
	response = HttpResponse(content_type='application/pdf')
	response['Content-Disposition'] = 'inline; filename="jeu_genre.pdf"'

	doc = SimpleDocTemplate(response, rightMargin=20,leftMargin=20, topMargin=20,bottomMargin=20)
	doc.pagesize = A4
	elements = []

	# Get data
	games = Game.objects.filter(owner__is_bringing = True).distinct()
	 
	data = [
	["JEU", "GENRE", "", "JEU", "GENRE"],
	]

	styles = getSampleStyleSheet()
	
	# We build the data
	for i in xrange(0, len(games), 2):
		# when the number of games is odd, the last row contains only 1 element
		if i+1 == len(games):
			data.append([Paragraph(games[i].name, styles['BodyText']), games[i].type_genre, "", "", ""])
		else:
			data.append([Paragraph(games[i].name, styles['BodyText']), games[i].type_genre, "", Paragraph(games[i+1].name, styles['BodyText']), games[i+1].type_genre])

	t=Table(data, colWidths=(None,60, 50, None, 60))

	# Styling the titles and the grid
	style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
	                    ('VALIGN',(0,0),(-1,0),'MIDDLE'),
	                    ('ALIGN',(0,0),(-1,0),'CENTER'),
	                    ('INNERGRID', (0,0), (1,-1), 0.25, colors.grey),
	                    ('INNERGRID', (3,0), (-1,-1), 0.25, colors.grey),
	                    ('BOX', (0,0), (1,-1), 0.25, colors.grey),
	                    ('BOX', (3,0), (-1,-1), 0.25, colors.grey),
	                    ])
	
	t.setStyle(style)

	# we color lines alternatively
	for each in range(len(data)):
		if each % 2 == 0:
			bg_color = colors.white
		else:
			bg_color = colors.lightblue

		t.setStyle(TableStyle([('BACKGROUND', (0, each), (1, each), bg_color)]))
		t.setStyle(TableStyle([('BACKGROUND', (3, each), (-1, each), bg_color)]))
	

	#Send the data and build the file
	elements.append(t)
	doc.build(elements)
	return response

@login_required
def pdf_par_genre(request):
	response = HttpResponse(content_type='application/pdf')
	response['Content-Disposition'] = 'inline; filename="par_genre.pdf"'

	doc = SimpleDocTemplate(response, rightMargin=20,leftMargin=20, topMargin=20,bottomMargin=20)
	doc.pagesize = landscape(A4)
	elements = []

	# Get data
	placement_games = Game.objects.filter(type_genre = "Placement", owner__is_bringing = True).distinct()
	enfants_games = Game.objects.filter(type_genre = "Enfants", owner__is_bringing = True).distinct()
	gestion_games = Game.objects.filter(type_genre = "Gestion", owner__is_bringing = True).distinct()
	ambiance_games = Game.objects.filter(type_genre = "Ambiance", owner__is_bringing = True).distinct()
	strategie_games = Game.objects.filter(type_genre = "Stratégie", owner__is_bringing = True).distinct()
	cooperatif_games = Game.objects.filter(type_genre = "Coopératif", owner__is_bringing = True).distinct()
	encheres_games = Game.objects.filter(type_genre = "Enchères", owner__is_bringing = True).distinct()
	parcours_games = Game.objects.filter(type_genre = "Parcours", owner__is_bringing = True).distinct()
	 
	data1 = [
	["PLACEMENT", "", "", "ENFANTS", ""],
	]
	data2 = [
	["GESTION", "", ""]
	]
	data3 = [
	["AMBIANCE", "", "", ""]
	]
	data4 = [
	["STRATEGIE", "", "", "COOPERATIF", ""]
	]
	data5 = [
	["ENCHERES", "", "", "PARCOURS", ""]
	]

	styles = getSampleStyleSheet()
	
	# We build the data

	# PLACEMENT AND ENFANTS

	# We display all the combinaison depending which list is shorter than the other
	# and depending if the number of elements in the list is odd or even
	# There are 8 possible combinations.
	for i, j in zip_longest(xrange(0, len(placement_games), 2), xrange(0, len(enfants_games), 2), fillvalue=-1):
		col1 = col2 = col3 = col4 = ""
		if i >= 0:
			col1 = Paragraph(placement_games[i].name, styles['BodyText'])
		if i >= 0 and i+1 < len(placement_games):
			col2 = Paragraph(placement_games[i+1].name, styles['BodyText'])
		if j >= 0:
			col3 = Paragraph(enfants_games[j].name, styles['BodyText'])
		if j >= 0 and j+1 < len(enfants_games):
			col4 = Paragraph(enfants_games[j+1].name, styles['BodyText'])

		data1.append([col1, col2, "", col3, col4])

	# GESTION

	for i in xrange(0, len(gestion_games), 3):
		if i+1 == len(gestion_games):
			data2.append([Paragraph(gestion_games[i].name, styles['BodyText']), "", ""])
		elif i+2 == len(gestion_games):
			data2.append([Paragraph(gestion_games[i].name, styles['BodyText']), Paragraph(gestion_games[i+1].name, styles['BodyText']), ""])
		else:
			data2.append([Paragraph(gestion_games[i].name, styles['BodyText']), Paragraph(gestion_games[i+1].name, styles['BodyText']), Paragraph(gestion_games[i+2].name, styles['BodyText'])])

	# AMBIANCE

	for i in xrange(0, len(ambiance_games), 4):
		if i+1 == len(ambiance_games):
			data3.append([Paragraph(ambiance_games[i].name, styles['BodyText']), "", "", ""])
		elif i+2 == len(ambiance_games):
			data3.append([Paragraph(ambiance_games[i].name, styles['BodyText']), Paragraph(ambiance_games[i+1].name, styles['BodyText']), "", ""])
		elif i+3 == len(ambiance_games):
			data3.append([Paragraph(ambiance_games[i].name, styles['BodyText']), Paragraph(ambiance_games[i+1].name, styles['BodyText']), Paragraph(ambiance_games[i+2].name, styles['BodyText']), ""])
		else:
			data3.append([Paragraph(ambiance_games[i].name, styles['BodyText']), Paragraph(ambiance_games[i+1].name, styles['BodyText']), Paragraph(ambiance_games[i+2].name, styles['BodyText']), Paragraph(ambiance_games[i+3].name, styles['BodyText'])])

	# STRATEGIE AND COOPERATIF

	for i, j in zip_longest(xrange(0, len(strategie_games), 2), xrange(0, len(cooperatif_games), 2), fillvalue=-1):
		col1 = col2 = col3 = col4 = ""
		if i >= 0:
			col1 = Paragraph(strategie_games[i].name, styles['BodyText'])
		if i >= 0 and i+1 < len(strategie_games):
			col2 = Paragraph(strategie_games[i+1].name, styles['BodyText'])
		if j >= 0:
			col3 = Paragraph(cooperatif_games[j].name, styles['BodyText'])
		if j >= 0 and j+1 < len(cooperatif_games):
			col4 = Paragraph(cooperatif_games[j+1].name, styles['BodyText'])

		data4.append([col1, col2, "", col3, col4])

	# ENCHERES AND PARCOURS

	for i, j in zip_longest(xrange(0, len(encheres_games), 2), xrange(0, len(parcours_games), 2), fillvalue=-1):
		col1 = col2 = col3 = col4 = ""
		if i >= 0:
			col1 = Paragraph(encheres_games[i].name, styles['BodyText'])
		if i >= 0 and i+1 < len(encheres_games):
			col2 = Paragraph(encheres_games[i+1].name, styles['BodyText'])
		if j >= 0:
			col3 = Paragraph(parcours_games[j].name, styles['BodyText'])
		if j >= 0 and j+1 < len(parcours_games):
			col4 = Paragraph(parcours_games[j+1].name, styles['BodyText'])

		data5.append([col1, col2, "", col3, col4])


	t1=Table(data1, colWidths=(None, None, 50, None, None))
	t2=Table(data2)
	t3=Table(data3)
	t4=Table(data4, colWidths=(None, None, 50, None, None))
	t5=Table(data5, colWidths=(None, None, 50, None, None))

	# Styling the titles and the grid
	style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
	                    ('VALIGN',(0,0),(-1,0),'MIDDLE'),
	                    ('ALIGN',(0,0),(-1,0),'CENTER'),
					   ])
	t1.setStyle(style)
	t2.setStyle(style)
	t3.setStyle(style)
	t4.setStyle(style)
	t5.setStyle(style)

	style1 = TableStyle([('BACKGROUND',(0,0),(1,0), colors.lightblue),
	                    ('BACKGROUND',(3,0),(-1,0), colors.lightblue),
	                    ('INNERGRID', (0,0), (1,-1), 0.25, colors.grey),
	                    ('INNERGRID', (3,0), (-1,-1), 0.25, colors.grey),
	                    ('BOX', (0,0), (1,-1), 0.25, colors.grey),
	                    ('BOX', (3,0), (-1,-1), 0.25, colors.grey),
	                    ('SPAN',(0,0),(1,0)),
	                    ('SPAN',(3,0),(-1,0)),
	                    ])
	style2 = TableStyle([('BACKGROUND',(0,0),(-1,0), colors.lightblue),
	                    ('INNERGRID', (0,0), (-1,-1), 0.25, colors.grey),
	                    ('BOX', (0,0), (-1,-1), 0.25, colors.grey),
	                    ('SPAN',(0,0),(-1,0)),
	                    ])
	
	t1.setStyle(style1)
	t2.setStyle(style2)
	t3.setStyle(style2)
	t4.setStyle(style1)
	t5.setStyle(style1)

	#Send the data and build the file
	elements.append(t1)
	elements.append(PageBreak())
	elements.append(t2)
	elements.append(PageBreak())
	elements.append(t3)
	elements.append(PageBreak())
	elements.append(t4)
	elements.append(PageBreak())
	elements.append(t5)

	doc.build(elements)
	return response

@login_required
def pdf_a_apporter(request):
	""" display the games to bring for one user """
	response = HttpResponse(content_type='application/pdf')
	response['Content-Disposition'] = 'inline; filename="a_apporter.pdf"'

	doc = SimpleDocTemplate(response, rightMargin=20,leftMargin=20, topMargin=20,bottomMargin=20)
	doc.pagesize = landscape(A4)
	elements = []

	doc.build(elements)
	return response


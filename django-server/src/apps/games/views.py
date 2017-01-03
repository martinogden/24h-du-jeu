from django.http import Http404, HttpResponseServerError, HttpResponseBadRequest, JsonResponse, HttpResponse
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from itertools import izip_longest as zip_longest
import requests

from .models import Game, User, Knower, Owner


AC_MIN_LENGTH = 3
BGG_MAX_ITEMS = 15
HTTP_STATUS_CODE_OK = 200
HTTP_STATUS_CODE_BAD_REQUEST = 400
HTTP_STATUS_CODE_SERVER_ERROR = 500


@login_required
def list_games(request, filter_='all'):
	data = {}
	player = get_object_or_404(User, pk=request.user.id)

	if filter_ == 'all':
		games = Game.objects.all()
	elif filter_ == 'iknow':
		games = player.known_games.all()
	elif filter_ == 'iown':
		games = player.owned_games.all()
	else:
		data['errors'] = ['invalid filter %s' % filter_ ]

	if 'errors' in data:
		status = HTTP_STATUS_CODE_BAD_REQUEST
	else:
		data = [game.as_json() for game in games]
		status = HTTP_STATUS_CODE_OK
	return JsonResponse(data, status=status, safe=False)


@login_required
def owners(request, game_id):
	return _owner_knower_helper(game_id, 'owners', Owner, request.user)


@login_required
def knowers(request, game_id):
	return _owner_knower_helper(game_id, 'knowers', Knower, request.user)


def _owner_knower_helper(game_id, attr, model_name, current_user):
	""" Remove or add from the knowers or owners list,
		depending if it's there or not.
		Toggle ownership/knowledge
	"""
	game = get_object_or_404(Game, pk=game_id)

	kwargs = {'fk_game': game, 'fk_player': current_user}
	game_player, created = model_name.objects.get_or_create(**kwargs)
	if not created:
		game_player.delete()

	data = game.as_json()
	return JsonResponse(data)


@login_required
def bgg_games(request):
	q = request.GET.get('q')
	if not q or len(q) < AC_MIN_LENGTH:
		return JsonResponse({})

	url = 'https://boardgamegeek.com/search/boardgame'
	headers = { 'Accept': 'application/json' }
	params = { 'q': q , 'showcount': BGG_MAX_ITEMS }

	response = requests.get(url, params, headers=headers)
	if not response.ok:
		return HttpResponseServerError()

	data = response.json()
	if not 'items' in data:
		raise Http404

	return JsonResponse(data['items'], safe=False)

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
		for owner in game.owners.all():
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
	 
	data = [
	["PLACEMENT", "", "", "ENFANTS", ""],
	]

	styles = getSampleStyleSheet()
	
	# We build the data
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

		data.append([col1, col2, "", col3, col4])

	t=Table(data, colWidths=(None, None, 50, None, None))

	# Styling the titles and the grid
	style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
	                    ('VALIGN',(0,0),(-1,0),'MIDDLE'),
	                    ('ALIGN',(0,0),(-1,0),'CENTER'),
	                    ('BACKGROUND',(0,0),(1,0), colors.lightblue),
	                    ('BACKGROUND',(3,0),(-1,0), colors.lightblue),
	                    ('INNERGRID', (0,0), (1,-1), 0.25, colors.grey),
	                    ('INNERGRID', (3,0), (-1,-1), 0.25, colors.grey),
	                    ('BOX', (0,0), (1,-1), 0.25, colors.grey),
	                    ('BOX', (3,0), (-1,-1), 0.25, colors.grey),
	                    ('SPAN',(0,0),(1,0)),
	                    ('SPAN',(3,0),(-1,0)),
	                    ])
	
	t.setStyle(style)
	

	#Send the data and build the file
	elements.append(t)
	doc.build(elements)
	return response
from django.http import Http404, HttpResponseServerError, HttpResponseBadRequest, JsonResponse, HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
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

	doc = SimpleDocTemplate(response, rightMargin=0,leftMargin=4, topMargin=10,bottomMargin=10)
	doc.pagesize = landscape(A4)
	elements = []
	 
	data = [
	["TITRE", "PROPRIETAIRES", "SAVENT EXPLIQUER", "GENRE"],
	["A", "01", "ABCD", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
	["B", "02", "CDEF", "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"],
	["C", "03", "SDFSDF", "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"],
	["D", "04", "SDFSDF", "DDDDDDDDDDDDDDDDDDDDDDDD DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"],
	["E", "05", "GHJGHJGHJ", "EEEEEEEEEEEEEE EEEEEEEEEEEEEEEEE EEEEEEEEEEEEEEEEEEEE"],
	]

	t=Table(data)

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
# -*- coding: utf-8 -*-
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table, TableStyle, PageBreak
from itertools import izip_longest as zip_longest
from .models import Game


def print_big_list(data):
    # Create the HttpResponse object with the appropriate PDF headers.
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="RECAP.pdf"'

    doc = SimpleDocTemplate(response, rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=20)
    doc.pagesize = landscape(A4)
    elements = []

    t = Table(data, colWidths=(None, None, 300, 60))

    # Styling the titles and the grid
    style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
                        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.grey),
                        ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
                        ])

    t.setStyle(style)

    # we color lines alternatively
    for each in range(len(data)):
        if each % 2 == 0:
            bg_color = colors.white
        else:
            bg_color = colors.lightblue

        t.setStyle(TableStyle([('BACKGROUND', (0, each), (-1, each), bg_color)]))

    # Send the data and build the file
    elements.append(t)
    doc.build(elements)

    return response


@login_required
def pdf_recap(request):
    '''
    Display only the games brought by at least 1 person
    And display only the animajoueurs on the planning
    '''
    # Get data
    games = Game.objects.filter(owner__is_bringing=True).distinct()

    data = [
        ["TITRE", "PROPRIETAIRES", "SAVENT EXPLIQUER", "GENRE"],
    ]

    styles = getSampleStyleSheet()
    
    # We build the data
    for game in games:

        game_owners = ""
        for owner in game.owners.filter(owner__is_bringing=True):
            game_owners = owner.pseudo + " " + game_owners

        game_knowers_set = set([])
        # we don't display people that are not animajoueur this year
        for knower in game.knowers.all():
            if knower.is_animajoueur:
                game_knowers_set.add(knower.pseudo)
        # the owners that are animajoueurs are automatically considered as knower
        for owner in game.owners.all():
            if owner.is_animajoueur:
                game_knowers_set.add(owner.pseudo)
        # we create the string: 
        game_knowers = " ".join(game_knowers_set)

        data.append([Paragraph(game.name, styles['BodyText']), Paragraph(game_owners, styles['BodyText']), Paragraph(game_knowers, styles['BodyText']), game.type_genre])

    response = print_big_list(data)
    return response


@login_required
def pdf_all_games(request):
    '''
    Display all the games in the DB.
    '''
    # Get data
    games = Game.objects.all().order_by('sort_name')
    data = [
        ["TITRE", "PROPRIETAIRES", "SAVENT EXPLIQUER", "GENRE"],
    ]

    styles = getSampleStyleSheet()

    # We build the data
    for game in games:

        game_owners = ""
        for owner in game.owners.all():
            game_owners = owner.pseudo + " " + game_owners

        game_knowers_set = set([])
        # we don't display people that are not animajoueur this year
        for knower in game.knowers.all():
            game_knowers_set.add(knower.pseudo)
        # the owners that are animajoueurs are automatically considered as knower
        for owner in game.owners.all():
            game_knowers_set.add(owner.pseudo)
        # we create the string: 
        game_knowers = " ".join(game_knowers_set)

        data.append([Paragraph(game.name, styles['BodyText']), Paragraph(game_owners, styles['BodyText']), Paragraph(game_knowers, styles['BodyText']), game.type_genre])

    response = print_big_list(data)
    return response


@login_required
def pdf_jeu_genre(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="jeu_genre.pdf"'

    doc = SimpleDocTemplate(response, rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=20)
    doc.pagesize = A4
    elements = []

    # Get data
    games = Game.objects.filter(owner__is_bringing=True).distinct()

    data = [
        ["JEU", "GENRE", "", "JEU", "GENRE"],
    ]

    styles = getSampleStyleSheet()

    # We build the data
    l = len(games)
    if l % 2 == 0:
        sc = l/2
    else:
        sc = l/2+1
    for i in range(sc):
        # in case we have an odd number of elements, we display the last line
        if l % 2 != 0 and i == l/2:
            data.append([Paragraph(games[i].name, styles['BodyText']), games[i].type_genre, "", "", ""])
        elif i < l:
            data.append([Paragraph(games[i].name, styles['BodyText']), games[i].type_genre, "", Paragraph(games[i+sc].name, styles['BodyText']), games[i+sc].type_genre])

    t = Table(data, colWidths=(None, 60, 50, None, 60))

    # Styling the titles and the grid
    style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
                        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                        ('INNERGRID', (0, 0), (1, -1), 0.25, colors.grey),
                        ('INNERGRID', (3, 0), (-1, -1), 0.25, colors.grey),
                        ('BOX', (0, 0), (1, -1), 0.25, colors.grey),
                        ('BOX', (3, 0), (-1, -1), 0.25, colors.grey),
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

    # Send the data and build the file
    elements.append(t)
    doc.build(elements)
    return response


@login_required
def pdf_par_genre(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="par_genre.pdf"'

    doc = SimpleDocTemplate(response, rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=20)
    doc.pagesize = landscape(A4)
    elements = []

    # Get data
    placement_games = Game.objects.filter(type_genre="Placement", owner__is_bringing=True).distinct()
    enfants_games = Game.objects.filter(type_genre="Enfants", owner__is_bringing=True).distinct()
    gestion_games = Game.objects.filter(type_genre="Gestion", owner__is_bringing=True).distinct()
    ambiance_games = Game.objects.filter(type_genre="Ambiance", owner__is_bringing=True).distinct()
    strategie_games = Game.objects.filter(type_genre="Stratégie", owner__is_bringing=True).distinct()
    cooperatif_games = Game.objects.filter(type_genre="Coopératif", owner__is_bringing=True).distinct()
    encheres_games = Game.objects.filter(type_genre="Enchères", owner__is_bringing=True).distinct()
    parcours_games = Game.objects.filter(type_genre="Parcours", owner__is_bringing=True).distinct()
     
    data1 = [
    ["ENFANTS", "", "", "COOPERATIF", ""],
    ]
    data6 = [
    ["PLACEMENT", "", ""]
    ]
    data2 = [
    ["GESTION", "", ""]
    ]
    data3 = [
    ["AMBIANCE", "", ""]
    ]
    data4 = [
    ["STRATEGIE", "", ""]
    ]
    data5 = [
    ["ENCHERES", "", "", "PARCOURS", ""]
    ]

    styles = getSampleStyleSheet()

    # We build the data

    # ENFANTS AND COOPERATIF
    # We display all the combinaison depending which list is shorter than the other
    # and depending if the number of elements in the list is odd or even
    # There are 8 possible combinations.

    le = len(enfants_games)
    if le % 2 == 0:
        sce = le/2
    else:
        sce = le/2+1

    lc = len(cooperatif_games)
    if lc % 2 == 0:
        scc = lc/2
    else:
        scc = lc/2+1

    for i, j in zip_longest(range(sce), range(scc), fillvalue=-1):
        col1 = col2 = col3 = col4 = ""
        if i >= 0:
            col1 = Paragraph(enfants_games[i].name, styles['BodyText'])
        if i >= 0 and i+sce < le:
            col2 = Paragraph(enfants_games[i+sce].name, styles['BodyText'])
        if j >= 0:
            col3 = Paragraph(cooperatif_games[j].name, styles['BodyText'])
        if j >= 0 and j+scc < lc:
            col4 = Paragraph(cooperatif_games[j+scc].name, styles['BodyText'])

        data1.append([col1, col2, "", col3, col4])

    # PLACEMENT

    scpo = (len(placement_games) + 2) / 3
    for i in range(scpo):
        col1 = col2 = col3 = ""
        col1 = Paragraph(placement_games[i].name, styles['BodyText'])
        if i >= 0 and i+scpo < len(placement_games):
            col2 = Paragraph(placement_games[i+scpo].name, styles['BodyText'])
        if i >= 0 and i+2*scpo < len(placement_games):
            col3 = Paragraph(placement_games[i+2*scpo].name, styles['BodyText'])

        data6.append([col1, col2, col3])

    # GESTION

    scg = (len(gestion_games) + 2) / 3
    for i in range(scg):
        col1 = col2 = col3 = ""
        col1 = Paragraph(gestion_games[i].name, styles['BodyText'])
        if i >= 0 and i+scg < len(gestion_games):
            col2 = Paragraph(gestion_games[i+scg].name, styles['BodyText'])
        if i >= 0 and i+2*scg < len(gestion_games):
            col3 = Paragraph(gestion_games[i+2*scg].name, styles['BodyText'])

        data2.append([col1, col2, col3])

    # AMBIANCE

    sca = (len(ambiance_games) + 2) / 3
    for i in range(sca):
        col1 = col2 = col3 = ""
        col1 = Paragraph(ambiance_games[i].name, styles['BodyText'])
        if i >= 0 and i+sca < len(ambiance_games):
            col2 = Paragraph(ambiance_games[i+sca].name, styles['BodyText'])
        if i >= 0 and i+2*sca < len(ambiance_games):
            col3 = Paragraph(ambiance_games[i+2*sca].name, styles['BodyText'])

        data3.append([col1, col2, col3])

    # STRATEGIE

    sct = (len(strategie_games) + 2) / 3
    for i in range(sct):
        col1 = col2 = col3 = ""
        col1 = Paragraph(strategie_games[i].name, styles['BodyText'])
        if i >= 0 and i+sct < len(strategie_games):
            col2 = Paragraph(strategie_games[i+sct].name, styles['BodyText'])
        if i >= 0 and i+2*sct < len(strategie_games):
            col3 = Paragraph(strategie_games[i+2*sct].name, styles['BodyText'])

        data4.append([col1, col2, col3])

    # ENCHERES AND PARCOURS


    lb = len(encheres_games)
    if lb % 2 == 0:
        scb = lb/2
    else:
        scb = lb/2+1

    lp = len(parcours_games)
    if lp % 2 == 0:
        scp = lp/2
    else:
        scp = lp/2+1

    for i, j in zip_longest(range(scb), range(scp), fillvalue=-1):
        col1 = col2 = col3 = col4 = ""
        if i >= 0:
            col1 = Paragraph(encheres_games[i].name, styles['BodyText'])
        if i >= 0 and i+scb < lb:
            col2 = Paragraph(encheres_games[i+scb].name, styles['BodyText'])
        if j >= 0:
            col3 = Paragraph(parcours_games[j].name, styles['BodyText'])
        if j >= 0 and j+scp < lp:
            col4 = Paragraph(parcours_games[j+scp].name, styles['BodyText'])

        data5.append([col1, col2, "", col3, col4])

    t1 = Table(data1, colWidths=(None, None, 50, None, None))
    t6 = Table(data6)
    t2 = Table(data2)
    t3 = Table(data3)
    t4 = Table(data4)
    t5 = Table(data5, colWidths=(None, None, 50, None, None))

    # Styling the titles and the grid
    style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
                        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                        ])
    t1.setStyle(style)
    t6.setStyle(style)
    t2.setStyle(style)
    t3.setStyle(style)
    t4.setStyle(style)
    t5.setStyle(style)

    style1 = TableStyle([('BACKGROUND', (0, 0), (1, 0), colors.lightblue),
                        ('BACKGROUND', (3, 0), (-1, 0), colors.lightblue),
                        ('INNERGRID', (0, 0), (1, -1), 0.25, colors.grey),
                        ('INNERGRID', (3, 0), (-1, -1), 0.25, colors.grey),
                        ('BOX', (0, 0), (1, -1), 0.25, colors.grey),
                        ('BOX', (3, 0), (-1, -1), 0.25, colors.grey),
                        ('SPAN', (0, 0), (1, 0)),
                        ('SPAN', (3, 0), (-1, 0)),
                         ])
    style2 = TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
                        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.grey),
                        ('BOX', (0, 0), (-1, -1), 0.25, colors.grey),
                        ('SPAN', (0, 0), (-1, 0)),
                         ])
    
    t1.setStyle(style1)
    t6.setStyle(style2)
    t2.setStyle(style2)
    t3.setStyle(style2)
    t4.setStyle(style2)
    t5.setStyle(style1)

    # Send the data and build the file
    elements.append(t1)
    elements.append(PageBreak())
    elements.append(t6)
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

    doc = SimpleDocTemplate(response, rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=20)
    doc.pagesize = A4
    elements = []

    games = request.user.owned_games.filter(owner__is_bringing=True)

    data = [
        ["Nombre de jeux à apporter : {}".format(len(games)), "", "", "", "", ""],
        ["", "", "", "", "", ""]
    ]

    styles = getSampleStyleSheet()

    # We build the data
    l = len(games)
    if l % 2 == 0:
        sc = l/2
    else:
        sc = l/2+1
    for i in range(sc):
        # in case we have an odd number of elements, we display the last line
        if l % 2 != 0 and i == l/2:
            data.append([Paragraph(games[i].name, styles['BodyText']), "", "", "", "", ""])
        elif i < l:
            data.append([Paragraph(games[i].name, styles['BodyText']), "", "", Paragraph(games[i + sc].name, styles['BodyText']), "", ""])

    t = Table(data, colWidths=(None, 40, 40, None, 40, 40))

    # Styling the titles and the grid
    style = TableStyle([('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('INNERGRID', (0, 2), (-1, -1), 0.25, colors.grey),
                        ('BOX', (0, 2), (-1, -1), 0.25, colors.grey)
                        ])

    t.setStyle(style)

    # Send the data and build the file
    elements.append(t)

    doc.build(elements)
    return response

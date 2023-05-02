import json
import logging
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.middleware import csrf

logger = logging.getLogger(__name__)

@require_http_methods(['POST'])
def django_login(request):
    data = json.loads(request.body)

    username = data["username"]
    password = data["password"] 
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        
        return JsonResponse(dict(
            csrf_token=csrf.get_token(request),
            user_id=user.id,
            **user.as_json()
	    ))
    else:
        # Return an 'invalid login' error message.
        raise PermissionDenied

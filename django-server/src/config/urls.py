from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

from django.contrib import admin
from jwt_auth.views import obtain_jwt_token

urlpatterns = [
	url(r'^health/', include('health.urls')),
	url(r'^auth/', include('socialauth.urls')),
	# url(r'^auth/api-token/', obtain_jwt_token),
	url(r'^admin/', admin.site.urls),
	url(r'^api/games/', include('games.urls')),
]

if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

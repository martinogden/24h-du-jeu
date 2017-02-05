from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings


class Invite(models.Model):
    key = models.TextField()
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    is_expired = models.BooleanField(blank=False, default=False)

    class Meta:
        db_table = 'invite'
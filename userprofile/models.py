from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to="profile_picture/", blank=True, null=True)

    def __str__(self):
        return self.user.username
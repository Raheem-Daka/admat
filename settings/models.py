import pyotp
from django.db import models
from django.contrib.auth.models import User

class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    session_key = models.CharField(max_length=40)
    device = models.CharField(max_length=255)
    ip_address = models.CharField(max_length=45)
    user_agent = models.TextField()
    last_active = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.device}"

class User2FA(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    secret = models.CharField(max_length=32)
    is_enabled = models.BooleanField(default=False)

    def generate_qr_uri(self):
        return pyotp.totp.TOTP(self.secret).provisioning_uri(
            name=self.user.email,
            issuer_name="AdmatApp"
        )
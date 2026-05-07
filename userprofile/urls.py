from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserProfileView


router = DefaultRouter()
router.register(r'profile', UserProfileView, basename='user_profile')

urlpatterns = [
]
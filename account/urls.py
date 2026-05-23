from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AddressViewSet, CardViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='addresses')
router.register(r'cards', CardViewSet, basename='cards')

urlpatterns = [
    path('', include(router.urls)),

]
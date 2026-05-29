from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AddressViewSet, BillingViewSet, AccountViewSet, ProfileView

router = DefaultRouter()
router.register(r'account', AccountViewSet, basename='account')
router.register(r'addresses', AddressViewSet, basename='addresses')
router.register(r'billing', BillingViewSet, basename='billing')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
]
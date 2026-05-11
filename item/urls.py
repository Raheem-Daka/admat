from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, CategoryViewSet, DiscountViewSet, product_detail_view

router = DefaultRouter()
router.register(r'products', ItemViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'discounts', DiscountViewSet, basename='discount')

urlpatterns = [
    path('', include(router.urls)),
    path('product/<int:pk>/<slug:slug>/', product_detail_view, name='product-detail'),
]
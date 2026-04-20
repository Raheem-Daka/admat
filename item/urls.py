from django.urls import path
from . import views

urlpatterns = [
    path('api/products', views.products, name='products'),
    path('api/categories/', views.categories, name='categories'),
    path('api/product_details/<int:pk>/<slug:slug>/', views.product_details, name='product_details'),
]
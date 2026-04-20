from django.urls import path
from . import views

urlpatterns = [
    path('api/products/<slug:slug>/', views.products, name='products'),
]
# cart/urls.py
from django.urls import path
from .views import CartView, CartItemDeleteView, CartItemUpdateView

urlpatterns = [
    # Cart 
    path("cart/", CartView.as_view(), name="cart"),

    # Individual cart items
    path("cart/items/<int:item_id>/", CartItemUpdateView.as_view(), name="cart-item-update"),
    path("cart/items/<int:item_id>/delete/", CartItemDeleteView.as_view(), name="cart-item-delete"),
]
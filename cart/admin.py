from django.contrib import admin
from .models import Cart, CartItem

# Cart Admin
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username']


# CartItem Admin
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'item', 'quantity']
    search_fields = ['item__name']
    list_filter = ['cart', 'item']
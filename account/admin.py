from django.contrib import admin
from .models import Card, Address

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('user', 'card_name', 'card_number', 'expiry', 'created_at')
    search_fields = ('user', 'card_name', 'card_number', 'expiry', 'created_at')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('user', 'card_name', 'card_number', 'expiry', 'created_at')
        }),
   
    )

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'city', 'phone', 'street', 'created_at')
    search_fields = ('user', 'full_name', 'city', 'phone', 'street', 'created_at')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('user', 'full_name', 'city', 'phone', 'street', 'created_at')
        }),
   
    )
from django.contrib import admin
from .models import Billing, Address, Account, UserProfile

@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ('account', 'card_name', 'is_default', 'last4', 'brand', 'expiry', 'created_at')
    search_fields = ('card_name', 'last4', 'brand', 'expiry')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('account', 'card_name', 'last4', 'brand', 'expiry', 'created_at')
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('account', 'full_name','label', 'is_default', 'city', 'phone', 'street', 'created_at')
    search_fields = ('full_name', 'city', 'phone', 'street')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('account', 'full_name', 'city', 'phone', 'street', 'created_at')
        }),
    )


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('created_at',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    fieldsets = (
        (None, {
            'fields': ('user', 'created_at')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'image')
    search_fields = ('user__username',)
    ordering = ('user',)

    fieldsets = (
        (None, {
            'fields': ('user', 'image'),
        }),
    )
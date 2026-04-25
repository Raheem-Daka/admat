from django.contrib import admin
from .models import Item, Category, Discount

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('item', 'discount_type', 'discount_price', 'start_date', 'end_date', 'active')
    search_fields = ('item__name',)
    list_filter = ('discount_type', 'active', 'start_date', 'end_date')
    ordering = ('-start_date',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('category', 'name','image', 'price', 'slug',  'created_at', 'updated_at')
    search_fields = ('name', 'description', 'price')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('category','name','image', 'description', 'price')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name', 'slug')
    list_filter = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': ('name', 'slug')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
admin.site.site_header = "My Admin"
admin.site.site_title = "My Admin Portal"
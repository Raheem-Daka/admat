from django.contrib import admin
from .models import Track, TrackingEvent

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'item',
        'status',
        'tracking_number',
        'estimated_delivery',
        'created_at',
    )

    search_fields = (
    'tracking_number',
    'user__username',
    'item__name',
    )

    list_filter = (
    'status',
    'created_at',
    )
    
    ordering = ('-created_at',)

@admin.register(TrackingEvent)
class TrackingEvent(admin.ModelAdmin):
    list_display = (
        'id',
        'track',
        'status',
        'description',
        'created_at'
    )

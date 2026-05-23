from rest_framework import serializers
from .models import Track, TrackingEvent

class TrackingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEvent
        fields = [
            "id", 
            "status", 
            "description", 
            "created_at"]

class TrackSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    events = TrackingEventSerializer(many=True, read_only=True)

    def get_item_name(self, obj):
        return obj.item.name if obj.item else "N/A"

    class Meta:
        model = Track
        fields = [
            "id",
            "tracking_number",
            "order_id",
            "item_name",
            "status",
            "status_display",
            "estimated_delivery",
            "events",
        ]

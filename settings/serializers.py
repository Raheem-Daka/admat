from rest_framework import serializers
from .models import UserSession

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = [
            "id", 
            "device", 
            "ip_address", 
            "last_active", 
            "created_at"
        ]
    
    def get_is_current(self, obj):
            request = self.context.get("request")
            return obj.session_key == request.session.session_key

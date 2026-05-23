from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Track, TrackingEvent
from .serializers import TrackingEventSerializer, TrackSerializer

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Track.objects.filter(order__user=self.request.user)

    def perform_create(self, serializer):
        order = serializer.validated_data.get("order")

        if order.user != self.request.user:
            raise PermissionDenied("You cannot use another user's order")

        track = serializer.save()

        self.notify_user(track)

    def notify_user(self, track):
        channel_layer = get_channel_layer()

        serializer = TrackSerializer(track)

        async_to_sync(channel_layer.group_send)(
            f"user_{track.order.user.id}",
            {
                "type": "send_tracking_update",
                "data": serializer.data
            }
        )
    def perform_update(self, serializer):
        track = serializer.save()
        self.notify_user(track)

    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        track = self.get_object()
        serializer = TrackingEventSerializer(track.events.all(), many=True)
        return Response(serializer.data)
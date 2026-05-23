import uuid
from django.db import models
from django.contrib.auth.models import User
from account.models import Card, Address
from item.models import Item
from orders.models import Order
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class Track(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="tracking")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    payment_card = models.ForeignKey(
        Card,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    tracking_number = models.CharField(max_length=100, unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    estimated_delivery = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        
        # Check if new object
        is_new = self.pk is None

        # Generate tracking number
        if not self.tracking_number:
            self.tracking_number = f"TRK-{uuid.uuid4().hex[:10].upper()}"

        super().save(*args, **kwargs)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{self.user.id}",
            {
                "type": "send_tracking_update",
                "data": {
                    "id": self.id,
                    "order_id": self.order.id,
                    "tracking_number": self.tracking_number,
                    "status": self.status,
                    "estimated_delivery": self.estimated_delivery.isoformat() if self.estimated_delivery else None,
                }
            }
        )
        
        # Sync order status
        if self.status != self.status:
            self.order.status = self.status
            self.order.save(update_fields=["status"])

        # Create tracking event ONLY if new or changed
        
        if is_new or not self.events.filter(status=self.status).exists():
            TrackingEvent.objects.create(
                track=self,
                status=self.status,
                description=f"Status updated to {self.get_status_display()}"
            )

        def __str__(self):
            return f"{self.tracking_number} - {self.status}"

class TrackingEvent(models.Model):
    track = models.ForeignKey(Track, related_name="events", on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["track"]),
            models.Index(fields=["status"]),
        ]
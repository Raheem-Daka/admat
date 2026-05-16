from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    item_id = serializers.IntegerField(source="item.id", read_only=True)
    item_image = serializers.ImageField(source="item.image", read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "item_id",
            "item_name",
            "item_image",
            "quantity",
            "price",
            "subtotal",
        )

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "payment_method",
            "subtotal",
            "delivery_fee",
            "total",
            "created_at",
            "items",
        )

class CreateOrderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=30)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    payment_method = serializers.ChoiceField(
        choices=Order.PAYMENT_CHOICES
    )

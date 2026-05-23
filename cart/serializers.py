# cart/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from item.serializers import ItemSerializer

class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=CartItem._meta.get_field('item').related_model.objects.all(),
        source='item',
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "item", "item_id", "quantity"]

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total_items"]

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

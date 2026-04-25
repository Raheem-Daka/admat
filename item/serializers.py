from rest_framework import serializers
from .models import Item, Category, Discount


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'item', 'discount_type', 'discount_price', 'start_date', 'end_date', 'active']

    def __str__(self):
        return f"{self.item.name} - {self.discount_type} {self.discount_price}"


class ItemSerializer(serializers.ModelSerializer):
    imageUrl = serializers.ImageField(source='image', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    discounts = DiscountSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'category', 'name', 'description', 'price',
            'imageUrl', 'slug', 'created_at', 'updated_at',
            'current_price', 'category_name', 'discounts'
        ]

    def __str__(self):
        return f"{self.name}"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'updated_at']

    def __str__(self):
        return f"{self.name}"
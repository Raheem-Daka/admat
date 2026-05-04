from rest_framework import serializers
from .models import Item, Category, Discount, ItemImages


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        ordering = ["-start_date"]
        fields = [
            'id',
            'discount_type',
            'discount_price',
            'start_date',
            'end_date',
            'active',
            'item',
        ]

    def get_discounts(self, obj):
        return DiscountSerializer(
            obj.discounts.filter(active=True),
            many=True
        ).data


class ItemImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImages
        fields = ['id', 'order', 'image']


class ItemSerializer(serializers.ModelSerializer):
    imageUrl = serializers.ImageField(source='image', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    discounts = DiscountSerializer(many=True, read_only=True)
    images = ItemImagesSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = [
            'id',
            'category',
            'name',
            'description',
            'price',
            'imageUrl',
            'images',
            'slug',
            'created_at',
            'updated_at',
            'current_price',
            'category_name',
            'discounts',
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'updated_at']
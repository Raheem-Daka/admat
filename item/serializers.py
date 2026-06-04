from rest_framework import serializers
from .models import Item, Category, Discount, ItemImages, Review


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
    imageUrl = serializers.ImageField(source="image", read_only=True)

    class Meta:
        model = ItemImages
        fields = ['id', 'order', 'imageUrl']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")

        if instance.image and request:
            rep["imageUrl"] = request.build_absolute_uri(rep["imageUrl"])
        return rep


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
            'stock',
            'created_at',
            'updated_at',
            'current_price',
            'category_name',
            'discounts',
        ]
    
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")

        if instance.image and request:
            rep["imageUrl"] = request.build_absolute_uri(rep["imageUrl"])
        return rep

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id',
            'item',
            'user',
            'rating',
            'comment',
            'created_at'
        ]
        read_only_fields = ['item', 'user']

class CategorySerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'imageUrl', 'created_at', 'updated_at']

    def get_imageUrl(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr (obj.image, "url"):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
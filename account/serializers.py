from rest_framework import serializers
from .models import Address, Billing, Account, UserProfile


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'account', 'full_name', 'city', 'phone', 'street', 'created_at']
        read_only_fields = ['account']

class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = ['id', 'account', 'card_name', 'last4', 'brand', 'expiry', 'created_at']
        read_only_fields = ['account', 'last4', 'brand']

class AccountSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'username', 'email', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'image', 'imageUrl']

    def get_imageUrl(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

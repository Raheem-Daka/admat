from rest_framework import serializers
from .models import Address, Billing, Account, UserProfile


class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = [
            'id',
            'account',
            'full_name',
            'is_default',
            'label',
            'city',
            'phone',
            'street',
            'created_at'
        ]
        read_only_fields = ['account']

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone must contain only numbers")

        if len(value) < 10:
            raise serializers.ValidationError("Phone number is too short")

        return value

    def validate_label(self, value):
        if value not in ["home", "work"]:
            raise serializers.ValidationError(
                "Label must be 'home' or 'work'"
            )
        return value

    def validate(self, data):
        if len(data.get("street", "")) < 3:
            raise serializers.ValidationError("Street is too short")

        return data
        
class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = [
            'id',
            'account',
            'card_name',
            'is_default',
            'last4',
            'brand',
            'expiry',
            'created_at'
        ]
        read_only_fields = ['account', 'last4', 'brand']

    def create(self, validated_data):
        number = self.initial_data.get("last4", "")
        if number and len(number) >= 4:
            validated_data["last4"] = number[-4:]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        number = self.initial_data.get("last4", "")
        if number and len(number) >= 4:
            validated_data["last4"] = number[-4:]
        return super().update(instance, validated_data)

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

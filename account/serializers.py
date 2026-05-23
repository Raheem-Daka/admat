from rest_framework import serializers
from .models import Address, Card

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user', 'full_name', 'city', 'phone' 'street', 'created_at']
        read_only_fields = ['user']


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'user', 'card_name', 'card_number', 'expiry', 'created_at']
        read_only_fields = ['user']
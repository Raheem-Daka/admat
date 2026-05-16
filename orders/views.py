from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from item.models import Item

from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer
from cart.models import Cart
from django.db import transaction

from django.conf import settings
from django.db.models import F

# Create your views here.
class OrdersViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        return OrderSerializer


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        try:
            with transaction.atomic():

                cart = Cart.objects.select_for_update().get(user=user)

                cart_items = (
                    cart.items
                    .select_related("item")
                    .select_for_update()
                )

                if not cart_items.exists():
                    return Response(
                        {"error": "Cart is empty"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                order = Order.objects.create(
                    user=user,
                    **serializer.validated_data,
                )

                subtotal = 0

                for ci in cart_items:
                    item = ci.item

                    if ci.quantity > item.stock:
                        return Response(
                            {"error": f"{item.name} is out of stock"},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    price = item.current_price
                    quantity = ci.quantity
                    line_total = price * quantity

                    order.items.create(
                        item=item,
                        quantity=quantity,
                        price=price,
                        subtotal=line_total,
                    )

                    item.stock = F("stock") - quantity
                    item.save(update_fields=["stock"])

                    subtotal += line_total

                order.subtotal = subtotal
                order.delivery_fee = 0 if subtotal > 50000 else 5000
                order.total = subtotal + order.delivery_fee
                order.save()

                cart_items.delete()

            return Response(
                OrderSerializer(order, context={"request": request}).data,
                status=status.HTTP_201_CREATED,
            )

        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
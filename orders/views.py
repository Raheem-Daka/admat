from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user

    try:
        cart = Cart.objects.get(user=user)
        cart_items = cart.items.select_related("item")

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # ✅ Create Order
            order = Order.objects.create(
                user=user,
                full_name=request.data.get("full_name", ""),
                phone=request.data.get("phone", ""),
                address=request.data.get("address", ""),
                city=request.data.get("city", ""),
                payment_method=request.data.get("payment_method", "cod"),
                status="Processing",
                total=0
            )

            total_amount = 0

            # ✅ Create Order Items from Cart
            for cart_item in cart_items:
                price = cart_item.item.current_price
                quantity = cart_item.quantity
                subtotal = price * quantity

                OrderItem.objects.create(
                    order=order,
                    item=cart_item.item,
                    quantity=quantity,
                    price=price,
                    subtotal=subtotal
                )

                total_amount += subtotal

            # ✅ Finalize order total
            delivery_fee = 5000
            order.total = total_amount + delivery_fee
            order.save()

            # ✅ Clear cart
            cart_items.delete()

        return Response(
            {
                "message": "Order placed successfully",
                "order_id": order.id,
                "total": order.total,
                "status": order.status,
            },
            status=status.HTTP_201_CREATED
        )

    except Cart.DoesNotExist:
        return Response(
            {"error": "Cart not found"},
            status=status.HTTP_404_NOT_FOUND
        )
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
#from rest_framework.decorators import permission_classses
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from item.models import Item
from .serializers import CartSerializer


class CartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        item_id = request.data.get("item_id")
        quantity = int(request.data.get("quantity", 1))

        if not item_id or quantity <= 0:
            return Response(
                {"error": "Invalid item or quantity"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(Item, id=item_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            item=item
        )

        cart_item.quantity = (
            cart_item.quantity + quantity if not created else quantity
        )
        cart_item.save()

        return Response(
            {"message": "Item added to cart"},
            status=status.HTTP_201_CREATED
        )


class CartItemDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        cart = get_object_or_404(Cart, user=request.user)

        deleted, _ = CartItem.objects.filter(
            cart=cart,
            item_id=pk
        ).delete()

        if deleted == 0:
            return Response(
                {"error": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"message": "Item removed"})


class CartItemUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        quantity = int(request.data.get("quantity", 1))

        if quantity <= 0:
            return Response(
                {"error": "Invalid quantity"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            item_id=item_id
        )

        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Quantity updated"})
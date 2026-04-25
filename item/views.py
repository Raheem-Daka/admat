from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Item, Category, Discount
from .serializers import ItemSerializer, CategorySerializer, DiscountSerializer


class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'slug'   # use slug instead of pk if you want

    @action(detail=True, methods=['get'], url_path='details/(?P<pk>[^/.]+)')
    def details(self, request, pk=None, slug=None):
        """Custom action to fetch product details by pk + slug"""
        item = get_object_or_404(Item, pk=pk, slug=slug)
        serializer = ItemSerializer(item)
        return Response({
            'message': 'Product details retrieved successfully',
            'item': serializer.data
        })

    @action(detail=False, methods=['get'], url_path='discounts')
    def discount_products(self, request):
        """Custom action to fetch only discounted products"""
        discounted_items = Item.objects.filter(discounts__active=True).distinct()
        serializer = ItemSerializer(discounted_items, many=True)
        return Response({
            'message': 'Get quality products on discount',
            'items': serializer.data
        })


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def items(self, request, slug=None):
        """Fetch all items in a category"""
        category = self.get_object()
        items = category.items.all()
        serializer = ItemSerializer(items, many=True)
        return Response({
            'message': f'Items in category {category.name}',
            'items': serializer.data
        })


class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
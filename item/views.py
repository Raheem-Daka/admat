from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Prefetch
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Item, Category, Discount
from .serializers import ItemSerializer, CategorySerializer, DiscountSerializer


# Product detail (pk + slug)
@api_view(['GET'])
def product_detail_view(request, pk, slug):
    item = get_object_or_404(
        Item.objects
        .select_related("category")
        .prefetch_related("images", "discounts"),
        pk=pk,
        slug=slug
    )

    related_items = (
        Item.objects
        .filter(category=item.category)
        .exclude(pk=item.pk)
        .select_related("category")
        .prefetch_related("images", "discounts")[:5]
    )

    return Response({
        "message": "Product details retrieved successfully",
        "item": ItemSerializer(item).data,
        "related_items": ItemSerializer(related_items, many=True).data,
    })


# Products
class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ItemSerializer
    lookup_field = "slug"

    queryset = (
        Item.objects
        .select_related("category")
        .prefetch_related(
            "images",
            Prefetch("discounts", queryset=Discount.objects.filter(active=True))
        )
    )

    @action(detail=False, methods=['get'], url_path='discounts')
    def discount_products(self, request):
        now = timezone.now()

        items = (
            self.get_queryset()
            .filter(
                discounts__active=True,
                discounts__start_date__lte=now
            )
            .filter(
                Q(discounts__end_date__isnull=True) |
                Q(discounts__end_date__gte=now)
            )
            .distinct()
        )

        return Response({
            "message": "Get quality products on discount",
            "items": ItemSerializer(items, many=True).data,
        })


# Categories
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def items(self, request, slug=None):
        category = self.get_object()

        items = (
            category.items
            .select_related("category")
            .prefetch_related("images", "discounts")
        )

        return Response({
            "message": f"Items in category {category.get_name_display()}",
            "items": ItemSerializer(items, many=True).data,
        })


# Discounts
class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DiscountSerializer

    def get_queryset(self):
        now = timezone.now()
        return Discount.objects.filter(
            active=True,
            start_date__lte=now
        ).filter(
            Q(end_date__isnull=True) |
            Q(end_date__gte=now)
        ).order_by("-start_date")
        
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Prefetch, F
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Item, Category, Discount, Review
from .serializers import ItemSerializer, CategorySerializer, DiscountSerializer, ReviewSerializer
from django.views.decorators.cache import cache_page
from django.db.models import Case, When, IntegerField, Value
from django.utils import timezone


# Rating
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, item_id):
    item = get_object_or_404(Item, id=item_id)

    rating = request.data.get("rating")

    # ✅ validation
    if rating is None:
        return Response({"error": "Rating is required"}, status=400)

    try:
        rating = int(rating)
    except ValueError:
        return Response({"error": "Rating must be a number"}, status=400)

    if not (1 <= rating <= 5):
        return Response({"error": "Rating must be between 1 and 5"}, status=400)

    # ✅ update or create review
    review, created = Review.objects.update_or_create(
        user=request.user,
        item=item,
        defaults={
            "rating": rating,
            "comment": request.data.get("comment", "")
        }
    )

    # ✅ update item rating
    item.update_rating()

    # ✅ serialize
    serializer = ReviewSerializer(review)

    return Response({
        "message": "Review updated" if not created else "Review created",
        "review": serializer.data,
        "created": created
    })


# Product detail (pk + slug)
@api_view(['GET'])
@permission_classes([AllowAny])
def product_detail_view(request, pk, slug):
    item = get_object_or_404(
        Item.objects
        .select_related("category")
        .prefetch_related(
            "images", 
            Prefetch("discounts",
            queryset=Discount.objects.filter(active=True))
            ),
        pk=pk,
        slug=slug
    )

    Item.objects.filter(pk=item.pk).update(
        views=F("views") + 1
    )

    related_items = (
        Item.objects
        .filter(category=item.category)
        .exclude(pk=item.pk)
        .select_related("category")
        .prefetch_related(
            "images",
            Prefetch(
                "discounts", 
                queryset=Discount.objects.filter(
                    active=True
                    )
                )
        ).order_by("-views")[:5]
    )

    return Response({
        "message": "Product details retrieved successfully",
        "item": ItemSerializer(item, context={
            "request": request}).data,
        "related_items": ItemSerializer(
            related_items, 
            many=True, 
            context={
            "request": request
        }).data,
    })

# Products
class ItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    queryset = (
        Item.objects
        .select_related("category")
        .prefetch_related(
            "images",
            Prefetch(
                "discounts", 
                queryset=Discount.objects.filter(
                    active=True,
                    start_date__lte=timezone.now()
                ).filter(
                    Q(end_date__isnull=True) | Q(end_date__gte=timezone.now())
                )
            )
        )
    )

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request

        # Search
        search = request.query_params.get("search")
        if search:
            queryset = queryset.annotate(
                relevance=Case(
                    When(name__icontains=search, then=Value(2)),
                    When(description__icontains=search, then=Value(1)),
                    default=Value(0),
                    output_field=IntegerField(),
                )
            ).filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            ).order_by("-relevance", "-views")

        # Price filters
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Category filter
        category = request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)

        # Discount filter
        has_discount = request.query_params.get("has_discount")
        if has_discount == "true":
            now = timezone.now()
            queryset = queryset.filter(
                discounts__active=True,
                discounts__start_date__lte=now
            ).filter(
                Q(discounts__end_date__isnull=True) |
                Q(discounts__end_date__gte=now)
            )

        # Ordering
        ordering = request.query_params.get("ordering")
        allowed_ordering = [
            "price", "-price",
            "views", "-views",
            "purchase_count", "-purchase_count"
        ]

        if ordering in allowed_ordering:
            if search:
                queryset = queryset.order_by("-relevance", ordering)
            else:
                queryset = queryset.order_by(ordering)
        elif search:
            queryset = queryset.order_by("-relevance", "-views")

        return queryset.distinct().order_by("-created_at")

    @action(detail=False, methods=['get'], url_path='discounts', permission_classes=[AllowAny])
    def discount_products(self, request):
        now = timezone.now()

        items = self.get_queryset()

        return Response({
            "items": ItemSerializer(
                items, 
                many=True, 
                context={"request": request}
                ).data,
        })

    @action(detail=False, methods=['get'], url_path='popular_products', permission_classes=[AllowAny])
    def popular_items(self, request):

        items = (
            self.get_queryset()
            .filter(Q(purchase_count__gt=0) | Q(views__gt=10))
            .annotate(score=F("purchase_count") * 3 + F("views"))
            .order_by("-score")[:8]
        )

        return Response({
            "message": "Popular products",
            "items": ItemSerializer(items, many=True, context={
                "request": request
            }
            ).data
            })

# Categories
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.only("id", "name", "slug").order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    pagination_class = None

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def items(self, request, slug=None):
        category = self.get_object()

        items = (
            Item.objects
            .filter(category=category)
            .select_related("category")
            .prefetch_related(
                "images",
                Prefetch("discounts", queryset=Discount.objects.filter(active=True))
            )
            .order_by("-created_at")
        )
        
        # Pagination
        page = self.paginate_queryset(items)
        if page is not None:
            serializer = ItemSerializer(
                page, 
                many=True, 
                context={"request": request}
            )
            return self.get_paginated_response(serializer.data)


        return Response({
            "category": CategorySerializer(category).data,
            "count": items.count(),
            "items": ItemSerializer(
                items,
                many=True,
                context={"request": request}
            ).data,
        })

# Discounts
class DiscountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DiscountSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        return Discount.objects.filter(
            active=True,
            start_date__lte=now
        ).filter(
            Q(end_date__isnull=True) |
            Q(end_date__gte=now)
        ).order_by("-start_date")
        
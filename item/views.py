from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import ItemSerializer, CategorySerializer
from .models import Item, Category

@api_view(['GET'])
def products(request, slug):

    category = get_object_or_404(Category, slug=slug)
    items = category.items.all()

    item_serializer = ItemSerializer(items, many=True)
    category_serializer = CategorySerializer(categories)

    data = {
        'message': 'welcome to the products API',
        'items': item_serializer.data,
        'categories': category_serializer.data
        }

    return Response(data)
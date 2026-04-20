from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import ItemSerializer, CategorySerializer
from .models import Item, Category

# views.py
@api_view(['GET'])
def products(request):
    items = Item.objects.all()

    item_serializer = ItemSerializer(items, many=True)
    
    data = {
      'message': 'All products',
        'items': item_serializer.data,
    }
    return Response(data)

@api_view(['GET'])
def categories(request):
    categories = Category.objects.all()

    category_serializer = CategorySerializer(categories, many=True)

    data = {
        'message': 'welcome to the products API',
        'categories': category_serializer.data
        }

    return Response(data)


@api_view(['GET'])
def product_details(request, pk, slug):
    item = get_object_or_404(Item, pk=pk, slug=slug)

    item_serializer = ItemSerializer(Item)

    data = {
        'message': 'Product details retrived successfully',
        'item': serializer.data
    }
    return Response(data)
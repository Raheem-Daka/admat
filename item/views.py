from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ItemSerializer, CategorySerializer
from .models import Item, Category

@api_view(['GET'])
def products(request):

    items = Item.objects.all()
    ctegories = Item.objects.all()

    item_serializers = ItemSerializer(items, many=True)
    category_serializers = CategorySerializer(categories, many=True)

    data = {
        'message': 'welcome to the products API',
        items: 'item_serializers',
        categories: 'category_serializers'
        }

    return Response(data)
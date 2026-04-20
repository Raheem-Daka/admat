from rest_framework.decorators import api_view
from item.models import Item, Category
from item.serializers import ItemSerializer, CategorySerializer
from rest_framework.response import Response
 

@api_view(['GET'])
def home(request):
    items = Item.objects.all()[:8]
    categories = Category.objects.all()

    if not items.exists():
        return Response ({"message": "no items available"}, status=404)

    item_serializer = ItemSerializer(items, many=True)
    category_serializer = CategorySerializer(categories, many=True)

    data = {
        'message': 'welcome to the API',
        'items': item_serializer.data,
        'categories':category_serializer.data 
        }
    return Response(data)


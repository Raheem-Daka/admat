from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ItemSerializer, CategorySerializer

@api_view(['GET'])
def products(request):
    data = {'message': 'welcome to the products API'}

    return Response(data)
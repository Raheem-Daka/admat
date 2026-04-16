from rest_framework.decorators import api_view
#from serializers import ItemSerializer
#from item import models
#from rest_framework import api_view
from rest_framework.response import Response
 

@api_view(['GET'])
def home(request):
    data = {'message': 'welcome to the API'}
    return Response(data)
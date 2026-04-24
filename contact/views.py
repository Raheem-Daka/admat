from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def contact(request):
    data = {
        'message': 'Contact us at'
    }
    return Response(data)
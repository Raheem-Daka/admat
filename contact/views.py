from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def contact(request):
    return Response({
        'message': 'Contact us at',
        'email': 'info@company.com'
    })
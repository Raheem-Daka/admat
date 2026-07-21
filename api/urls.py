from django.urls import path
from . import views 
from api.views import frontend

urlpatterns = [

    path('', views.home, name='home'),
]
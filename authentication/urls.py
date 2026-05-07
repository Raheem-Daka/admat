from django.urls import path
from .views import SignUpViewSet, SignInViewSet, SignOutViewSet, AuthCheckViewSet
from rest_framework_simplejwt.views import  TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path(
        "signup/",
        SignUpViewSet.as_view({"post": "signup"}),
        name="signup",
    ),
    path(
        "signin/",
        SignInViewSet.as_view({"post": "signin"}),
        name="signin",
    ),
    path(
        "signout/",
        SignOutViewSet.as_view({"post": "signout"}),
        name="signout",
    ),
    path(
        'auth/check/', 
        AuthCheckViewSet.as_view({"get": "check_auth"}),
        name="check_auth"),    
    path(
        "token/", 
        TokenObtainPairView.as_view(), 
        name="token_obtain_pair"),
    path(
        "token/refresh/", 
    TokenRefreshView.as_view(), 
    name="token_refresh"),

]
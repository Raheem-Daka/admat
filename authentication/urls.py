from django.urls import path
from .views import SignUpViewSet, SignInViewSet, SignOutViewSet, AuthCheckViewSet

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
    path('auth/check/', 
        AuthCheckViewSet.as_view({"get": "check_auth"}),
        name="check_auth"),
]
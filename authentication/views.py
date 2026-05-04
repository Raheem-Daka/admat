from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import SignUpSerializer, SignInSerializer
from rest_framework.decorators import api_view

# ✅ SignUp
class SignUpViewSet(viewsets.ViewSet):
    def signup(self, request):
        serializer = SignUpSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User created successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "password": "********",  # Do not return the actual password
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Failed to create user",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


# ✅ SignIn
class SignInViewSet(viewsets.ViewSet):
    def signin(self, request):
        serializer = SignInSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"message": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            user = authenticate(
                request,
                username=user.username,
                password=password,
            )

            if user:
                login(request, user)
                return Response(
                    {
                        "message": "Signed in successfully",
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"message": "Invalid email or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ SignOut
class SignOutViewSet(viewsets.ViewSet):
    def signout(self, request):
        logout(request)
        return Response(
            {"message": "User signed out successfully"},
            status=status.HTTP_200_OK,
        )

#auth check
class AuthCheckViewSet(viewsets.ViewSet):
    def check_auth(self, request):
        if request.user.is_authenticated:
            return Response(
                {
                    "isAuthenticated": True,
                    "user": {
                        "id": request.user.id,
                        "username": request.user.username,
                        "email": request.user.email,
                    },
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"isAuthenticated": False},
                status=status.HTTP_401_UNAUTHORIZED,
            )
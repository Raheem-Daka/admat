from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import SignUpSerializer, SignInSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from settings.models import UserSession
from django.utils import timezone
from django.contrib.auth import update_session_auth_hash
from settings.models import User2FA
from datetime import timedelta
from django.utils.timezone import now
from django.core.cache import cache
import uuid


def get_client_ip(request):
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0]
    return request.META.get("REMOTE_ADDR")


def get_device(request):
    return request.META.get("HTTP_USER_AGENT", "Unknown device")[:100]


def create_user_session(request, user):
    UserSession.objects.update_or_create(
        user=user,
        session_key=request.session.session_key,
        defaults={
            "device": get_device(request),
            "ip_address": get_client_ip(request),
        }
    )

# ✅ SignUp
class SignUpViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
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
    permission_classes = [AllowAny]

    def signin(self, request):
        serializer = SignInSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"message": "Invalid credentials, please try again."},
                    status=401,
                )

            user = authenticate(
                request,
                username=user.username,
                password=password
            )

            UserSession.objects.filter(
                session_key=request.session.session_key
            ).update(last_active=timezone.now())

            if not user:
                return Response(
                    {"error": "Invalid credentials, please try again."},
                    status=401,
                )

            # ✅ CHECK 2FA BEFORE LOGIN
            twofa = User2FA.objects.filter(user=user, is_enabled=True).first()

            if twofa:
                # ✅ create temporary token
                temp_token = str(uuid.uuid4())

                # ✅ store in cache (expires in 2 minutes)
                cache.set(
                    f"2fa_{temp_token}",
                    user.id,
                    timeout=120
                )

                return Response({
                    "requires_2fa": True,
                    "temp_token": temp_token
                }, status=200)

            # ✅ NORMAL LOGIN (no 2FA)
            login(request, user)
            request.session.save()

            create_user_session(request, user)

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            }, status=200)

        return Response(serializer.errors, status=400)

# ✅ SignOut
class SignOutViewSet(viewsets.ViewSet):
    def signout(self, request):
        # delete session
        if request.session.session_key:
            UserSession.objects.filter(
                session_key=request.session.session_key
            ).delete()

        request.session.flush()
        logout(request)

        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        return Response({"message": "Logged out"})

#auth check
class AuthCheckViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
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
        

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if len(new_password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters"},
                status=400
            )

        if not user.check_password(current_password):
            return Response({"error": "Wrong current password"}, status=400)

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response({"message": "Password updated successfully"})
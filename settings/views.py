import pyotp
import qrcode
import io
import base64
from .models import User2FA
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserSession
from .serializers import SessionSerializer
from django.contrib.sessions.models import Session
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
from authentication.views import create_user_session
from django.core.cache import cache

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    current_key = request.session.session_key
    sessions = UserSession.objects.filter(user=request.user).order_by("-last_active").exclude(session_key=current_key)
    serializer = SessionSerializer(sessions, many=True, context={"request": request})
    
    return Response(serializer.data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_session(request, session_id):
    try:
        session = UserSession.objects.get(id=session_id, user=request.user)

        # delete Django session
        Session.objects.filter(session_key=session.session_key).delete()

        # delete from table
        session.delete()

        return Response({"message": "Session logged out"})
    except UserSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_all_sessions(request):
    current_key = request.session.session_key

    sessions = UserSession.objects.filter(user=request.user).exclude(
        session_key=current_key
    )

    # ✅ safe extraction
    session_keys = list(
        sessions.exclude(session_key__isnull=True)
        .exclude(session_key="")
        .values_list("session_key", flat=True)
    )

    if session_keys:
        Session.objects.filter(session_key__in=session_keys).delete()

    sessions.delete()

    return Response({
        "message": "All sessions logged out"
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def setup_2fa(request):
    user = request.user

    obj, created = User2FA.objects.get_or_create(user=user)

    # ✅ If already enabled → do nothing
    if obj.is_enabled:
        return Response({"message": "2FA already enabled"})

    # ✅ ONLY create secret if it doesn't exist
    if not obj.secret:
        obj.secret = pyotp.random_base32()
        obj.save()

    uri = obj.generate_qr_uri()

    qr = qrcode.make(uri)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")

    qr_base64 = base64.b64encode(buffer.getvalue()).decode()

    return Response({
        "qr_code": f"data:image/png;base64,{qr_base64}"
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_2fa(request):
    otp = request.data.get("otp")

    try:
        obj = User2FA.objects.get(user=request.user)

        if obj.is_enabled:
            return Response({"message": "2FA already enabled"})

        if not obj.secret:
            return Response({"error": "2FA misconfigured"}, status=400)

        totp = pyotp.TOTP(obj.secret)

        if not totp.verify(otp):
            return Response({"error": "Invalid OTP"}, status=400)

        obj.is_enabled = True
        obj.save()

        print("2FA ENABLED:", obj.is_enabled)
        print("SECRET LENGTH:", len(obj.secret) if obj.secret else 0)

        return Response({"message": "2FA enabled ✅"})

    except User2FA.DoesNotExist:
        return Response({"error": "Setup required"}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    try:
        obj = User2FA.objects.get(user=request.user)

        obj.is_enabled = False
        obj.save()

        return Response({"message": "2FA disabled ❌"})
    except User2FA.DoesNotExist:
        return Response({"error": "2FA not enabled"}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_2fa(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email:
        return Response({"error": "Email required"}, status=400)

    if not otp:
        return Response({"error": "OTP required"}, status=400)

    try:
        user = User.objects.get(email=email)

        obj = User2FA.objects.get(user=user)

        if not obj.is_enabled:
            return Response({"error": "2FA not enabled"}, status=400)

        if not obj.secret:
            return Response({"error": "2FA misconfigured"}, status=400)

        totp = pyotp.TOTP(obj.secret)

        if not totp.verify(otp, valid_window=1):
            return Response({"error": "Invalid OTP"}, status=400)

        # ✅ login user
        login(request, user)
        request.session.save()

        create_user_session(request, user)

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful ✅",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }, status=200)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    except User2FA.DoesNotExist:
        return Response({"error": "2FA not setup"}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def twofa_status(request):
    obj = User2FA.objects.filter(user=request.user).first()

    return Response({
        "enabled": obj.is_enabled if obj else False
    })
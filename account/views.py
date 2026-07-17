from rest_framework import viewsets, permissions
from .models import Address, Billing, UserProfile, Account
from .serializers import AddressSerializer, BillingSerializer, UserProfileSerializer, AccountSerializer 
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
import traceback

def get_image_url(request, profile):
    if profile.image:
        try:
            return request.build_absolute_uri(profile.image.url)
        except:
            return None
    return None

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(
            account__user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        account, _ = Account.objects.get_or_create(user=self.request.user)
        serializer.save(account=account)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=["patch"], url_path="set-default")
    def set_default(self, request, pk=None):
        address = self.get_object()

        Address.objects.filter(account=address.account).update(is_default=False)

        address.is_default = True
        address.save()

        return Response({"message": "Default address set"}, status=status.HTTP_200_OK)


class BillingViewSet(viewsets.ModelViewSet):
    serializer_class = BillingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Billing.objects.filter(
            account__user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        account, _ = Account.objects.get_or_create(user=self.request.user)
        serializer.save(account=account)

    def perform_update(self, serializer):
        user = self.request.user
        account, _ = Account.objects.get_or_create(user=user)
        serializer.save(user=user, account=account)
        
    @action(detail=True, methods=["patch"], url_path="set-default")
    def set_default(self, request, pk=None):
        card = self.get_object()

        Billing.objects.filter(account=card.account).update(is_default=False)

        card.is_default = True
        card.save()

        return Response({"message": "Default address set"}, status=status.HTTP_200_OK)

class AccountViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def profile(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        image_url = get_image_url(request, profile)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined,
            "imageUrl": image_url,
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        image_url = get_image_url(request, profile)

        return Response({
            "username": user.username,
            "email": user.email,
            "imageUrl": image_url,
        })


    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        print("FILES:", request.FILES)
        print("DATA:", request.data)

        try:
            username = request.data.get("username")
            email = request.data.get("email")

            # ✅ FIX: check username availability
            if username and username != user.username:
                if User.objects.filter(username=username).exists():
                    return Response(
                        {"error": "Username already taken"},
                        status=400
                    )
                user.username = username

            if email:
                user.email = email

            user.save()

            image = request.FILES.get("image")
            if image:
                profile.image = image
                profile.save()
                print("✅ IMAGE SAVED:", profile.image)

            image_url = get_image_url(request, profile)

            return Response({
                "username": user.username,
                "email": user.email,
                "imageUrl": image_url,
            }, status=200)

        except Exception as e:
            print("❌ PATCH ERROR:", e)
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

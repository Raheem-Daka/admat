from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .models import ContactMessage
from django.core.mail import send_mail
from django.conf import settings


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def contact(request):

    if request.method == 'GET':
        return Response({'email': 'info@company.com'})

    if request.method == 'POST':
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        # ✅ Save to DB
        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message
        )

        # ✅ Send emails (admin + user)
        try:
            # 📧 Email to admin
            send_mail(
                subject=f"New Contact Message from {name}",
                message=f"Name: {name}\nEmail: {email}\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=True,
            )

            # ✅ Auto-reply to user
            send_mail(
                subject="We received your message ✅",
                message=(
                    f"Hi {name},\n\n"
                    "Thank you for contacting us. We have received your message "
                    "and will get back to you shortly.\n\n"
                    "Best regards,\nYour Company"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )

        except Exception as e:
            print("Email error:", e)

        return Response({"success": "Message sent and saved"})

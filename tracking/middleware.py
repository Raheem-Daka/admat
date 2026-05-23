from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        print("🔥 JWT middleware triggered")

        from rest_framework_simplejwt.tokens import AccessToken
        from django.contrib.auth.models import AnonymousUser
        from django.contrib.auth import get_user_model
        User = get_user_model()  

        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)

        token = query_params.get("token")

        if not token:
            print("❌ No token")
            scope["user"] = AnonymousUser()
            return await super().__call__(scope, receive, send)

        try:
            access_token = AccessToken(token[0])

            user_id = int(access_token["user_id"])

            user = await sync_to_async(User.objects.get)(id=user_id)

            scope["user"] = user

            print(f"✅ Authenticated user: {user}")

        except Exception as e:
            print("❌ JWT error:", e)
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
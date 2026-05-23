import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapp.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from tracking.routing import websocket_urlpatterns
from tracking.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from api.views import frontend

urlpatterns = [
    path('', frontend, name='frontend'),

    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/', include('item.urls')),
    path('api/', include('contact.urls')),
    path('api/', include('authentication.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('account.urls')),
    path('api/', include('tracking.urls')),
    path('api/', include('settings.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
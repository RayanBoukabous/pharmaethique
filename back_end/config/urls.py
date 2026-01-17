"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Import de la personnalisation de l'admin
from . import admin as admin_config

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('partenaire.urls')),
    path('api/', include('produit.urls')),
]

# Serve media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


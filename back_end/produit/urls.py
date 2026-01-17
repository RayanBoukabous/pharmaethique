from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProduitViewSet

# Configuration du router REST Framework
router = DefaultRouter()
router.register(r'produits', ProduitViewSet, basename='produit')

urlpatterns = [
    path('', include(router.urls)),
]

# Les URLs générées automatiquement par le router sont :
# - GET    /api/produits/              : Liste tous les produits
# - POST   /api/produits/              : Crée un nouveau produit
# - GET    /api/produits/{id}/         : Détails d'un produit
# - PUT    /api/produits/{id}/         : Met à jour un produit (complet)
# - PATCH  /api/produits/{id}/        : Met à jour un produit (partiel)
# - DELETE /api/produits/{id}/         : Supprime un produit
# - GET    /api/produits/actifs/       : Liste les produits actifs
# - GET    /api/produits/inactifs/    : Liste les produits inactifs



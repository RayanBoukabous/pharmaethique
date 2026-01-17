from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartenaireViewSet, FamilleViewSet, SousFamilleViewSet, ProduitFournisseurViewSet, CatalogueViewSet

# Configuration du router REST Framework
router = DefaultRouter()
router.register(r'partenaires', PartenaireViewSet, basename='partenaire')
router.register(r'familles', FamilleViewSet, basename='famille')
router.register(r'sous-familles', SousFamilleViewSet, basename='sousfamille')
router.register(r'produits-fournisseur', ProduitFournisseurViewSet, basename='produit-fournisseur')
router.register(r'catalogues', CatalogueViewSet, basename='catalogue')

urlpatterns = [
    path('', include(router.urls)),
]

# Les URLs générées automatiquement par le router sont :
# - GET    /api/partenaires/              : Liste tous les partenaires
# - POST   /api/partenaires/              : Crée un nouveau partenaire
# - GET    /api/partenaires/{id}/         : Détails d'un partenaire
# - PUT    /api/partenaires/{id}/         : Met à jour un partenaire (complet)
# - PATCH  /api/partenaires/{id}/        : Met à jour un partenaire (partiel)
# - DELETE /api/partenaires/{id}/         : Supprime un partenaire
# - GET    /api/partenaires/actifs/       : Liste les partenaires actifs
# - GET    /api/partenaires/inactifs/    : Liste les partenaires inactifs


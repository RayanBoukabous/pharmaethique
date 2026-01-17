from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from .models import Produit
from .serializers import ProduitSerializer, ProduitCreateUpdateSerializer
from .filters import ProduitFilter
from partenaire.models import Partenaire


class ProduitViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les produits et équipements.
    
    Actions disponibles:
    - list: Retourne la liste de tous les produits (filtrés par ?actif=true/false)
    - retrieve: Retourne les détails d'un produit
    - create: Crée un nouveau produit
    - update: Met à jour un produit (PUT)
    - partial_update: Met à jour partiellement un produit (PATCH)
    - destroy: Supprime un produit
    - actifs: Retourne uniquement les produits actifs
    
    Filtres disponibles:
    - ?actif=true/false : Filtrer par statut actif
    - ?search=texte : Rechercher dans les titres et descriptions
    - ?ordering=ordre : Trier les résultats
    """
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProduitFilter
    search_fields = ['titre_fr', 'titre_en', 'titre_ar', 'description_fr', 'description_en', 'description_ar']
    ordering_fields = ['ordre', 'titre_fr', 'date_creation', 'date_modification']
    ordering = ['ordre', 'titre_fr']
    
    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action in ['create', 'update', 'partial_update']:
            return ProduitCreateUpdateSerializer
        return ProduitSerializer
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels et prefetch des partenaires"""
        queryset = Produit.objects.prefetch_related(
            Prefetch('partenaires', queryset=Partenaire.objects.filter(actif=True))
        ).all()
        
        # Filtre par statut actif si fourni
        actif = self.request.query_params.get('actif', None)
        if actif is not None:
            actif_bool = actif.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(actif=actif_bool)
        
        return queryset
    
    def perform_create(self, serializer):
        """Action effectuée lors de la création"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Action effectuée lors de la mise à jour"""
        serializer.save()
    
    def perform_destroy(self, instance):
        """Action effectuée lors de la suppression"""
        instance.delete()
    
    @action(detail=False, methods=['get'], url_path='actifs')
    def actifs(self, request):
        """
        Retourne uniquement les produits actifs, triés par ordre.
        GET /api/produits/actifs/
        """
        produits = Produit.objects.filter(actif=True).order_by('ordre', 'titre_fr')
        page = self.paginate_queryset(produits)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProduitSerializer(produits, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='inactifs')
    def inactifs(self, request):
        """
        Retourne uniquement les produits inactifs.
        GET /api/produits/inactifs/
        """
        produits = Produit.objects.filter(actif=False).order_by('ordre', 'titre_fr')
        page = self.paginate_queryset(produits)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProduitSerializer(produits, many=True, context={'request': request})
        return Response(serializer.data)

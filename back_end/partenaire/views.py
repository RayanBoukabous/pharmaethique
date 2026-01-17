from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from .models import Partenaire, Famille, SousFamille, ProduitFournisseur, Catalogue
from .serializers import (
    PartenaireSerializer, 
    PartenaireCreateUpdateSerializer,
    FamilleSerializer,
    SousFamilleSerializer,
    ProduitFournisseurSerializer,
    CatalogueSerializer
)
from .filters import PartenaireFilter


class PartenaireViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les partenaires.
    
    Actions disponibles:
    - list: Retourne la liste de tous les partenaires (filtrés par ?actif=true/false)
    - retrieve: Retourne les détails d'un partenaire
    - create: Crée un nouveau partenaire
    - update: Met à jour un partenaire (PUT)
    - partial_update: Met à jour partiellement un partenaire (PATCH)
    - destroy: Supprime un partenaire
    - actifs: Retourne uniquement les partenaires actifs
    
    Filtres disponibles:
    - ?actif=true/false : Filtrer par statut actif
    - ?search=nom : Rechercher par nom
    """
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer
    permission_classes = [AllowAny]  # Permet l'accès en lecture/écriture pour le moment
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PartenaireFilter
    search_fields = ['nom', 'url_site_web']
    ordering_fields = ['nom', 'date_creation', 'date_modification']
    ordering = ['nom']
    
    def get_serializer_class(self):
        """Retourne le serializer approprié selon l'action"""
        if self.action in ['create', 'update', 'partial_update']:
            return PartenaireCreateUpdateSerializer
        return PartenaireSerializer
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels et prefetch des familles"""
        queryset = Partenaire.objects.prefetch_related(
            Prefetch(
                'familles',
                queryset=Famille.objects.filter(actif=True).prefetch_related(
                    Prefetch(
                        'sous_familles',
                        queryset=SousFamille.objects.filter(actif=True).prefetch_related(
                            Prefetch(
                                'produits_fournisseur',
                                queryset=ProduitFournisseur.objects.filter(actif=True).prefetch_related(
                                    Prefetch(
                                        'catalogues',
                                        queryset=Catalogue.objects.filter(actif=True).order_by('ordre', 'nom')
                                    )
                                ).order_by('ordre', 'nom')
                            )
                        ).order_by('ordre', 'titre_fr')
                    )
                ).order_by('ordre', 'titre_fr')
            )
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
        Retourne uniquement les partenaires actifs.
        GET /api/partenaires/actifs/
        """
        partenaires = Partenaire.objects.filter(actif=True).order_by('nom')
        page = self.paginate_queryset(partenaires)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PartenaireSerializer(partenaires, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='inactifs')
    def inactifs(self, request):
        """
        Retourne uniquement les partenaires inactifs.
        GET /api/partenaires/inactifs/
        """
        partenaires = Partenaire.objects.filter(actif=False).order_by('nom')
        page = self.paginate_queryset(partenaires)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PartenaireSerializer(partenaires, many=True, context={'request': request})
        return Response(serializer.data)


class FamilleViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les familles"""
    queryset = Famille.objects.all()
    serializer_class = FamilleSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titre_fr', 'titre_en', 'titre_ar']
    ordering_fields = ['ordre', 'titre_fr', 'date_creation']
    ordering = ['ordre', 'titre_fr']
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels et prefetch des sous-familles et produits"""
        queryset = Famille.objects.prefetch_related(
            Prefetch(
                'sous_familles',
                queryset=SousFamille.objects.filter(actif=True).prefetch_related(
                    Prefetch(
                        'produits_fournisseur',
                        queryset=ProduitFournisseur.objects.filter(actif=True).prefetch_related(
                            Prefetch(
                                'catalogues',
                                queryset=Catalogue.objects.filter(actif=True).order_by('ordre', 'nom')
                            )
                        ).order_by('ordre', 'nom')
                    )
                ).order_by('ordre', 'titre_fr')
            )
        ).all()
        
        actif = self.request.query_params.get('actif', None)
        if actif is not None:
            actif_bool = actif.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(actif=actif_bool)
        
        return queryset


class SousFamilleViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les sous-familles"""
    queryset = SousFamille.objects.all()
    serializer_class = SousFamilleSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titre_fr', 'titre_en', 'titre_ar']
    ordering_fields = ['ordre', 'titre_fr', 'date_creation']
    ordering = ['ordre', 'titre_fr']
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels et prefetch des produits"""
        queryset = SousFamille.objects.select_related('famille').prefetch_related(
            'famille__partenaires',
            Prefetch(
                'produits_fournisseur',
                queryset=ProduitFournisseur.objects.filter(actif=True).prefetch_related(
                    Prefetch(
                        'catalogues',
                        queryset=Catalogue.objects.filter(actif=True).order_by('ordre', 'nom')
                    )
                ).order_by('ordre', 'nom')
            )
        ).all()
        
        # Filtrer par famille si fourni
        famille_id = self.request.query_params.get('famille', None)
        if famille_id:
            queryset = queryset.filter(famille_id=famille_id)
        
        actif = self.request.query_params.get('actif', None)
        if actif is not None:
            actif_bool = actif.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(actif=actif_bool)
        
        return queryset


class ProduitFournisseurViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les produits fournisseur"""
    queryset = ProduitFournisseur.objects.all()
    serializer_class = ProduitFournisseurSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom']
    ordering_fields = ['ordre', 'nom', 'date_creation']
    ordering = ['ordre', 'nom']
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels et prefetch des catalogues"""
        queryset = ProduitFournisseur.objects.prefetch_related(
            Prefetch(
                'catalogues',
                queryset=Catalogue.objects.filter(actif=True).order_by('ordre', 'nom')
            )
        ).all()
        
        # Filtrer par sous-famille si fourni
        sous_famille_id = self.request.query_params.get('sous_famille', None)
        if sous_famille_id:
            queryset = queryset.filter(sous_famille_id=sous_famille_id)
        
        actif = self.request.query_params.get('actif', None)
        if actif is not None:
            actif_bool = actif.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(actif=actif_bool)
        
        return queryset


class CatalogueViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les catalogues"""
    queryset = Catalogue.objects.all()
    serializer_class = CatalogueSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom']
    ordering_fields = ['ordre', 'nom', 'date_creation']
    ordering = ['ordre', 'nom']
    
    def get_queryset(self):
        """Retourne le queryset avec filtres optionnels"""
        queryset = Catalogue.objects.all()
        
        # Filtrer par produit fournisseur si fourni
        produit_fournisseur_id = self.request.query_params.get('produit_fournisseur', None)
        if produit_fournisseur_id:
            queryset = queryset.filter(produit_fournisseur_id=produit_fournisseur_id)
        
        actif = self.request.query_params.get('actif', None)
        if actif is not None:
            actif_bool = actif.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(actif=actif_bool)
        
        return queryset

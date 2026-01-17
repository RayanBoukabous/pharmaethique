import django_filters
from .models import Produit


class ProduitFilter(django_filters.FilterSet):
    """Filtres personnalisés pour les produits"""
    
    titre_fr = django_filters.CharFilter(lookup_expr='icontains', label='Titre français contient')
    actif = django_filters.BooleanFilter(label='Actif')
    ordre = django_filters.NumberFilter(label='Ordre')
    date_creation = django_filters.DateFromToRangeFilter(label='Date de création')
    
    class Meta:
        model = Produit
        fields = ['titre_fr', 'actif', 'ordre', 'date_creation']



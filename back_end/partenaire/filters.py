import django_filters
from .models import Partenaire


class PartenaireFilter(django_filters.FilterSet):
    """Filtres personnalisés pour les partenaires"""
    
    nom = django_filters.CharFilter(lookup_expr='icontains', label='Nom contient')
    actif = django_filters.BooleanFilter(label='Actif')
    date_creation = django_filters.DateFromToRangeFilter(label='Date de création')
    
    class Meta:
        model = Partenaire
        fields = ['nom', 'actif', 'date_creation']



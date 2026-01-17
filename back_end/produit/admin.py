from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Produit


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'titre_fr', 'ordre', 'actif', 'nombre_partenaires', 'langues_disponibles', 'date_creation')
    list_display_links = ('image_preview', 'titre_fr')
    list_filter = ('actif', 'date_creation', 'partenaires')
    search_fields = ('titre_fr', 'titre_en', 'titre_ar', 'description_fr', 'description_en', 'description_ar')
    readonly_fields = ('date_creation', 'date_modification', 'nombre_partenaires', 'image_preview', 'langues_disponibles')
    filter_horizontal = ('partenaires',)  # Interface plus conviviale pour Many-to-Many
    list_per_page = 25
    list_editable = ('ordre', 'actif')
    
    fieldsets = (
        ('Informations multilingues', {
            'fields': (
                ('titre_fr', 'titre_en', 'titre_ar'),
                ('description_fr',),
                ('description_en',),
                ('description_ar',),
            ),
            'description': 'Remplissez au minimum les champs français. Les autres langues sont optionnelles.'
        }),
        ('Média', {
            'fields': ('image_couverture', 'image_preview'),
            'description': 'Image de couverture du produit. Formats acceptés : JPG, PNG, WEBP'
        }),
        ('Partenaires', {
            'fields': ('partenaires', 'nombre_partenaires'),
            'description': 'Sélectionnez les partenaires associés à ce produit (maintenez Ctrl/Cmd pour sélection multiple)'
        }),
        ('Paramètres d\'affichage', {
            'fields': ('actif', 'ordre'),
            'description': 'L\'ordre détermine l\'affichage (plus petit = affiché en premier)'
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification', 'langues_disponibles'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_produits', 'desactiver_produits', 'incrementer_ordre']
    
    def image_preview(self, obj):
        """Affiche un aperçu de l'image de couverture"""
        if obj.image_couverture:
            return format_html(
                '<img src="{}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" />',
                obj.image_couverture.url
            )
        return format_html('<span style="color: #999; font-size: 12px;">Pas d\'image</span>')
    image_preview.short_description = 'Image'
    
    def nombre_partenaires(self, obj):
        """Affiche le nombre de partenaires associés avec lien"""
        count = obj.partenaires.count()
        if count > 0:
            url = reverse('admin:partenaire_partenaire_changelist') + f'?produits__id__exact={obj.id}'
            return format_html('<a href="{}">{} partenaire(s)</a>', url, count)
        return format_html('<span style="color: #999;">0 partenaire</span>')
    nombre_partenaires.short_description = 'Partenaires'
    
    def langues_disponibles(self, obj):
        """Affiche les langues disponibles pour ce produit"""
        langues = []
        if obj.titre_fr:
            langues.append(format_html('<span style="background: #417690; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">FR</span>'))
        if obj.titre_en:
            langues.append(format_html('<span style="background: #70bf2b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">EN</span>'))
        if obj.titre_ar:
            langues.append(format_html('<span style="background: #ba2121; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">AR</span>'))
        return format_html(' '.join(str(l) for l in langues)) if langues else format_html('<span style="color: #999;">Aucune</span>')
    langues_disponibles.short_description = 'Langues'
    
    @admin.action(description='Activer les produits sélectionnés')
    def activer_produits(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} produit(s) activé(s) avec succès.')
    
    @admin.action(description='Désactiver les produits sélectionnés')
    def desactiver_produits(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} produit(s) désactivé(s) avec succès.')
    
    @admin.action(description='Incrémenter l\'ordre des produits sélectionnés')
    def incrementer_ordre(self, request, queryset):
        count = 0
        for produit in queryset:
            produit.ordre += 1
            produit.save()
            count += 1
        self.message_user(request, f'Ordre incrémenté pour {count} produit(s).')

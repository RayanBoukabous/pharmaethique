from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Partenaire, Famille, SousFamille, ProduitFournisseur, Catalogue


@admin.register(Partenaire)
class PartenaireAdmin(admin.ModelAdmin):
    list_display = ('logo_preview', 'nom', 'site_web_link', 'nombre_produits', 'nombre_familles', 'actif', 'date_creation')
    list_display_links = ('logo_preview', 'nom')
    list_filter = ('actif', 'date_creation')
    search_fields = ('nom', 'url_site_web')
    readonly_fields = ('date_creation', 'date_modification', 'logo_preview', 'nombre_produits', 'nombre_familles')
    list_per_page = 25
    list_editable = ('actif',)
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'url_site_web', 'actif')
        }),
        ('Logo', {
            'fields': ('logo', 'logo_preview'),
            'description': 'Logo du partenaire. Formats acceptés : JPG, PNG, WEBP'
        }),
        ('Familles', {
            'fields': ('nombre_familles',),
            'description': 'Les familles sont associées via l\'interface d\'administration des familles'
        }),
        ('Statistiques', {
            'fields': ('nombre_produits', 'date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_partenaires', 'desactiver_partenaires']
    
    def logo_preview(self, obj):
        """Affiche un aperçu du logo"""
        if obj.logo:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: contain; background: #f0f0f0; padding: 5px; border-radius: 4px;" />',
                obj.logo.url
            )
        return format_html('<span style="color: #999;">Pas de logo</span>')
    logo_preview.short_description = 'Logo'
    
    def site_web_link(self, obj):
        """Affiche le lien vers le site web comme un lien cliquable"""
        if obj.url_site_web:
            return format_html(
                '<a href="{}" target="_blank" style="color: #417690; text-decoration: none;">{}</a>',
                obj.url_site_web,
                obj.url_site_web[:50] + '...' if len(obj.url_site_web) > 50 else obj.url_site_web
            )
        return '-'
    site_web_link.short_description = 'Site web'
    
    def nombre_produits(self, obj):
        """Affiche le nombre de produits associés"""
        count = obj.produits.count()
        if count > 0:
            url = reverse('admin:produit_produit_changelist') + f'?partenaires__id__exact={obj.id}'
            return format_html('<a href="{}">{} produit(s)</a>', url, count)
        return '0 produit'
    nombre_produits.short_description = 'Produits associés'
    
    def nombre_familles(self, obj):
        """Affiche le nombre de familles associées"""
        count = obj.familles.count()
        if count > 0:
            url = reverse('admin:partenaire_famille_changelist') + f'?partenaires__id__exact={obj.id}'
            return format_html('<a href="{}">{} famille(s)</a>', url, count)
        return '0 famille'
    nombre_familles.short_description = 'Familles associées'
    
    @admin.action(description='Activer les partenaires sélectionnés')
    def activer_partenaires(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} partenaire(s) activé(s) avec succès.')
    
    @admin.action(description='Désactiver les partenaires sélectionnés')
    def desactiver_partenaires(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} partenaire(s) désactivé(s) avec succès.')


@admin.register(Famille)
class FamilleAdmin(admin.ModelAdmin):
    list_display = ('titre_fr', 'nombre_sous_familles', 'nombre_partenaires', 'ordre', 'actif', 'langues_disponibles', 'date_creation')
    list_display_links = ('titre_fr',)
    list_filter = ('actif', 'date_creation', 'partenaires')
    search_fields = ('titre_fr', 'titre_en', 'titre_ar')
    readonly_fields = ('date_creation', 'date_modification', 'nombre_sous_familles', 'nombre_partenaires', 'langues_disponibles')
    list_per_page = 25
    list_editable = ('ordre', 'actif')
    filter_horizontal = ('partenaires',)
    
    fieldsets = (
        ('Informations multilingues', {
            'fields': (
                ('titre_fr', 'titre_en', 'titre_ar'),
            ),
            'description': 'Remplissez au minimum le titre français. Les autres langues sont optionnelles.'
        }),
        ('Partenaires', {
            'fields': ('partenaires', 'nombre_partenaires'),
            'description': 'Sélectionnez les partenaires associés à cette famille'
        }),
        ('Paramètres d\'affichage', {
            'fields': ('actif', 'ordre'),
            'description': 'L\'ordre détermine l\'affichage (plus petit = affiché en premier)'
        }),
        ('Statistiques', {
            'fields': ('nombre_sous_familles', 'date_creation', 'date_modification', 'langues_disponibles'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_familles', 'desactiver_familles']
    
    def nombre_sous_familles(self, obj):
        """Affiche le nombre de sous-familles"""
        count = obj.sous_familles.count()
        if count > 0:
            url = reverse('admin:partenaire_sousfamille_changelist') + f'?famille__id__exact={obj.id}'
            return format_html('<a href="{}">{} sous-famille(s)</a>', url, count)
        return '0 sous-famille'
    nombre_sous_familles.short_description = 'Sous-familles'
    
    def nombre_partenaires(self, obj):
        """Affiche le nombre de partenaires associés"""
        count = obj.partenaires.count()
        return f'{count} partenaire(s)' if count > 0 else '0 partenaire'
    nombre_partenaires.short_description = 'Partenaires'
    
    def langues_disponibles(self, obj):
        """Affiche les langues disponibles"""
        langues = []
        if obj.titre_fr:
            langues.append(format_html('<span style="background: #417690; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">FR</span>'))
        if obj.titre_en:
            langues.append(format_html('<span style="background: #70bf2b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">EN</span>'))
        if obj.titre_ar:
            langues.append(format_html('<span style="background: #ba2121; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">AR</span>'))
        return format_html(' '.join(str(l) for l in langues)) if langues else format_html('<span style="color: #999;">Aucune</span>')
    langues_disponibles.short_description = 'Langues'
    
    @admin.action(description='Activer les familles sélectionnées')
    def activer_familles(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} famille(s) activée(s) avec succès.')
    
    @admin.action(description='Désactiver les familles sélectionnées')
    def desactiver_familles(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} famille(s) désactivée(s) avec succès.')


@admin.register(SousFamille)
class SousFamilleAdmin(admin.ModelAdmin):
    list_display = ('titre_fr', 'famille', 'nombre_produits', 'ordre', 'actif', 'langues_disponibles', 'date_creation')
    list_display_links = ('titre_fr',)
    list_filter = ('actif', 'date_creation', 'famille')
    search_fields = ('titre_fr', 'titre_en', 'titre_ar')
    readonly_fields = ('date_creation', 'date_modification', 'langues_disponibles', 'nombre_produits')
    list_per_page = 25
    list_editable = ('ordre', 'actif')
    
    fieldsets = (
        ('Informations multilingues', {
            'fields': (
                ('titre_fr', 'titre_en', 'titre_ar'),
            ),
            'description': 'Remplissez au minimum le titre français. Les autres langues sont optionnelles.'
        }),
        ('Famille parente', {
            'fields': ('famille',),
            'description': 'Sélectionnez la famille à laquelle appartient cette sous-famille'
        }),
        ('Paramètres d\'affichage', {
            'fields': ('actif', 'ordre'),
            'description': 'L\'ordre détermine l\'affichage (plus petit = affiché en premier)'
        }),
        ('Statistiques', {
            'fields': ('nombre_produits', 'date_creation', 'date_modification', 'langues_disponibles'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_sous_familles', 'desactiver_sous_familles']
    
    def nombre_produits(self, obj):
        """Affiche le nombre de produits fournisseur associés"""
        count = obj.produits_fournisseur.count()
        if count > 0:
            url = reverse('admin:partenaire_produitfournisseur_changelist') + f'?sous_famille__id__exact={obj.id}'
            return format_html('<a href="{}">{} produit(s)</a>', url, count)
        return '0 produit'
    nombre_produits.short_description = 'Produits'
    
    def langues_disponibles(self, obj):
        """Affiche les langues disponibles"""
        langues = []
        if obj.titre_fr:
            langues.append(format_html('<span style="background: #417690; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">FR</span>'))
        if obj.titre_en:
            langues.append(format_html('<span style="background: #70bf2b; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">EN</span>'))
        if obj.titre_ar:
            langues.append(format_html('<span style="background: #ba2121; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">AR</span>'))
        return format_html(' '.join(str(l) for l in langues)) if langues else format_html('<span style="color: #999;">Aucune</span>')
    langues_disponibles.short_description = 'Langues'
    
    @admin.action(description='Activer les sous-familles sélectionnées')
    def activer_sous_familles(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} sous-famille(s) activée(s) avec succès.')
    
    @admin.action(description='Désactiver les sous-familles sélectionnées')
    def desactiver_sous_familles(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} sous-famille(s) désactivée(s) avec succès.')


class CatalogueInline(admin.TabularInline):
    """Inline pour gérer les catalogues directement depuis le produit fournisseur"""
    model = Catalogue
    extra = 1
    fields = ('nom', 'fichier_pdf', 'ordre', 'actif')
    verbose_name = "Catalogue"
    verbose_name_plural = "Catalogues"


@admin.register(ProduitFournisseur)
class ProduitFournisseurAdmin(admin.ModelAdmin):
    list_display = ('image_preview', 'nom', 'sous_famille', 'ordre', 'actif', 'date_creation')
    list_display_links = ('image_preview', 'nom')
    list_filter = ('actif', 'date_creation', 'sous_famille')
    search_fields = ('nom',)
    readonly_fields = ('date_creation', 'date_modification', 'image_preview')
    list_per_page = 25
    list_editable = ('ordre', 'actif')
    inlines = [CatalogueInline]
    
    fieldsets = (
        ('Informations du produit', {
            'fields': ('nom', 'sous_famille', 'actif', 'ordre')
        }),
        ('Image', {
            'fields': ('image', 'image_preview'),
            'description': 'Image du produit fournisseur. Formats acceptés : JPG, PNG, WEBP'
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_produits', 'desactiver_produits']
    
    def image_preview(self, obj):
        """Affiche un aperçu de l'image"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" />',
                obj.image.url
            )
        return format_html('<span style="color: #999; font-size: 12px;">Pas d\'image</span>')
    image_preview.short_description = 'Image'
    
    @admin.action(description='Activer les produits sélectionnés')
    def activer_produits(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} produit(s) activé(s) avec succès.')
    
    @admin.action(description='Désactiver les produits sélectionnés')
    def desactiver_produits(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} produit(s) désactivé(s) avec succès.')


@admin.register(Catalogue)
class CatalogueAdmin(admin.ModelAdmin):
    list_display = ('nom_affichage', 'produit_fournisseur', 'sous_famille', 'lien_pdf', 'ordre', 'actif', 'date_creation')
    list_display_links = ('nom_affichage',)
    list_filter = ('actif', 'date_creation', 'produit_fournisseur__sous_famille__famille', 'produit_fournisseur__sous_famille')
    search_fields = ('nom', 'produit_fournisseur__nom')
    readonly_fields = ('date_creation', 'date_modification', 'lien_pdf', 'nom_affichage')
    list_per_page = 25
    list_editable = ('ordre', 'actif')
    
    fieldsets = (
        ('Informations du catalogue', {
            'fields': ('nom', 'nom_affichage', 'produit_fournisseur', 'actif', 'ordre'),
            'description': 'Le nom du catalogue est optionnel. S\'il n\'est pas renseigné, un nom par défaut sera généré.'
        }),
        ('Fichier PDF', {
            'fields': ('fichier_pdf', 'lien_pdf'),
            'description': 'Fichier PDF du catalogue. Format accepté : PDF uniquement (.pdf)'
        }),
        ('Métadonnées', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activer_catalogues', 'desactiver_catalogues']
    
    def nom_affichage(self, obj):
        """Affiche le nom du catalogue ou un nom par défaut"""
        if obj.nom:
            return obj.nom
        return format_html('<span style="color: #999; font-style: italic;">Catalogue {}</span>', obj.id)
    nom_affichage.short_description = 'Nom du catalogue'
    
    def sous_famille(self, obj):
        """Affiche la sous-famille du produit fournisseur"""
        if obj.produit_fournisseur and obj.produit_fournisseur.sous_famille:
            sous_famille = obj.produit_fournisseur.sous_famille
            famille = sous_famille.famille
            url = reverse('admin:partenaire_sousfamille_change', args=[sous_famille.pk])
            return format_html(
                '<a href="{}">{}</a> <span style="color: #999;">→ {}</span>',
                url,
                famille.titre_fr,
                sous_famille.titre_fr
            )
        return format_html('<span style="color: #999;">-</span>')
    sous_famille.short_description = 'Sous-famille'
    
    def lien_pdf(self, obj):
        """Affiche un lien vers le fichier PDF avec taille du fichier"""
        if obj.fichier_pdf:
            try:
                file_size = obj.fichier_pdf.size
                # Convertir en KB ou MB
                if file_size < 1024 * 1024:
                    size_str = f"{file_size / 1024:.1f} KB"
                else:
                    size_str = f"{file_size / (1024 * 1024):.2f} MB"
                
                return format_html(
                    '<a href="{}" target="_blank" style="color: #417690; text-decoration: underline; font-weight: 500;">📄 PDF</a> <span style="color: #999; font-size: 11px;">({})</span>',
                    obj.fichier_pdf.url,
                    size_str
                )
            except:
                return format_html(
                    '<a href="{}" target="_blank" style="color: #417690; text-decoration: underline; font-weight: 500;">📄 PDF</a>',
                    obj.fichier_pdf.url
                )
        return format_html('<span style="color: #999; font-size: 12px;">Pas de fichier</span>')
    lien_pdf.short_description = 'Fichier PDF'
    
    @admin.action(description='Activer les catalogues sélectionnés')
    def activer_catalogues(self, request, queryset):
        updated = queryset.update(actif=True)
        self.message_user(request, f'{updated} catalogue(s) activé(s) avec succès.')
    
    @admin.action(description='Désactiver les catalogues sélectionnés')
    def desactiver_catalogues(self, request, queryset):
        updated = queryset.update(actif=False)
        self.message_user(request, f'{updated} catalogue(s) désactivé(s) avec succès.')

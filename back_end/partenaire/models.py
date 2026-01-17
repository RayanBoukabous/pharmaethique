from django.db import models
from django.core.validators import URLValidator
from django.urls import reverse
from django.core.exceptions import ValidationError


def validate_pdf_file(value):
    """Valide que le fichier est bien un PDF"""
    if not value.name.lower().endswith('.pdf'):
        raise ValidationError('Le fichier doit être un PDF (.pdf)')


class Partenaire(models.Model):
    """Modèle pour représenter un partenaire"""
    nom = models.CharField(
        max_length=200,
        verbose_name="Nom du partenaire",
        help_text="Nom complet du partenaire"
    )
    logo = models.ImageField(
        upload_to='partenaires/logos/',
        verbose_name="Logo",
        help_text="Logo du partenaire",
        null=True,
        blank=True
    )
    url_site_web = models.URLField(
        max_length=500,
        validators=[URLValidator()],
        verbose_name="URL du site web",
        help_text="URL complète du site web du partenaire"
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="Désignez si ce partenaire est actif ou non"
    )

    class Meta:
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"
        ordering = ['nom']
        indexes = [
            models.Index(fields=['nom']),
            models.Index(fields=['actif']),
        ]

    def __str__(self):
        return self.nom
    
    def get_absolute_url(self):
        """Retourne l'URL de l'API pour ce partenaire"""
        return reverse('partenaire-detail', kwargs={'pk': self.pk})
    
    @property
    def est_actif(self):
        """Propriété pour vérifier si le partenaire est actif"""
        return self.actif


class Famille(models.Model):
    """Modèle pour représenter une famille de produits/équipements"""
    
    # Relation avec les partenaires (Many-to-Many)
    partenaires = models.ManyToManyField(
        Partenaire,
        related_name='familles',
        verbose_name="Partenaires",
        help_text="Partenaires associés à cette famille",
        blank=True
    )
    
    # Titres multilingues
    titre_fr = models.CharField(
        max_length=200,
        verbose_name="Titre (Français)",
        help_text="Titre de la famille en français"
    )
    titre_en = models.CharField(
        max_length=200,
        verbose_name="Titre (Anglais)",
        help_text="Titre de la famille en anglais",
        blank=True
    )
    titre_ar = models.CharField(
        max_length=200,
        verbose_name="Titre (Arabe)",
        help_text="Titre de la famille en arabe",
        blank=True
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="Désignez si cette famille est active ou non"
    )
    
    # Ordre d'affichage
    ordre = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = affiché en premier)"
    )

    class Meta:
        verbose_name = "Famille"
        verbose_name_plural = "Familles"
        ordering = ['ordre', 'titre_fr']
        indexes = [
            models.Index(fields=['ordre', 'actif']),
            models.Index(fields=['titre_fr']),
        ]

    def __str__(self):
        return self.titre_fr
    
    def get_absolute_url(self):
        """Retourne l'URL de l'API pour cette famille"""
        return reverse('famille-detail', kwargs={'pk': self.pk})


class SousFamille(models.Model):
    """Modèle pour représenter une sous-famille"""
    
    # Relation avec la famille parente (Many-to-One)
    famille = models.ForeignKey(
        Famille,
        on_delete=models.CASCADE,
        related_name='sous_familles',
        verbose_name="Famille",
        help_text="Famille parente de cette sous-famille"
    )
    
    # Titres multilingues
    titre_fr = models.CharField(
        max_length=200,
        verbose_name="Titre (Français)",
        help_text="Titre de la sous-famille en français"
    )
    titre_en = models.CharField(
        max_length=200,
        verbose_name="Titre (Anglais)",
        help_text="Titre de la sous-famille en anglais",
        blank=True
    )
    titre_ar = models.CharField(
        max_length=200,
        verbose_name="Titre (Arabe)",
        help_text="Titre de la sous-famille en arabe",
        blank=True
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="Désignez si cette sous-famille est active ou non"
    )
    
    # Ordre d'affichage
    ordre = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = affiché en premier)"
    )

    class Meta:
        verbose_name = "Sous-famille"
        verbose_name_plural = "Sous-familles"
        ordering = ['ordre', 'titre_fr']
        indexes = [
            models.Index(fields=['famille', 'ordre', 'actif']),
            models.Index(fields=['titre_fr']),
        ]

    def __str__(self):
        return f"{self.famille.titre_fr} > {self.titre_fr}"


class ProduitFournisseur(models.Model):
    """Modèle pour représenter un produit fournisseur associé à une sous-famille"""
    
    # Relation avec la sous-famille parente (Many-to-One)
    sous_famille = models.ForeignKey(
        SousFamille,
        on_delete=models.CASCADE,
        related_name='produits_fournisseur',
        verbose_name="Sous-famille",
        help_text="Sous-famille parente de ce produit"
    )
    
    # Nom du produit
    nom = models.CharField(
        max_length=200,
        verbose_name="Nom du produit",
        help_text="Nom du produit fournisseur"
    )
    
    # Image du produit
    image = models.ImageField(
        upload_to='produits_fournisseur/images/',
        verbose_name="Image",
        help_text="Image du produit fournisseur",
        null=True,
        blank=True
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="Désignez si ce produit est actif ou non"
    )
    
    # Ordre d'affichage
    ordre = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = affiché en premier)"
    )

    class Meta:
        verbose_name = "Produit Fournisseur"
        verbose_name_plural = "Produits Fournisseurs"
        ordering = ['ordre', 'nom']
        indexes = [
            models.Index(fields=['sous_famille', 'ordre', 'actif']),
            models.Index(fields=['nom']),
        ]

    def __str__(self):
        return self.nom


class Catalogue(models.Model):
    """Modèle pour représenter un catalogue PDF associé à un produit fournisseur"""
    
    # Relation avec le produit fournisseur parent (Many-to-One)
    produit_fournisseur = models.ForeignKey(
        ProduitFournisseur,
        on_delete=models.CASCADE,
        related_name='catalogues',
        verbose_name="Produit Fournisseur",
        help_text="Produit fournisseur parent de ce catalogue"
    )
    
    # Nom/titre du catalogue (optionnel)
    nom = models.CharField(
        max_length=200,
        verbose_name="Nom du catalogue",
        help_text="Nom ou titre du catalogue (optionnel)",
        blank=True,
        null=True
    )
    
    # Fichier PDF du catalogue
    fichier_pdf = models.FileField(
        upload_to='catalogues/pdf/',
        verbose_name="Fichier PDF",
        help_text="Fichier PDF du catalogue",
        validators=[validate_pdf_file]
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="Désignez si ce catalogue est actif ou non"
    )
    
    # Ordre d'affichage
    ordre = models.IntegerField(
        default=0,
        verbose_name="Ordre d'affichage",
        help_text="Ordre d'affichage (plus petit = affiché en premier)"
    )

    class Meta:
        verbose_name = "Catalogue"
        verbose_name_plural = "Catalogues"
        ordering = ['ordre', 'nom', 'date_creation']
        indexes = [
            models.Index(fields=['produit_fournisseur', 'ordre', 'actif']),
            models.Index(fields=['nom']),
        ]

    def __str__(self):
        return self.nom if self.nom else f"Catalogue {self.id}"

from django.db import models
from django.urls import reverse


class Produit(models.Model):
    """Modèle pour représenter un produit ou équipement"""
    
    # Titres multilingues
    titre_fr = models.CharField(
        max_length=200,
        verbose_name="Titre (Français)",
        help_text="Titre du produit en français"
    )
    titre_en = models.CharField(
        max_length=200,
        verbose_name="Titre (Anglais)",
        help_text="Titre du produit en anglais",
        blank=True
    )
    titre_ar = models.CharField(
        max_length=200,
        verbose_name="Titre (Arabe)",
        help_text="Titre du produit en arabe",
        blank=True
    )
    
    # Image de couverture
    image_couverture = models.ImageField(
        upload_to='produits/couvertures/',
        verbose_name="Image de couverture",
        help_text="Image principale du produit",
        null=True,
        blank=True
    )
    
    # Descriptions multilingues
    description_fr = models.TextField(
        verbose_name="Description (Français)",
        help_text="Description détaillée du produit en français"
    )
    description_en = models.TextField(
        verbose_name="Description (Anglais)",
        help_text="Description détaillée du produit en anglais",
        blank=True
    )
    description_ar = models.TextField(
        verbose_name="Description (Arabe)",
        help_text="Description détaillée du produit en arabe",
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
    
    # Relation avec les partenaires (Many-to-Many)
    partenaires = models.ManyToManyField(
        'partenaire.Partenaire',
        related_name='produits',
        verbose_name="Partenaires",
        help_text="Partenaires associés à ce produit",
        blank=True
    )

    class Meta:
        verbose_name = "Produit / Équipement"
        verbose_name_plural = "Produits / Équipements"
        ordering = ['ordre', 'titre_fr']
        indexes = [
            models.Index(fields=['ordre', 'actif']),
            models.Index(fields=['titre_fr']),
        ]

    def __str__(self):
        return self.titre_fr
    
    def get_absolute_url(self):
        """Retourne l'URL de l'API pour ce produit"""
        return reverse('produit-detail', kwargs={'pk': self.pk})
    
    @property
    def est_actif(self):
        """Propriété pour vérifier si le produit est actif"""
        return self.actif

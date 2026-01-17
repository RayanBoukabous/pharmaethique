from rest_framework import serializers
from .models import Partenaire, Famille, SousFamille, ProduitFournisseur, Catalogue


class CatalogueSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Catalogue avec URL complète du fichier PDF"""
    fichier_pdf_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Catalogue
        fields = [
            'id',
            'nom',
            'fichier_pdf',
            'fichier_pdf_url',
            'actif',
            'ordre',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification', 'fichier_pdf_url']
    
    def get_fichier_pdf_url(self, obj):
        """Retourne l'URL complète du fichier PDF"""
        if obj.fichier_pdf:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.fichier_pdf.url)
            return obj.fichier_pdf.url
        return None


class ProduitFournisseurSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle ProduitFournisseur avec URL complète de l'image et catalogues"""
    image_url = serializers.SerializerMethodField()
    catalogues = CatalogueSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProduitFournisseur
        fields = [
            'id',
            'nom',
            'image',
            'image_url',
            'catalogues',
            'actif',
            'ordre',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification', 'image_url']
    
    def get_image_url(self, obj):
        """Retourne l'URL complète de l'image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class SousFamilleSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle SousFamille avec ses produits fournisseur"""
    produits_fournisseur = ProduitFournisseurSerializer(many=True, read_only=True)
    famille_id = serializers.IntegerField(source='famille.id', read_only=True)
    partenaire_id = serializers.SerializerMethodField()
    
    class Meta:
        model = SousFamille
        fields = [
            'id',
            'famille_id',
            'partenaire_id',
            'titre_fr',
            'titre_en',
            'titre_ar',
            'produits_fournisseur',
            'actif',
            'ordre',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification', 'famille_id', 'partenaire_id']
    
    def get_partenaire_id(self, obj):
        """Retourne l'ID du premier partenaire associé à la famille de cette sous-famille"""
        if obj.famille and obj.famille.partenaires.exists():
            return obj.famille.partenaires.first().id
        return None


class FamilleSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Famille avec ses sous-familles"""
    sous_familles = SousFamilleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Famille
        fields = [
            'id',
            'titre_fr',
            'titre_en',
            'titre_ar',
            'sous_familles',
            'actif',
            'ordre',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']


class PartenaireSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Partenaire avec URL complète du logo et familles"""
    logo_url = serializers.SerializerMethodField()
    familles = FamilleSerializer(many=True, read_only=True)
    nom = serializers.CharField(max_length=200, required=True)
    url_site_web = serializers.URLField(max_length=500, required=True)

    class Meta:
        model = Partenaire
        fields = ['id', 'nom', 'logo', 'logo_url', 'url_site_web', 'familles', 'actif', 'date_creation', 'date_modification']
        read_only_fields = ['id', 'date_creation', 'date_modification', 'logo_url', 'familles']

    def get_logo_url(self, obj):
        """Retourne l'URL complète du logo"""
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class PartenaireCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la création et la mise à jour d'un partenaire"""
    nom = serializers.CharField(
        max_length=200,
        required=True,
        help_text="Nom du partenaire"
    )
    url_site_web = serializers.URLField(
        max_length=500,
        required=True,
        help_text="URL du site web du partenaire"
    )
    logo = serializers.ImageField(
        required=False,
        allow_null=True,
        help_text="Logo du partenaire"
    )
    actif = serializers.BooleanField(
        default=True,
        required=False,
        help_text="Statut actif/inactif du partenaire"
    )
    familles_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Famille.objects.all(),
        source='familles',
        write_only=True,
        required=False,
        help_text="IDs des familles associées"
    )
    
    class Meta:
        model = Partenaire
        fields = ['nom', 'logo', 'url_site_web', 'familles_ids', 'actif']
    
    def validate_nom(self, value):
        """Validation du nom"""
        if not value or not value.strip():
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return value.strip()
    
    def validate_url_site_web(self, value):
        """Validation de l'URL"""
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("L'URL doit commencer par http:// ou https://")
        return value


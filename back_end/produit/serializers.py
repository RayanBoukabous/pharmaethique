from rest_framework import serializers
from .models import Produit
from partenaire.serializers import PartenaireSerializer
from partenaire.models import Partenaire


class ProduitSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Produit avec URL complète de l'image"""
    image_couverture_url = serializers.SerializerMethodField()
    partenaires = PartenaireSerializer(many=True, read_only=True)
    partenaires_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Partenaire.objects.all(),
        source='partenaires',
        write_only=True,
        required=False,
        help_text="IDs des partenaires associés"
    )

    class Meta:
        model = Produit
        fields = [
            'id',
            'titre_fr',
            'titre_en',
            'titre_ar',
            'image_couverture',
            'image_couverture_url',
            'description_fr',
            'description_en',
            'description_ar',
            'partenaires',
            'partenaires_ids',
            'actif',
            'ordre',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification', 'image_couverture_url', 'partenaires']

    def get_image_couverture_url(self, obj):
        """Retourne l'URL complète de l'image de couverture"""
        if obj.image_couverture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_couverture.url)
            return obj.image_couverture.url
        return None


class ProduitCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la création et la mise à jour d'un produit"""
    
    titre_fr = serializers.CharField(
        max_length=200,
        required=True,
        help_text="Titre du produit en français"
    )
    titre_en = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        help_text="Titre du produit en anglais"
    )
    titre_ar = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True,
        help_text="Titre du produit en arabe"
    )
    description_fr = serializers.CharField(
        required=True,
        help_text="Description du produit en français"
    )
    description_en = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Description du produit en anglais"
    )
    description_ar = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Description du produit en arabe"
    )
    image_couverture = serializers.ImageField(
        required=False,
        allow_null=True,
        help_text="Image de couverture du produit"
    )
    actif = serializers.BooleanField(
        default=True,
        required=False,
        help_text="Statut actif/inactif du produit"
    )
    ordre = serializers.IntegerField(
        default=0,
        required=False,
        help_text="Ordre d'affichage"
    )
    partenaires_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Partenaire.objects.all(),
        source='partenaires',
        write_only=True,
        required=False,
        help_text="IDs des partenaires associés"
    )
    
    class Meta:
        model = Produit
        fields = [
            'titre_fr',
            'titre_en',
            'titre_ar',
            'image_couverture',
            'description_fr',
            'description_en',
            'description_ar',
            'partenaires_ids',
            'actif',
            'ordre',
        ]
    
    def validate_titre_fr(self, value):
        """Validation du titre français"""
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre français ne peut pas être vide.")
        return value.strip()
    
    def validate_description_fr(self, value):
        """Validation de la description française"""
        if not value or not value.strip():
            raise serializers.ValidationError("La description française ne peut pas être vide.")
        return value.strip()


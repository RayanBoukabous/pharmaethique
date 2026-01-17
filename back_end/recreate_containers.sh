#!/bin/bash

# Script pour recréer les containers avec la nouvelle configuration PostgreSQL
# Usage: ./recreate_containers.sh

set -e

echo "🛑 Arrêt des containers existants..."
docker-compose down

echo "🗑️  Suppression des anciens containers (sans supprimer les volumes pour garder les données)..."
docker-compose rm -f

echo "🔨 Construction des images..."
docker-compose build

echo "🚀 Démarrage des containers avec la nouvelle configuration..."
docker-compose up -d

echo "⏳ Attente que la base de données soit prête..."
sleep 5

echo "🔄 Application des migrations..."
docker-compose exec -T web python manage.py migrate --noinput

echo "📦 Collecte des fichiers statiques..."
docker-compose exec -T web python manage.py collectstatic --noinput || true

echo ""
echo "✅ Containers recréés avec succès!"
echo ""
echo "📊 Vérification des containers:"
docker-compose ps

echo ""
echo "📦 Vérification du volume PostgreSQL:"
docker volume ls | grep pharma_ethique_postgres_data || echo "⚠️  Le volume sera créé au premier démarrage de la base de données"

echo ""
echo "💡 Commandes utiles:"
echo "   - Voir les logs: docker-compose logs -f"
echo "   - Créer un superutilisateur: docker-compose exec web python manage.py createsuperuser"
echo "   - Créer un backup: ./backup_db.sh"

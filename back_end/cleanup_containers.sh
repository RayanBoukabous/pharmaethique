#!/bin/bash

# Script pour nettoyer les conteneurs Docker orphelins
# Ce script supprime les anciens conteneurs qui ne sont plus utilisés

echo "🧹 Nettoyage des conteneurs Docker orphelins..."
echo ""

# Se placer dans le répertoire du script
cd "$(dirname "$0")"

# Arrêter et supprimer les conteneurs docker-compose actuels (projet back_end)
echo "📦 Arrêt des conteneurs docker-compose du projet actuel..."
docker-compose down 2>/dev/null || true

# Nettoyer les conteneurs du projet "backend" (ancien projet)
echo ""
echo "🗑️  Nettoyage des conteneurs du projet 'backend'..."
BACKEND_CONTAINERS=$(docker ps -a --format "{{.Names}}" 2>/dev/null | grep "^backend-" || true)
if [ -n "$BACKEND_CONTAINERS" ]; then
    echo "$BACKEND_CONTAINERS" | while read -r container; do
        echo "   Suppression: $container"
        docker rm -f "$container" 2>/dev/null || true
    done
    echo "   ✅ Conteneurs 'backend-*' supprimés"
else
    echo "   ℹ️  Aucun conteneur 'backend-*' trouvé"
fi

# Nettoyer les conteneurs du projet "x12" ou "xdocker" (ancien projet)
echo ""
echo "🗑️  Nettoyage des conteneurs du projet 'x12/xdocker'..."
X12_CONTAINERS=$(docker ps -a --format "{{.Names}}" 2>/dev/null | grep "^x12-" || true)
if [ -n "$X12_CONTAINERS" ]; then
    echo "$X12_CONTAINERS" | while read -r container; do
        echo "   Suppression: $container"
        docker rm -f "$container" 2>/dev/null || true
    done
    echo "   ✅ Conteneurs 'x12-*' supprimés"
else
    echo "   ℹ️  Aucun conteneur 'x12-*' trouvé"
fi

# Vérifier et supprimer les conteneurs avec les noms exacts (si ils existent)
ORPHANED_CONTAINERS=("back_end" "backend" "xdocker")
echo ""
echo "🗑️  Vérification des conteneurs avec noms exacts..."
for container in "${ORPHANED_CONTAINERS[@]}"; do
    if docker ps -a --format "{{.Names}}" 2>/dev/null | grep -q "^${container}$"; then
        echo "   Suppression du conteneur: $container"
        docker rm -f "$container" 2>/dev/null || true
    fi
done

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📋 Conteneurs restants:"
docker ps -a --format "  - {{.Names}} ({{.Status}})" 2>/dev/null || true
echo ""
echo "Pour redémarrer les conteneurs avec la configuration actuelle:"
echo "  docker-compose up -d"
echo "  ou"
echo "  make up"
echo ""

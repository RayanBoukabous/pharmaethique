#!/bin/bash

# Script de restauration de la base de données PostgreSQL
# Usage: ./restore_db.sh <fichier_backup.sql.gz>

set -e

# Vérifier qu'un fichier de backup est fourni
if [ -z "$1" ]; then
    echo "❌ Erreur: Veuillez spécifier un fichier de backup"
    echo "💡 Usage: ./restore_db.sh <fichier_backup.sql.gz>"
    echo "📁 Backups disponibles:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || echo "   Aucun backup trouvé"
    exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="pharma_ethique_postgres"
DB_NAME="pharma_ethique_db"
DB_USER="postgres"

# Vérifier que le fichier existe
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ Erreur: Le fichier ${BACKUP_FILE} n'existe pas"
    exit 1
fi

# Vérifier que le container est en cours d'exécution
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo "❌ Erreur: Le container PostgreSQL n'est pas en cours d'exécution"
    echo "💡 Lancez d'abord: docker-compose up -d"
    exit 1
fi

echo "⚠️  ATTENTION: Cette opération va écraser toutes les données actuelles!"
read -p "Êtes-vous sûr de vouloir continuer? (oui/non): " confirm

if [ "${confirm}" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

echo "🔄 Restauration de la base de données depuis ${BACKUP_FILE}..."

# Décompresser et restaurer
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"
else
    docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}" < "${BACKUP_FILE}"
fi

echo "✅ Base de données restaurée avec succès!"

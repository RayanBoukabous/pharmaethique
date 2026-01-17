#!/bin/bash

# Script de backup de la base de données PostgreSQL
# Usage: ./backup_db.sh

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/pharma_ethique_backup_${TIMESTAMP}.sql"
CONTAINER_NAME="pharma_ethique_postgres"
DB_NAME="pharma_ethique_db"
DB_USER="postgres"

# Créer le dossier de backup s'il n'existe pas
mkdir -p "${BACKUP_DIR}"

echo "🔄 Création du backup de la base de données..."
echo "📁 Fichier: ${BACKUP_FILE}"

# Vérifier que le container est en cours d'exécution
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo "❌ Erreur: Le container PostgreSQL n'est pas en cours d'exécution"
    echo "💡 Lancez d'abord: docker-compose up -d"
    exit 1
fi

# Créer le backup
docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" > "${BACKUP_FILE}"

# Compresser le backup
gzip "${BACKUP_FILE}"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

echo "✅ Backup créé avec succès: ${BACKUP_FILE_GZ}"
echo "📊 Taille: $(du -h "${BACKUP_FILE_GZ}" | cut -f1)"

# Garder seulement les 10 derniers backups
echo "🧹 Nettoyage des anciens backups (conservation des 10 derniers)..."
cd "${BACKUP_DIR}"
ls -t pharma_ethique_backup_*.sql.gz | tail -n +11 | xargs -r rm
cd ..

echo "✨ Terminé!"

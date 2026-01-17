# Guide de Persistance des Données PostgreSQL

Ce guide explique comment la base de données PostgreSQL est configurée pour conserver les données de manière permanente.

## 📦 Configuration Docker

La base de données PostgreSQL est configurée dans `docker-compose.yml` avec :

- **Volume nommé persistant** : `pharma_ethique_postgres_data`
- **Restart automatique** : Le container redémarre automatiquement en cas d'arrêt
- **Health checks** : Vérification de l'état de la base de données

## 🔒 Persistance des Données

### Comment ça fonctionne

Les données sont stockées dans un **volume Docker nommé** qui persiste même si :
- Vous arrêtez les containers (`docker-compose down`)
- Vous supprimez les containers
- Vous redémarrez votre machine

⚠️ **IMPORTANT** : Les données sont perdues uniquement si vous :
- Supprimez explicitement le volume : `docker volume rm pharma_ethique_postgres_data`
- Utilisez `docker-compose down -v` (supprime les volumes)

### Vérifier que les données sont persistées

```bash
# Lister les volumes
make volumes

# Inspecter le volume pour voir où sont stockées les données
make volumes-inspect
```

## 🚀 Commandes Utiles

### Démarrer les services

```bash
# Démarrer les containers
make up

# Voir les logs
make logs
```

### Gestion de la base de données

```bash
# Appliquer les migrations
make migrate

# Créer un superutilisateur
make createsuperuser

# Ouvrir un shell PostgreSQL
make db-shell
```

### Backups

```bash
# Créer un backup de la base de données
make backup

# Restaurer un backup
make restore BACKUP=backups/pharma_ethique_backup_20240101_120000.sql.gz
```

Les backups sont automatiquement compressés et stockés dans le dossier `backups/`. Seuls les 10 derniers backups sont conservés.

## 🔧 Dépannage

### Les données sont perdues après un redémarrage

1. Vérifiez que le volume existe :
   ```bash
   docker volume ls | grep pharma_ethique_postgres_data
   ```

2. Vérifiez que le container utilise bien le volume :
   ```bash
   docker inspect pharma_ethique_postgres | grep -A 10 Mounts
   ```

3. Vérifiez les logs :
   ```bash
   make db-logs
   ```

### Recréer la base de données (⚠️ PERDREZ LES DONNÉES)

Si vous devez vraiment repartir de zéro :

```bash
# Arrêter les containers et supprimer les volumes
docker-compose down -v

# Redémarrer
make up
make migrate
make createsuperuser
```

### Restaurer depuis un backup

```bash
# Lister les backups disponibles
ls -lh backups/

# Restaurer un backup
make restore BACKUP=backups/pharma_ethique_backup_YYYYMMDD_HHMMSS.sql.gz
```

## 📊 Emplacement des Données

Les données PostgreSQL sont stockées dans un volume Docker géré par Docker. Pour voir l'emplacement exact :

```bash
docker volume inspect pharma_ethique_postgres_data
```

Sur macOS/Windows, les volumes Docker sont généralement stockés dans la VM Docker.

## 🔐 Sécurité

⚠️ **En production**, changez les mots de passe par défaut dans `docker-compose.yml` :

```yaml
environment:
  POSTGRES_PASSWORD: votre_mot_de_passe_securise
```

Et mettez à jour les variables d'environnement dans `.env` en conséquence.

## 📝 Notes

- Les fichiers media (logos, images) sont stockés dans le dossier `media/` du projet
- Les fichiers statiques sont dans un volume séparé
- Les backups sont stockés dans `backups/` (non versionné dans git)

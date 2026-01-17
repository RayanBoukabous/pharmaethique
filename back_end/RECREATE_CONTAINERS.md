# Guide pour Recréer les Containers

Ce guide vous explique comment recréer les containers avec la nouvelle configuration PostgreSQL persistante.

## 🚀 Méthode Rapide

Exécutez simplement le script :

```bash
cd back_end
./recreate_containers.sh
```

Ou avec Make :

```bash
cd back_end
make recreate
```

## 📝 Méthode Manuelle

Si vous préférez exécuter les commandes manuellement :

```bash
cd back_end

# 1. Arrêter les containers existants
docker-compose down

# 2. Supprimer les containers (sans supprimer les volumes pour garder les données)
docker-compose rm -f

# 3. Construire les images
docker-compose build

# 4. Démarrer les containers
docker-compose up -d

# 5. Attendre que la base de données soit prête (quelques secondes)
sleep 5

# 6. Appliquer les migrations
docker-compose exec web python manage.py migrate --noinput

# 7. Collecter les fichiers statiques
docker-compose exec web python manage.py collectstatic --noinput
```

## ✅ Vérification

Après la recréation, vérifiez que tout fonctionne :

```bash
# Voir l'état des containers
docker-compose ps

# Voir les logs
docker-compose logs -f

# Vérifier que le volume PostgreSQL existe
docker volume ls | grep pharma_ethique_postgres_data
```

## 🔒 Important

⚠️ **Les données sont conservées** car nous ne supprimons pas les volumes. Si vous voulez vraiment repartir de zéro (et perdre toutes les données), utilisez :

```bash
docker-compose down -v  # ⚠️ Supprime aussi les volumes
docker-compose up -d
```

## 🆘 En cas de problème

Si vous rencontrez des erreurs :

1. Vérifiez que Docker est démarré
2. Vérifiez les logs : `docker-compose logs`
3. Vérifiez l'état des containers : `docker-compose ps`
4. Vérifiez que le port 5432 n'est pas déjà utilisé : `lsof -i :5432`

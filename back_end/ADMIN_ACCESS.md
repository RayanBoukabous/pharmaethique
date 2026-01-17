# Accès à Django Admin

## 🔐 Informations de Connexion

**URL d'accès :** http://localhost:8001/admin/

**Identifiants par défaut :**
- **Username :** `admin`
- **Password :** `admin`

## 🚀 Créer le Superutilisateur

### Méthode 1 : Script automatique (recommandé)

```bash
cd back_end
./create_superuser.sh
```

Ou avec Make :

```bash
cd back_end
make createsuperuser
```

### Méthode 2 : Commande interactive

```bash
docker-compose exec web python manage.py createsuperuser
```

Cette méthode vous demandera de saisir les informations interactivement.

### Méthode 3 : Commande non-interactive

```bash
docker-compose exec web python manage.py shell
```

Puis dans le shell Python :

```python
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@pharmaethique.com', 'admin')
```

## 📋 Vérification

Après avoir créé le superutilisateur, vous pouvez vous connecter à :

**http://localhost:8001/admin/**

## 🔒 Sécurité

⚠️ **Important pour la production :**

1. Changez le mot de passe par défaut après la première connexion
2. Utilisez un mot de passe fort
3. Ne partagez jamais les identifiants d'administration

Pour changer le mot de passe :

```bash
docker-compose exec web python manage.py changepassword admin
```

## 🆘 Problèmes courants

### Le container n'est pas démarré

```bash
docker-compose up -d
```

### Erreur "User already exists"

Le script met automatiquement à jour le mot de passe si l'utilisateur existe déjà.

### Impossible de se connecter

1. Vérifiez que le container web est en cours d'exécution : `docker-compose ps`
2. Vérifiez les logs : `docker-compose logs web`
3. Vérifiez que le port 8001 n'est pas déjà utilisé

# Backend Pharma Ethique - Django REST API

Backend professionnel Django avec Django REST Framework pour l'application Pharma Ethique.

## Structure du projet

- `config/` : Configuration principale du projet Django
- `partenaire/` : Application pour gérer les partenaires

## Modèle Partenaire

Le modèle Partenaire contient :
- `nom` : Nom du partenaire
- `logo` : Image du logo (stockée dans `media/partenaires/logos/`)
- `url_site_web` : URL du site web du partenaire
- `actif` : Statut actif/inactif
- `date_creation` : Date de création (automatique)
- `date_modification` : Date de modification (automatique)

## Installation et démarrage avec Docker

### Méthode rapide avec Makefile

```bash
# Construire et démarrer les conteneurs
make build
make up

# Créer les migrations
make makemigrations
make migrate

# Créer un superutilisateur
make createsuperuser

# Voir les logs
make logs

# Arrêter les conteneurs
make down
```

### Méthode manuelle

#### 1. Créer le fichier .env

Copiez le fichier `.env.example` vers `.env` et modifiez les valeurs si nécessaire :

```bash
cp .env.example .env
```

#### 2. Lancer les conteneurs

```bash
docker-compose up --build
```

#### 3. Créer les migrations et appliquer

Dans un autre terminal :

```bash
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
```

#### 4. Créer un superutilisateur (optionnel)

```bash
docker-compose exec web python manage.py createsuperuser
```

## API Endpoints

### Partenaires

- `GET /api/partenaires/` : Liste tous les partenaires
- `GET /api/partenaires/?actif=true` : Liste uniquement les partenaires actifs
- `GET /api/partenaires/{id}/` : Détails d'un partenaire
- `POST /api/partenaires/` : Créer un nouveau partenaire
- `PUT /api/partenaires/{id}/` : Mettre à jour un partenaire
- `PATCH /api/partenaires/{id}/` : Mettre à jour partiellement un partenaire
- `DELETE /api/partenaires/{id}/` : Supprimer un partenaire
- `GET /api/partenaires/actifs/` : Liste uniquement les partenaires actifs

## Exemple de requête POST pour créer un partenaire

```bash
curl -X POST http://localhost:8001/api/partenaires/ \
  -H "Content-Type: multipart/form-data" \
  -F "nom=Euroimmun" \
  -F "logo=@/path/to/logo.png" \
  -F "url_site_web=https://www.euroimmun.com" \
  -F "actif=true"
```

## Accès à l'admin Django

L'interface d'administration Django est disponible à :
http://localhost:8001/admin/

**Note:** Le backend utilise le port **8001** pour éviter les conflits avec d'autres services.

## Développement local (sans Docker)

Si vous préférez développer sans Docker :

1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Configurer la base de données PostgreSQL et mettre à jour le fichier `.env`

4. Appliquer les migrations :
```bash
python manage.py migrate
```

5. Lancer le serveur de développement :
```bash
python manage.py runserver
```

## Port utilisé

Le backend utilise le port **8001** (au lieu de 8000) pour éviter les conflits avec d'autres services Docker. Si vous souhaitez changer le port, modifiez la ligne `ports` dans `docker-compose.yml`.


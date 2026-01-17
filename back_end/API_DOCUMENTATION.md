# Documentation API - Partenaires

## Base URL
```
http://localhost:8001/api/
```

## Endpoints disponibles

### 1. Liste des partenaires
**GET** `/api/partenaires/`

Retourne la liste paginée de tous les partenaires.

**Paramètres de requête :**
- `actif` (bool) : Filtrer par statut actif (true/false)
- `search` (string) : Rechercher dans le nom et l'URL
- `ordering` (string) : Trier les résultats (nom, date_creation, date_modification)
- `page` (int) : Numéro de page (pagination)

**Exemple :**
```bash
GET /api/partenaires/?actif=true&search=euro&ordering=nom
```

**Réponse :**
```json
{
    "count": 10,
    "next": "http://localhost:8001/api/partenaires/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "nom": "Euroimmun",
            "logo": "/media/partenaires/logos/euroimmun.png",
            "logo_url": "http://localhost:8001/media/partenaires/logos/euroimmun.png",
            "url_site_web": "https://www.euroimmun.com",
            "actif": true,
            "date_creation": "2024-01-15T10:00:00Z",
            "date_modification": "2024-01-15T10:00:00Z"
        }
    ]
}
```

---

### 2. Détails d'un partenaire
**GET** `/api/partenaires/{id}/`

Retourne les détails d'un partenaire spécifique.

**Exemple :**
```bash
GET /api/partenaires/1/
```

**Réponse :**
```json
{
    "id": 1,
    "nom": "Euroimmun",
    "logo": "/media/partenaires/logos/euroimmun.png",
    "logo_url": "http://localhost:8001/media/partenaires/logos/euroimmun.png",
    "url_site_web": "https://www.euroimmun.com",
    "actif": true,
    "date_creation": "2024-01-15T10:00:00Z",
    "date_modification": "2024-01-15T10:00:00Z"
}
```

---

### 3. Créer un partenaire
**POST** `/api/partenaires/`

Crée un nouveau partenaire.

**Body (multipart/form-data) :**
```
nom: Euroimmun
logo: [fichier image]
url_site_web: https://www.euroimmun.com
actif: true
```

**Exemple avec curl :**
```bash
curl -X POST http://localhost:8001/api/partenaires/ \
  -F "nom=Euroimmun" \
  -F "logo=@/path/to/logo.png" \
  -F "url_site_web=https://www.euroimmun.com" \
  -F "actif=true"
```

**Réponse (201 Created) :**
```json
{
    "id": 1,
    "nom": "Euroimmun",
    "logo": "/media/partenaires/logos/euroimmun.png",
    "logo_url": "http://localhost:8001/media/partenaires/logos/euroimmun.png",
    "url_site_web": "https://www.euroimmun.com",
    "actif": true,
    "date_creation": "2024-01-15T10:00:00Z",
    "date_modification": "2024-01-15T10:00:00Z"
}
```

---

### 4. Mettre à jour un partenaire (complet)
**PUT** `/api/partenaires/{id}/`

Met à jour tous les champs d'un partenaire.

**Body (multipart/form-data) :**
```
nom: Euroimmun Updated
logo: [nouveau fichier image]
url_site_web: https://www.euroimmun.com/new
actif: false
```

---

### 5. Mettre à jour un partenaire (partiel)
**PATCH** `/api/partenaires/{id}/`

Met à jour uniquement les champs fournis.

**Body (JSON ou multipart/form-data) :**
```json
{
    "actif": false
}
```

---

### 6. Supprimer un partenaire
**DELETE** `/api/partenaires/{id}/`

Supprime un partenaire.

**Réponse :** 204 No Content

---

### 7. Partenaires actifs
**GET** `/api/partenaires/actifs/`

Retourne uniquement les partenaires actifs.

**Exemple :**
```bash
GET /api/partenaires/actifs/
```

---

### 8. Partenaires inactifs
**GET** `/api/partenaires/inactifs/`

Retourne uniquement les partenaires inactifs.

**Exemple :**
```bash
GET /api/partenaires/inactifs/
```

---

## Filtres disponibles

### Filtre par statut actif
```
GET /api/partenaires/?actif=true
GET /api/partenaires/?actif=false
```

### Recherche
```
GET /api/partenaires/?search=euro
```
Recherche dans les champs : `nom`, `url_site_web`

### Tri
```
GET /api/partenaires/?ordering=nom
GET /api/partenaires/?ordering=-date_creation
GET /api/partenaires/?ordering=nom,-date_modification
```
Champs disponibles : `nom`, `date_creation`, `date_modification`
- Préfixer avec `-` pour un tri décroissant

### Combinaison de filtres
```
GET /api/partenaires/?actif=true&search=euro&ordering=nom
```

---

## Pagination

Par défaut, 20 résultats par page.

**Paramètres :**
- `page` : Numéro de page

**Exemple :**
```
GET /api/partenaires/?page=2
```

**Réponse inclut :**
- `count` : Nombre total de résultats
- `next` : URL de la page suivante (null si dernière page)
- `previous` : URL de la page précédente (null si première page)
- `results` : Liste des résultats

---

## Codes de statut HTTP

- `200 OK` : Requête réussie
- `201 Created` : Ressource créée avec succès
- `204 No Content` : Suppression réussie
- `400 Bad Request` : Données invalides
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

---

## Validation

### Nom
- Requis
- Maximum 200 caractères
- Ne peut pas être vide

### URL du site web
- Requis
- Maximum 500 caractères
- Doit commencer par `http://` ou `https://`
- Doit être une URL valide

### Logo
- Optionnel
- Doit être un fichier image valide
- Stocké dans `/media/partenaires/logos/`

### Actif
- Optionnel (défaut : `true`)
- Booléen

---

## CORS

L'API est configurée pour accepter les requêtes depuis :
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Les headers CORS sont automatiquement ajoutés aux réponses.

---

## Exemples d'utilisation

### JavaScript (Fetch API)
```javascript
// Récupérer tous les partenaires actifs
fetch('http://localhost:8001/api/partenaires/?actif=true')
  .then(response => response.json())
  .then(data => console.log(data));

// Créer un partenaire
const formData = new FormData();
formData.append('nom', 'Euroimmun');
formData.append('url_site_web', 'https://www.euroimmun.com');
formData.append('actif', 'true');
formData.append('logo', fileInput.files[0]);

fetch('http://localhost:8001/api/partenaires/', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### Python (requests)
```python
import requests

# Récupérer les partenaires actifs
response = requests.get('http://localhost:8001/api/partenaires/?actif=true')
data = response.json()
print(data)

# Créer un partenaire
files = {'logo': open('logo.png', 'rb')}
data = {
    'nom': 'Euroimmun',
    'url_site_web': 'https://www.euroimmun.com',
    'actif': True
}
response = requests.post('http://localhost:8001/api/partenaires/', files=files, data=data)
print(response.json())
```

---

## Structure des données

### Partenaire
```json
{
    "id": 1,
    "nom": "string (max 200)",
    "logo": "string (chemin relatif)",
    "logo_url": "string (URL complète)",
    "url_site_web": "string (URL, max 500)",
    "actif": "boolean",
    "date_creation": "datetime (ISO 8601)",
    "date_modification": "datetime (ISO 8601)"
}
```

---

## Notes importantes

1. **Logo URL** : Le champ `logo_url` est automatiquement généré et contient l'URL complète du logo, utile pour l'affichage dans le frontend.

2. **Pagination** : Toutes les listes sont paginées par défaut (20 résultats par page).

3. **Filtres** : Les filtres peuvent être combinés pour des requêtes complexes.

4. **Validation** : Les données sont validées côté serveur avant la sauvegarde.

5. **Permissions** : Actuellement, l'API est ouverte en lecture/écriture. Pour la production, configurez les permissions appropriées dans `partenaire/permissions.py`.



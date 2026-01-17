# Configuration API Backend

## Variables d'environnement

Pour configurer l'URL du backend, créez un fichier `.env.local` à la racine du projet `front_end/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

**Note :** Si cette variable n'est pas définie, l'application utilisera par défaut `http://localhost:8001/api`.

## Utilisation

Le service API est disponible dans `lib/api.ts` et fournit les fonctions suivantes :

- `getPartenairesActifs()` : Récupère uniquement les partenaires actifs
- `getAllPartenaires()` : Récupère tous les partenaires (actifs et inactifs)
- `getPartenaireById(id)` : Récupère un partenaire spécifique par son ID

## Configuration des images

Les images provenant du backend sont automatiquement autorisées via la configuration dans `next.config.js`. Les images depuis `http://localhost:8001/media/**` sont acceptées.

## Dépannage

Si les partenaires ne s'affichent pas :

1. Vérifiez que le backend est démarré sur `http://localhost:8001`
2. Vérifiez que l'endpoint `/api/partenaires/actifs/` est accessible
3. Vérifiez la console du navigateur pour les erreurs CORS ou de réseau
4. Assurez-vous que les variables d'environnement sont correctement configurées



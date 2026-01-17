# Pharma Ethique - Site Web

Site web professionnel pour Pharma Ethique, entreprise spécialisée en diagnostic de laboratoire.

## Technologies

- **Next.js 14** avec App Router
- **Turbopack** pour un développement ultra-rapide
- **TypeScript** pour la sécurité de type
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations fluides
- **Lucide React** pour les icônes

## Installation

```bash
npm install
```

## Développement

Lancer le serveur de développement avec Turbopack :

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Build

Pour créer une version de production :

```bash
npm run build
npm start
```

## Structure du Projet

```
front_end/
├── app/                    # Pages et routes Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── a-propos/          # Page À Propos
│   ├── produits/          # Page Produits
│   ├── partenaires/       # Page Partenaires
│   └── contact/           # Page Contact
├── components/            # Composants réutilisables
│   ├── Header.tsx         # En-tête avec navigation
│   ├── Hero.tsx           # Section hero
│   ├── Features.tsx       # Section fonctionnalités
│   └── Footer.tsx         # Pied de page
└── public/                # Fichiers statiques
```

## Palette de Couleurs

- **Primary Dark**: `#004744`
- **Primary**: `#018276`
- **Primary Light**: `#00AAA3`

## Configuration des Variables d'Environnement

Pour le déploiement sur Vercel, configurez les variables d'environnement suivantes dans les paramètres de Vercel :

### Variable requise pour la production

- **`BACKEND_URL`** : URL du backend Django (sans `/api` à la fin)
  - Exemple : `http://105.96.71.28:9001`
  - ⚠️ **Important** : Cette variable est utilisée côté serveur uniquement (pas de préfixe `NEXT_PUBLIC_`)
  - En production, l'application utilise un proxy Next.js (`/api/proxy/*`) pour éviter les problèmes de mixed content (HTTPS → HTTP)
  - En développement, l'application se connecte directement au backend

### Comment configurer sur Vercel

1. Allez dans les paramètres de votre projet Vercel
2. Section "Environment Variables"
3. Ajoutez `BACKEND_URL` avec la valeur `http://105.96.71.28:9001`
4. Sélectionnez tous les environnements (Production, Preview, Development)
5. Redéployez votre application

## Fonctionnalités

- ✅ Design responsive et moderne
- ✅ Animations fluides avec Framer Motion
- ✅ Navigation intuitive
- ✅ Pages complètes (Accueil, À Propos, Produits, Partenaires, Contact)
- ✅ Optimisé pour les performances
- ✅ Proxy API pour éviter les problèmes de mixed content en production




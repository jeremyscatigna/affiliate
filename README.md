# BCJ Affiliate Platform

Plateforme d'affiliation simple et efficace pour gérer les partenaires et les commissions.

## Configuration

### 1. Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez l'URL de connexion dans Settings > Database

### 2. Variables d'environnement

Créez un fichier `.env.local` et ajoutez vos clés Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 3. Configuration Admin

Dans `src/app/admin/page.tsx`, remplacez l'email admin :

```typescript
const ADMIN_EMAIL = 'votre-email@exemple.com'
```

### 4. WhatsApp

Dans `src/app/ref/[code]/page.tsx`, remplacez le numéro WhatsApp :

```typescript
const whatsappNumber = 'VOTRE_NUMERO' // Format: 33612345678
```

## Installation

```bash
# Installer les dépendances
npm install

# Créer les tables dans Supabase
npm run db:push

# Ou générer les fichiers de migration
npm run db:generate
npm run db:migrate

# Lancer l'application
npm run dev
```

### Commandes Drizzle

- `npm run db:push` - Pushe le schéma directement vers Supabase (dev)
- `npm run db:generate` - Génère les fichiers de migration
- `npm run db:migrate` - Exécute les migrations
- `npm run db:studio` - Interface visuelle pour explorer la DB

## Utilisation

### Pour les affiliés

1. **Inscription** : `/signup`
2. **Connexion** : `/login`  
3. **Dashboard** : `/dashboard`
   - Lien d'affiliation unique
   - Suivi des prospects
   - Historique des commissions

### Pour l'admin

1. **Interface admin** : `/admin`
   - Validation des affiliés
   - Gestion des prospects
   - Création de factures
   - Suivi des commissions

### Flow de conversion

1. L'affilié partage son lien : `votresite.com/ref/[CODE]`
2. Le prospect remplit le formulaire
3. Redirection automatique vers WhatsApp
4. L'admin peut suivre et convertir les prospects

## Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── admin/
│   ├── dashboard/
│   └── ref/[code]/
├── components/
│   ├── auth/
│   ├── admin/
│   └── dashboard/
└── lib/
    └── supabase/
```

## Commissions

- **Taux** : 20% sur chaque facture
- **Calcul** : Automatique à la création de facture
- **Paiement** : Manuel via l'interface admin

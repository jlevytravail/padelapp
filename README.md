# Padel App

Une application mobile React Native / Expo pour les joueurs de padel.

## Fonctionnalités

- **Matchs** : Affichage des matchs programmés, en cours et terminés
- **Dashboard** : Statistiques personnelles et aperçu des performances
- **Classement Global** : Classement des joueurs avec points et statistiques

## Navigation

L'application utilise une navigation par onglets avec 3 écrans principaux :
- Matchs
- Dashboard  
- Classement Global

## Structure du projet

```
src/
├── screens/           # Écrans principaux
│   ├── MatchsScreen.tsx
│   ├── DashboardScreen.tsx
│   └── ClassementScreen.tsx
├── types/             # Types TypeScript
│   └── index.ts
├── data/              # Données mockées
│   └── mockData.ts
└── components/        # Composants réutilisables (à venir)
```

## Données mockées

L'application utilise des données simulées pour :
- Liste des joueurs avec classements
- Historique des matchs
- Statistiques personnelles

## Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm start

# Ou pour des plateformes spécifiques
npm run ios
npm run android
npm run web
```

## Technologies utilisées

- React Native avec Expo
- TypeScript
- React Navigation (Bottom Tabs)
- Données mockées (pas d'authentification)
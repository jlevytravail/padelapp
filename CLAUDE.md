# 🎾 MVP Padel App - Context & Guidelines

## 1. 🎯 Contexte du projet

Tu développes une application mobile en React Native / Expo pour les joueurs de padel.

**Objectif** : un MVP lean.

### Fonctionnalités principales du MVP :

- **Ajouter des matchs** (saisie des scores set par set, partenaires, adversaires, position).
- **Calcul automatique d'un classement Elo global** (borné entre 1.00 et 10.00).
- **Un dashboard joueur** (stats personnelles, historique, progression Elo).
- **Un classement global** (leaderboard basé sur Elo).
- **Pas de login/auth** pour la version mock.
- **Données fictives/mockées**.

## 2. 🖼️ Guidelines UX/UI

- **Interface minimaliste mais agréable** (cartes, listes simples, boutons visibles).
- **Navigation fluide, intuitive** → tab bar recommandée : Matchs – Dashboard – Classement global.
- **Mise en avant de la progression Elo** (valeur + évolution).
- **Pensé pour des joueurs amateurs** : clair, lisible, pas surchargé.

## 3. ⚙️ Contraintes techniques

- **React Native + Expo** (dernières versions).
- **Code clair et modulaire** (un composant par écran).
- **Utiliser des données mock** (JSON local ou générées).
- **Elo mocké mais basé sur un vrai système de calcul simplifié**.
- **Valeurs Elo toujours entre 1.00 et 10.00** (deux décimales).

## 4. 🚀 Organisation du travail (par lots)

Les tâches doivent être découpées en prompts séparés pour faciliter le développement :

1. ✅ **Arborescence & navigation** - TERMINÉ
2. ⏳ **Écran Ajout de match classique** - À FAIRE
3. ⏳ **Logique mock du système Elo** - À FAIRE  
4. ⏳ **Écran Dashboard joueur** - À FAIRE
5. ⏳ **Données fictives + Classement global** - À FAIRE

## 📁 Structure actuelle

```
src/
├── screens/           # Écrans principaux
│   ├── MatchsScreen.tsx      ✅ Liste des matchs
│   ├── DashboardScreen.tsx   ✅ Stats joueur  
│   └── ClassementScreen.tsx  ✅ Classement global
├── types/             # Types TypeScript
│   └── index.ts       ✅ Interfaces principales
├── data/              # Données mockées
│   └── mockData.ts    ✅ Données de base
└── components/        # Composants réutilisables (à venir)
```

## 🔄 État d'avancement

- [x] Navigation par onglets fonctionnelle
- [x] Écrans de base créés avec données mock
- [x] Structure TypeScript en place
- [ ] Formulaire d'ajout de match
- [ ] Système de calcul Elo
- [ ] Intégration complète des données

## 🎯 Prochaines étapes

1. ✅ **Écran d'ajout de match** avec formulaire complet - TERMINÉ
2. **Implémentation du système Elo** avec calculs automatiques
3. **Enrichissement du dashboard** avec statistiques avancées
4. **Finalisation du classement** avec données Elo réelles

## 🔧 Bonnes pratiques de développement

### Tests avec Expo
- **TOUJOURS** tuer les serveurs de développement lancés avec `npx expo start` via KillBash
- Ne pas laisser tourner de serveurs en arrière-plan après les tests
- Utiliser `run_in_background: true` puis KillBash pour nettoyer
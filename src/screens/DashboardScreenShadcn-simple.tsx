import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockStats } from '../data/mockData';
import { theme } from '../themes';
import { Typography } from '../components/ui';

// Version simplifiée du Dashboard shadcn pour tester progressivement
const DashboardScreenShadcnSimple = () => {
  const currentPlayer = mockStats[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Card simplifiée */}
      <View style={styles.heroCard}>
        <LinearGradient
          colors={[theme.colors.primary[500], theme.colors.primary[600]]}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.playerInfo}>
              <Icon name="person-circle" size={60} color={theme.colors.text.inverse} />
              <View style={styles.playerDetails}>
                <Typography variant="h2" color={theme.colors.text.inverse}>
                  {currentPlayer.name}
                </Typography>
                <Typography variant="body" color={theme.colors.text.inverse}>
                  Elo: {currentPlayer.eloRating}
                </Typography>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Stats simples */}
      <View style={styles.statsSection}>
        <Typography variant="h3" style={styles.sectionTitle}>
          📊 Mes Statistiques
        </Typography>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="trophy" size={32} color={theme.colors.warning[500]} />
            <Typography variant="h4">{currentPlayer.matchesWon}</Typography>
            <Typography variant="caption">Victoires</Typography>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="list" size={32} color={theme.colors.primary[500]} />
            <Typography variant="h4">{currentPlayer.matchesPlayed}</Typography>
            <Typography variant="caption">Matchs joués</Typography>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="trending-up" size={32} color={theme.colors.success[500]} />
            <Typography variant="h4">{Math.round((currentPlayer.matchesWon / currentPlayer.matchesPlayed) * 100)}%</Typography>
            <Typography variant="caption">Win Rate</Typography>
          </View>
        </View>
      </View>
      
      <View style={styles.testSection}>
        <Typography variant="body" style={styles.testText}>
          ✅ Dashboard Shadcn Simple fonctionnel
        </Typography>
        <Typography variant="caption" style={styles.testText}>
          Étape 1: Hero card + stats de base
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  heroCard: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.ios.lg,
    elevation: theme.shadows.android.lg,
  },
  heroGradient: {
    padding: theme.spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  playerDetails: {
    flex: 1,
  },
  statsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-around',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.ios.sm,
    elevation: theme.shadows.android.sm,
  },
  testSection: {
    backgroundColor: theme.colors.success[50],
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.success[200],
  },
  testText: {
    color: theme.colors.success[700],
    textAlign: 'center',
  },
});

export default DashboardScreenShadcnSimple;
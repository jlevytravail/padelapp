import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { mockStats, mockMatches } from '../data/mockData';

const DashboardScreen = () => {
  const recentMatches = mockMatches.slice(0, 3);

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour !</Text>
        <Text style={styles.subtitleText}>Voici vos statistiques</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Classement" value={`#${mockStats.ranking}`} />
        <StatCard title="Points" value={mockStats.points} />
        <StatCard title="Matchs joués" value={mockStats.totalMatches} />
        <StatCard title="Taux de victoire" value={`${mockStats.winRate}%`} />
      </View>

      <View style={styles.streakContainer}>
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Série actuelle</Text>
          <Text style={styles.streakValue}>{mockStats.currentStreak} victoires</Text>
        </View>
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Meilleure série</Text>
          <Text style={styles.streakValue}>{mockStats.bestStreak} victoires</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Derniers matchs</Text>
        {recentMatches.map((match) => (
          <View key={match.id} style={styles.matchItem}>
            <View style={styles.matchInfo}>
              <Text style={styles.matchDate}>
                {new Date(match.date).toLocaleDateString('fr-FR')} - {match.time}
              </Text>
              <Text style={styles.matchPlayers}>
                {match.player1.name} & {match.player2.name} vs {match.player3.name} & {match.player4.name}
              </Text>
            </View>
            <View style={styles.matchScore}>
              <Text style={[styles.scoreText, match.status === 'completed' ? styles.completedScore : null]}>
                {match.team1Score} - {match.team2Score}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  matchInfo: {
    flex: 1,
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  matchPlayers: {
    fontSize: 14,
    color: '#333',
  },
  matchScore: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  completedScore: {
    color: '#007AFF',
  },
});

export default DashboardScreen;
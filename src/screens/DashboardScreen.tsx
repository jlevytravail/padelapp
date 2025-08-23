import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockStats, mockMatches } from '../data/mockData';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const recentMatches = mockMatches.slice(0, 3);

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Bonjour ! 👋</Text>
            <Text style={styles.subtitleText}>Voici vos performances</Text>
          </View>
          <View style={styles.rankingBadge}>
            <Ionicons name="trophy" size={20} color="#FF9500" />
            <Text style={styles.rankingText}>#{mockStats.ranking}</Text>
          </View>
        </View>
      </View>

      {/* Statistiques principales */}
      <View style={styles.statsGrid}>
        <StatCard title="Points Elo" value={mockStats.points} />
        <StatCard title="Matchs joués" value={mockStats.totalMatches} />
      </View>

      {/* Taux de victoire avec barre de progression */}
      <View style={styles.winRateSection}>
        <View style={styles.winRateCard}>
          <View style={styles.winRateHeader}>
            <Text style={styles.winRateTitle}>Taux de victoire</Text>
            <Text style={styles.winRateValue}>{mockStats.winRate}%</Text>
          </View>
          <ProgressBar percentage={mockStats.winRate} color="#34C759" />
          <View style={styles.winRateDetails}>
            <Text style={styles.winRateDetail}>{mockStats.wins} victoires</Text>
            <Text style={styles.winRateDetail}>{mockStats.losses} défaites</Text>
          </View>
        </View>
      </View>

      {/* Séries */}
      <View style={styles.streakContainer}>
        <View style={styles.streakCard}>
          <Ionicons name="flame" size={24} color="#FF6B35" />
          <Text style={styles.streakValue}>{mockStats.currentStreak}</Text>
          <Text style={styles.streakTitle}>Série actuelle</Text>
        </View>
        <View style={styles.streakCard}>
          <Ionicons name="star" size={24} color="#FFD60A" />
          <Text style={styles.streakValue}>{mockStats.bestStreak}</Text>
          <Text style={styles.streakTitle}>Record personnel</Text>
        </View>
      </View>

      {/* Derniers matchs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
        {recentMatches.map((match) => (
          <View key={match.id} style={styles.matchItem}>
            <View style={styles.matchIcon}>
              <Ionicons 
                name={match.status === 'completed' ? 'checkmark-circle' : 'time'} 
                size={20} 
                color={match.status === 'completed' ? '#34C759' : '#FF9500'} 
              />
            </View>
            <View style={styles.matchInfo}>
              <Text style={styles.matchPlayers}>
                {match.player1.name.split(' ')[0]} & {match.player2.name.split(' ')[0]} vs {match.player3.name.split(' ')[0]} & {match.player4.name.split(' ')[0]}
              </Text>
              <Text style={styles.matchDate}>
                {new Date(match.date).toLocaleDateString('fr-FR')} • {match.time}
              </Text>
            </View>
            <View style={styles.matchScore}>
              {match.status === 'completed' ? (
                <Text style={styles.scoreText}>
                  {match.team1Score}-{match.team2Score}
                </Text>
              ) : (
                <Text style={styles.pendingText}>
                  {match.status === 'ongoing' ? 'En cours' : 'Programmé'}
                </Text>
              )}
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '500',
  },
  rankingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  rankingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9500',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  statHeader: {
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A73E8',
  },
  statSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  winRateSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  winRateCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  winRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  winRateTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  winRateValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#34C759',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  winRateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  winRateDetail: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 20,
  },
  streakCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  streakTitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
    textAlign: 'center',
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D1D1F',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 12,
  },
  matchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchInfo: {
    flex: 1,
  },
  matchPlayers: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '600',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  matchScore: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A73E8',
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
});

export default DashboardScreen;
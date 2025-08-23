import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockPlayers } from '../data/mockData';
import { Player } from '../types';

const ClassementScreen = () => {
  const getRankingColor = (ranking: number) => {
    if (ranking === 1) return '#FFD700'; // Gold
    if (ranking === 2) return '#C0C0C0'; // Silver
    if (ranking === 3) return '#CD7F32'; // Bronze
    return '#1A73E8';
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return '🥇';
    if (ranking === 2) return '🥈';
    if (ranking === 3) return '🥉';
    return '🏆';
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B35', '#F7931E', '#FFD60A', '#32D74B', '#007AFF', '#AF52DE'];
    return colors[parseInt(id) % colors.length];
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const winRate = ((item.matchesWon / item.matchesPlayed) * 100).toFixed(1);

    return (
      <View style={styles.playerCard}>
        <View style={styles.leftSection}>
          <View style={styles.rankContainer}>
            <Text style={[styles.ranking, { color: getRankingColor(item.ranking) }]}>
              #{item.ranking}
            </Text>
          </View>
          
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.id) }]}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.statsRow}>
            {item.ranking <= 3 && (
              <Text style={styles.rankIcon}>
                {getRankingIcon(item.ranking)}
              </Text>
            )}
          </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={14} color="#8E8E93" />
              <Text style={styles.statText}>{item.matchesWon}V</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="close-circle-outline" size={14} color="#8E8E93" />
              <Text style={styles.statText}>{item.matchesPlayed - item.matchesWon}D</Text>
            </View>
            <View style={styles.winRateBadge}>
              <Text style={styles.winRateText}>{winRate}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{item.points}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
          <View style={styles.trendContainer}>
            <Ionicons 
              name="trending-up" 
              size={16} 
              color="#34C759" 
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={mockPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Classement Global 🏆</Text>
            <Text style={styles.headerSubtitle}>
              {mockPlayers.length} joueurs actifs
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '500',
  },
  playerCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rankContainer: {
    width: 32,
    alignItems: 'flex-start',
    marginRight: 12,
  },
  ranking: {
    fontSize: 16,
    fontWeight: '800',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  playerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1D1F',
    flex: 1,
  },
  rankIcon: {
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  winRateBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  winRateText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  points: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A73E8',
    marginBottom: 2,
  },
  pointsLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  trendContainer: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 4,
  },
});

export default ClassementScreen;
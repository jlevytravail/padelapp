import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { mockPlayers } from '../data/mockData';
import { Player } from '../types';

const ClassementScreen = () => {
  const getRankingColor = (ranking: number) => {
    if (ranking === 1) return '#FFD700'; // Gold
    if (ranking === 2) return '#C0C0C0'; // Silver
    if (ranking === 3) return '#CD7F32'; // Bronze
    return '#007AFF';
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return '🥇';
    if (ranking === 2) return '🥈';
    if (ranking === 3) return '🥉';
    return '🏆';
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const winRate = ((item.matchesWon / item.matchesPlayed) * 100).toFixed(1);

    return (
      <View style={styles.playerCard}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rankIcon, { color: getRankingColor(item.ranking) }]}>
            {getRankingIcon(item.ranking)}
          </Text>
          <Text style={[styles.ranking, { color: getRankingColor(item.ranking) }]}>
            #{item.ranking}
          </Text>
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              {item.matchesWon}/{item.matchesPlayed} victoires
            </Text>
            <Text style={styles.winRate}>({winRate}%)</Text>
          </View>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{item.points}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classement Global</Text>
        <Text style={styles.headerSubtitle}>
          {mockPlayers.length} joueurs classés
        </Text>
      </View>

      <FlatList
        data={mockPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  playerCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  rankIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  ranking: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginRight: 16,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  winRate: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 12,
  },
});

export default ClassementScreen;
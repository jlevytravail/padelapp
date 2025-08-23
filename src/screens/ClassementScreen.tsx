import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockPlayers } from '../data/mockData';
import { Player } from '../types';
import { theme } from '../themes';
import { EloCalculator } from '../services/EloCalculator';
import { 
  Card, 
  Typography, 
  Caption,
  Avatar,
  ProgressBar 
} from '../components/ui';

const ClassementScreen = () => {
  const getRankingGradient = (ranking: number) => {
    if (ranking === 1) return ['#FFD700', '#FFA500']; // Gold gradient
    if (ranking === 2) return ['#C0C0C0', '#A8A8A8']; // Silver gradient
    if (ranking === 3) return ['#CD7F32', '#B8860B']; // Bronze gradient
    return theme.colors.gradients.primary;
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return 'trophy';
    if (ranking === 2) return 'medal';
    if (ranking === 3) return 'medal';
    return 'ribbon';
  };

  const getPodiumHeight = (ranking: number) => {
    if (ranking === 1) return 120;
    if (ranking === 2) return 100;
    if (ranking === 3) return 80;
    return 60;
  };

  const PodiumCard = ({ player, position }: { player: Player; position: number }) => {
    const winRate = ((player.matchesWon / player.matchesPlayed) * 100).toFixed(1);
    
    return (
      <View style={[styles.podiumItem, { height: getPodiumHeight(position) }]}>
        <LinearGradient
          colors={getRankingGradient(position)}
          style={styles.podiumGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.podiumContent}>
            <View style={styles.podiumRank}>
              <Typography variant="h4" color={theme.colors.text.inverse}>
                #{position}
              </Typography>
            </View>
            
            <Avatar name={player.name} size="large" />
            
            <Typography 
              variant="subtitle2" 
              color={theme.colors.text.inverse}
              style={styles.podiumName}
            >
              {player.name.split(' ')[0]}
            </Typography>
            
            <Typography 
              variant="scoreSmall" 
              color={theme.colors.text.inverse}
              style={styles.podiumPoints}
            >
              {player.elo.toFixed(2)}
            </Typography>
            
            <Caption color={theme.colors.text.inverse}>
              Elo Rating
            </Caption>
            
            <Caption color={theme.colors.text.inverse}>
              {winRate}% victoires
            </Caption>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const winRate = ((item.matchesWon / item.matchesPlayed) * 100).toFixed(1);

    // Top 3 are shown in podium, skip them in list
    if (item.ranking <= 3) return null;

    return (
      <Card variant="elevated" style={styles.playerCard}>
        <View style={styles.playerRow}>
          <View style={styles.rankContainer}>
            <View style={[styles.rankBadge, { backgroundColor: theme.colors.neutral[600] }]}>
              <Typography variant="subtitle2" color={theme.colors.text.inverse}>
                #{item.ranking}
              </Typography>
            </View>
          </View>

          <Avatar name={item.name} size="medium" />

          <View style={styles.playerInfo}>
            <Typography variant="subtitle1">{item.name}</Typography>
            <Caption>{item.matchesWon}/{item.matchesPlayed} victoires</Caption>
          </View>

          <View style={styles.playerStats}>
            <Typography variant="scoreSmall" color={theme.colors.primary[500]}>
              {item.elo.toFixed(2)}
            </Typography>
            <Caption>Elo Rating</Caption>
            
            {/* Barre de progression Elo (relative au maximum) */}
            <ProgressBar 
              progress={(item.elo / 10) * 100} 
              height={4}
              style={styles.winRateBar}
              gradient={theme.colors.gradients.primary}
            />
            <Caption color={theme.colors.success[500]}>{winRate}%</Caption>
          </View>

          <View style={styles.trendIndicator}>
            {(() => {
              // Simule une tendance basée sur le rang (meilleurs joueurs = tendance positive)
              const isPositive = item.ranking <= playersWithEloRanking.length / 2;
              return (
                <Icon 
                  name={isPositive ? "trending-up" : "trending-down"} 
                  size={16} 
                  color={isPositive ? theme.colors.success[500] : theme.colors.error[500]} 
                />
              );
            })()}
          </View>
        </View>
      </Card>
    );
  };

  // Tri par Elo (décroissant) et mise à jour des rankings
  const sortedPlayers = [...mockPlayers].sort((a, b) => b.elo - a.elo);
  
  // Mise à jour des rankings basés sur Elo
  const playersWithEloRanking = sortedPlayers.map((player, index) => ({
    ...player,
    ranking: index + 1
  }));
  
  const topThree = playersWithEloRanking.slice(0, 3);
  const restOfPlayers = playersWithEloRanking.slice(3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Card variant="elevated" style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Typography variant="h3">Classement Global</Typography>
          <View style={styles.headerStats}>
            <Icon name="people" size={20} color={theme.colors.primary[500]} />
            <Caption>{playersWithEloRanking.length} joueurs classés</Caption>
          </View>
        </View>
      </Card>

      {/* Podium */}
      <Card variant="elevated" style={styles.podiumCard}>
        <Typography variant="h4" style={styles.podiumTitle}>
          🏆 Top 3
        </Typography>
        <View style={styles.podiumContainer}>
          <PodiumCard player={topThree[1]} position={2} />
          <PodiumCard player={topThree[0]} position={1} />
          <PodiumCard player={topThree[2]} position={3} />
        </View>
      </Card>

      {/* Rest of the leaderboard */}
      <FlatList
        data={restOfPlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  headerCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  podiumCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  podiumTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  podiumItem: {
    flex: 1,
    borderTopLeftRadius: theme.spacing.component.radius.md,
    borderTopRightRadius: theme.spacing.component.radius.md,
    overflow: 'hidden',
  },
  podiumGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.md,
  },
  podiumContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  podiumRank: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
  },
  podiumName: {
    textAlign: 'center',
    fontWeight: '600',
  },
  podiumPoints: {
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  playerCard: {
    marginBottom: theme.spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  rankContainer: {
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  playerStats: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  winRateBar: {
    width: 60,
    marginVertical: theme.spacing.xs,
  },
  trendIndicator: {
    marginLeft: theme.spacing.sm,
  },
});

export default ClassementScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockPlayers } from '../data/mockData';
import { Player } from '../types';
import { theme } from '../themes';
import { EloCalculator } from '../services/EloCalculator';
import { Typography, Avatar } from '../components/ui';

// Import des composants shadcn
import {
  CardContainer,
  CardBody,
  CardItem,
  RippleButton,
  AvatarGroup,
  SlidingNumber,
  Status,
  StatusBadge,
  BarChart,
  BarChartDataPoint,
} from '../components/shadcn';

const { width } = Dimensions.get('window');

const ClassementScreenShadcn = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [animatedValues] = useState(() => 
    mockPlayers.map(() => new Animated.Value(0))
  );
  const [sortBy, setSortBy] = useState<'elo' | 'winRate' | 'matches'>('elo');
  const [showComparison, setShowComparison] = useState(false);

  // Trier les joueurs selon le critère sélectionné
  const sortedPlayers = [...mockPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'elo':
        return b.elo - a.elo;
      case 'winRate':
        return ((b.matchesWon / b.matchesPlayed) * 100) - ((a.matchesWon / a.matchesPlayed) * 100);
      case 'matches':
        return b.matchesPlayed - a.matchesPlayed;
      default:
        return b.elo - a.elo;
    }
  });

  // Animation d'entrée
  useEffect(() => {
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const getRankingGradient = (ranking: number) => {
    if (ranking === 1) return ['#FFD700', '#FFA500']; // Gold
    if (ranking === 2) return ['#C0C0C0', '#A8A8A8']; // Silver  
    if (ranking === 3) return ['#CD7F32', '#B8860B']; // Bronze
    return theme.colors.gradients.primary;
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return 'trophy';
    if (ranking === 2) return 'medal';
    if (ranking === 3) return 'medal';
    return 'ribbon';
  };

  const getPlayerStatus = (player: Player): 'online' | 'offline' | 'playing' => {
    // Simulation de statut basée sur l'ID
    if (player.id <= 2) return 'online';
    if (player.id <= 4) return 'playing';
    return 'offline';
  };

  const getComparisonData = (player: Player): BarChartDataPoint[] => {
    const winRate = (player.matchesWon / player.matchesPlayed) * 100;
    return [
      { label: 'Elo', value: player.elo * 10, color: theme.colors.primary[500] },
      { label: 'Win%', value: winRate, color: theme.colors.success[500] },
      { label: 'Matchs', value: player.matchesPlayed, color: theme.colors.info[500] },
      { label: 'Level', value: getPlayerLevel(player.elo) * 20, color: theme.colors.warning[500] },
    ];
  };

  const getPlayerLevel = (elo: number) => {
    if (elo >= 9.0) return 5; // Élite
    if (elo >= 7.0) return 4; // Expert
    if (elo >= 5.0) return 3; // Avancé
    if (elo >= 3.0) return 2; // Intermédiaire
    return 1; // Débutant
  };

  const PodiumSection = () => {
    const topThree = sortedPlayers.slice(0, 3);
    
    return (
      <CardContainer enable3D style={styles.podiumContainer}>
        <CardBody style={styles.podiumCard}>
          <CardItem translateY={-10} rotateX={5}>
            <Typography variant="h3" style={styles.podiumTitle}>
              🏆 Podium
            </Typography>
            
            <View style={styles.podiumRow}>
              {/* 2ème place */}
              {topThree[1] && (
                <CardContainer enable3D style={styles.podiumPosition}>
                  <CardBody style={[styles.podiumPlayerCard, { height: 100 }]}>
                    <LinearGradient
                      colors={getRankingGradient(2)}
                      style={styles.podiumGradient}
                    >
                      <View style={styles.podiumContent}>
                        <Icon name="medal" size={20} color={theme.colors.text.inverse} />
                        <Avatar name={topThree[1].name} size="medium" />
                        <Typography variant="caption" color={theme.colors.text.inverse}>
                          {topThree[1].name.split(' ')[0]}
                        </Typography>
                        <SlidingNumber
                          value={parseFloat(topThree[1].elo.toFixed(1))}
                          textStyle={{ fontSize: 14, color: theme.colors.text.inverse, fontWeight: '700' }}
                        />
                      </View>
                    </LinearGradient>
                  </CardBody>
                </CardContainer>
              )}

              {/* 1ère place */}
              {topThree[0] && (
                <CardContainer enable3D style={styles.podiumPosition}>
                  <CardBody style={[styles.podiumPlayerCard, { height: 140 }]}>
                    <LinearGradient
                      colors={getRankingGradient(1)}
                      style={styles.podiumGradient}
                    >
                      <View style={styles.podiumContent}>
                        <Icon name="trophy" size={24} color={theme.colors.text.inverse} />
                        <Avatar name={topThree[0].name} size="large" />
                        <Typography variant="subtitle" color={theme.colors.text.inverse}>
                          {topThree[0].name.split(' ')[0]}
                        </Typography>
                        <SlidingNumber
                          value={parseFloat(topThree[0].elo.toFixed(1))}
                          textStyle={{ fontSize: 18, color: theme.colors.text.inverse, fontWeight: '800' }}
                        />
                        <StatusBadge status="online" variant="outline">
                          Champion
                        </StatusBadge>
                      </View>
                    </LinearGradient>
                  </CardBody>
                </CardContainer>
              )}

              {/* 3ème place */}
              {topThree[2] && (
                <CardContainer enable3D style={styles.podiumPosition}>
                  <CardBody style={[styles.podiumPlayerCard, { height: 80 }]}>
                    <LinearGradient
                      colors={getRankingGradient(3)}
                      style={styles.podiumGradient}
                    >
                      <View style={styles.podiumContent}>
                        <Icon name="medal" size={18} color={theme.colors.text.inverse} />
                        <Avatar name={topThree[2].name} size="small" />
                        <Typography variant="caption" color={theme.colors.text.inverse}>
                          {topThree[2].name.split(' ')[0]}
                        </Typography>
                        <SlidingNumber
                          value={parseFloat(topThree[2].elo.toFixed(1))}
                          textStyle={{ fontSize: 12, color: theme.colors.text.inverse, fontWeight: '600' }}
                        />
                      </View>
                    </LinearGradient>
                  </CardBody>
                </CardContainer>
              )}
            </View>
          </CardItem>
        </CardBody>
      </CardContainer>
    );
  };

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterButtons}>
        {[
          { key: 'elo', label: 'Elo Rating', icon: 'trending-up' },
          { key: 'winRate', label: 'Taux réussite', icon: 'checkmark-circle' },
          { key: 'matches', label: 'Nb matchs', icon: 'tennisball' },
        ].map(({ key, label, icon }) => (
          <RippleButton
            key={key}
            variant={sortBy === key ? 'default' : 'outline'}
            size="sm"
            onPress={() => setSortBy(key as 'elo' | 'winRate' | 'matches')}
            style={styles.filterButton}
          >
            <Icon 
              name={icon} 
              size={16} 
              color={sortBy === key ? theme.colors.text.inverse : theme.colors.primary[500]} 
            />
            <Typography 
              variant="caption"
              color={sortBy === key ? theme.colors.text.inverse : theme.colors.primary[500]}
            >
              {label}
            </Typography>
          </RippleButton>
        ))}
      </View>

      <RippleButton
        variant={showComparison ? 'default' : 'ghost'}
        size="sm"
        onPress={() => setShowComparison(!showComparison)}
      >
        <Icon 
          name="stats-chart" 
          size={16} 
          color={showComparison ? theme.colors.text.inverse : theme.colors.primary[500]} 
        />
      </RippleButton>
    </View>
  );

  const renderPlayerItem = ({ item, index }: { item: Player; index: number }) => {
    const ranking = index + 1;
    const winRate = ((item.matchesWon / item.matchesPlayed) * 100).toFixed(1);
    const isSelected = selectedPlayer?.id === item.id;
    const status = getPlayerStatus(item);
    
    return (
      <Animated.View
        style={[
          styles.playerItemContainer,
          {
            opacity: animatedValues[index],
            transform: [{
              translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <CardContainer enable3D={isSelected}>
          <CardBody style={[
            styles.playerCard, 
            isSelected && styles.selectedPlayerCard
          ]}>
            <TouchableOpacity
              onPress={() => setSelectedPlayer(isSelected ? null : item)}
              style={styles.playerCardContent}
            >
              <CardItem translateX={isSelected ? -5 : 0}>
                <View style={styles.playerRanking}>
                  <View style={[
                    styles.rankingBadge,
                    ranking <= 3 && { backgroundColor: getRankingGradient(ranking)[0] }
                  ]}>
                    <Typography 
                      variant="h4" 
                      style={[
                        styles.rankingText,
                        { color: ranking <= 3 ? theme.colors.text.inverse : theme.colors.primary[500] }
                      ]}
                    >
                      #{ranking}
                    </Typography>
                  </View>
                  <Icon 
                    name={getRankingIcon(ranking)} 
                    size={16} 
                    color={ranking <= 3 ? getRankingGradient(ranking)[0] : theme.colors.neutral[400]}
                  />
                </View>
              </CardItem>

              <CardItem translateX={isSelected ? 5 : 0}>
                <View style={styles.playerInfo}>
                  <View style={styles.playerHeader}>
                    <Avatar name={item.name} size="medium" />
                    <View style={styles.playerDetails}>
                      <Typography variant="h4" style={styles.playerName}>
                        {item.name}
                      </Typography>
                      <View style={styles.playerStatus}>
                        <Status status={status} size="sm" showLabel={false} />
                        <Typography variant="caption" color={theme.colors.text.secondary}>
                          {status === 'online' ? 'En ligne' : 
                           status === 'playing' ? 'En jeu' : 'Hors ligne'}
                        </Typography>
                      </View>
                    </View>
                  </View>

                  <View style={styles.playerStats}>
                    <View style={styles.statItem}>
                      <SlidingNumber
                        value={parseFloat(item.elo.toFixed(2))}
                        textStyle={styles.eloValue}
                      />
                      <Typography variant="caption" style={styles.statLabel}>
                        Elo Rating
                      </Typography>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Typography variant="h4" style={styles.statValue}>
                        {winRate}%
                      </Typography>
                      <Typography variant="caption" style={styles.statLabel}>
                        Réussite
                      </Typography>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Typography variant="h4" style={styles.statValue}>
                        {item.matchesPlayed}
                      </Typography>
                      <Typography variant="caption" style={styles.statLabel}>
                        Matchs
                      </Typography>
                    </View>
                  </View>
                </View>
              </CardItem>

              <CardItem translateY={isSelected ? -3 : 0}>
                <Icon 
                  name={isSelected ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.colors.neutral[400]} 
                />
              </CardItem>
            </TouchableOpacity>

            {/* Section développée avec graphique */}
            {isSelected && showComparison && (
              <CardItem translateY={5}>
                <View style={styles.expandedSection}>
                  <Typography variant="h4" style={styles.expandedTitle}>
                    Profil de performance
                  </Typography>
                  <BarChart
                    data={getComparisonData(item)}
                    height={120}
                    interactive={false}
                    showValues={true}
                  />
                </View>
              </CardItem>
            )}
          </CardBody>
        </CardContainer>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <PodiumSection />
      <FilterButtons />
      
      <FlatList
        data={sortedPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  podiumContainer: {
    margin: theme.spacing.lg,
  },
  podiumCard: {
    width: width - 32,
    padding: theme.spacing.lg,
  },
  podiumTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary[500],
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  podiumPosition: {
    flex: 1,
    maxWidth: 100,
  },
  podiumPlayerCard: {
    width: '100%',
    borderRadius: theme.spacing.component.radius.lg,
    overflow: 'hidden',
  },
  podiumGradient: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  podiumContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  filterButton: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.layout.section.large,
  },
  playerItemContainer: {
    marginBottom: theme.spacing.sm,
  },
  playerCard: {
    width: '100%',
    minHeight: 100,
    borderRadius: theme.spacing.component.radius.lg,
  },
  selectedPlayerCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary[500],
  },
  playerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  playerRanking: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rankingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[200],
  },
  rankingText: {
    fontWeight: '800',
  },
  playerInfo: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontWeight: '600',
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statValue: {
    fontWeight: '700',
    color: theme.colors.primary[500],
  },
  eloValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary[500],
  },
  statLabel: {
    color: theme.colors.text.secondary,
  },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingTop: theme.spacing.md,
    margin: theme.spacing.md,
  },
  expandedTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.primary[500],
  },
  separator: {
    height: theme.spacing.sm,
  },
});

export default ClassementScreenShadcn;
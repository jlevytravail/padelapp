import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockStats, mockMatches, mockPlayers } from '../data/mockData';
import { theme } from '../themes';
import { 
  Card, 
  StatCard, 
  Typography, 
  Title, 
  BodyText, 
  Caption,
  ProgressBar,
  Avatar,
  Button 
} from '../components/ui';
import { EloCalculator } from '../services/EloCalculator';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [showAllMatches, setShowAllMatches] = React.useState(false);
  const [matchFilter, setMatchFilter] = React.useState<'all' | 'wins' | 'losses'>('all');
  
  // Filtrer les matchs de Marie seulement
  const marieMatches = mockMatches.filter(match => {
    const marieId = mockPlayers[1].id; // Marie Laurent
    return match.player1.id === marieId || match.player2.id === marieId || 
           match.player3.id === marieId || match.player4.id === marieId;
  }).filter(match => match.status === 'completed');
  
  // Appliquer le filtre victoires/défaites
  const filteredMatches = marieMatches.filter(match => {
    if (matchFilter === 'all') return true;
    
    const marieId = mockPlayers[1].id;
    const isTeam1 = match.player1.id === marieId || match.player2.id === marieId;
    const won = (isTeam1 && match.team1Score > match.team2Score) ||
                (!isTeam1 && match.team2Score > match.team1Score);
    
    return matchFilter === 'wins' ? won : !won;
  });
  
  const displayMatches = showAllMatches ? filteredMatches : filteredMatches.slice(0, 5);

  // Utilisation des vraies données Elo du système
  const currentElo = mockStats.elo;
  const eloHistory = mockStats.eloHistory;
  const eloChange = eloHistory.length >= 2 
    ? (eloHistory[eloHistory.length - 1] - eloHistory[eloHistory.length - 2]) 
    : 0;

  // Messages motivants basés sur la performance
  const getMotivationalMessage = () => {
    if (mockStats.winRate >= 75) return "Excellent niveau ! 🔥";
    if (mockStats.winRate >= 60) return "Belle progression ! 💪";
    if (mockStats.winRate >= 50) return "Continue comme ça ! ⭐";
    return "En progression ! 🎯";
  };

  const getEloLevel = (elo: number) => {
    if (elo >= 9.0) return "Élite";
    if (elo >= 7.0) return "Expert";
    if (elo >= 5.0) return "Avancé";
    if (elo >= 3.0) return "Intermédiaire";
    return "Débutant";
  };

  const HeroCard = () => (
    <Card variant="gradient" gradient={theme.colors.gradients.primary} style={styles.heroCard}>
      <View style={styles.heroContent}>
        <View style={styles.heroLeft}>
          <Avatar name="Marie Laurent" size="large" />
          <View style={styles.heroText}>
            <Typography variant="h4" color={theme.colors.text.inverse}>
              Marie Laurent
            </Typography>
            <Caption color={theme.colors.text.inverse}>
              Niveau {getEloLevel(currentElo)} • {getMotivationalMessage()}
            </Caption>
          </View>
        </View>
        <View style={styles.heroRight}>
          <Typography variant="scoreLarge" color={theme.colors.text.inverse}>
            {currentElo.toFixed(2)}
          </Typography>
          <Caption color={theme.colors.text.inverse}>
            Elo Rating (sur 10)
          </Caption>
          <View style={styles.trendIndicator}>
            <Icon 
              name={eloChange >= 0 ? "trending-up" : "trending-down"} 
              size={16} 
              color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]} 
            />
            <Caption color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]}>
              {EloCalculator.formatEloChange(eloChange)} dernière évolution
            </Caption>
          </View>
        </View>
      </View>
    </Card>
  );

  const QuickStats = () => (
    <View style={styles.quickStats}>
      <StatCard
        title="Position globale"
        value={`#${mockStats.ranking}`}
        subtitle="sur tous les joueurs"
        icon={<Icon name="trophy" size={24} color={theme.colors.warning[500]} />}
        gradient={theme.colors.gradients.sunset}
      />
      <StatCard
        title="Taux de réussite"
        value={`${mockStats.winRate}%`}
        subtitle={`${mockStats.wins} victoires`}
        icon={<Icon name="checkmark-circle" size={24} color={theme.colors.success[500]} />}
      />
      <StatCard
        title="Activité"
        value={mockStats.totalMatches}
        subtitle="matchs joués"
        icon={<Icon name="tennisball" size={24} color={theme.colors.primary[500]} />}
      />
      <StatCard
        title="Série en cours"
        value={mockStats.currentStreak}
        subtitle="victoires d'affilée"
        icon={<Icon name="flame" size={24} color={theme.colors.error[500]} />}
        gradient={mockStats.currentStreak >= 3 ? theme.colors.gradients.forest : undefined}
      />
    </View>
  );

  const EloHistoryChart = () => {
    const maxElo = Math.max(...eloHistory);
    const minElo = Math.min(...eloHistory);
    const range = maxElo - minElo || 1;
    
    return (
      <Card variant="elevated" style={styles.eloChartCard}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Évolution Elo</Typography>
          <Icon name="trending-up" size={20} color={theme.colors.primary[500]} />
        </View>
        
        <View style={styles.eloChart}>
          <View style={styles.eloChartContent}>
            {eloHistory.map((elo, index) => {
              const height = Math.max(4, ((elo - minElo) / range) * 60 + 20);
              const isLast = index === eloHistory.length - 1;
              const isFirst = index === 0;
              
              return (
                <View key={index} style={styles.eloPoint}>
                  <View 
                    style={[
                      styles.eloBar, 
                      { 
                        height,
                        backgroundColor: isLast 
                          ? theme.colors.primary[500] 
                          : theme.colors.primary[300] 
                      }
                    ]} 
                  />
                  {(isFirst || isLast) && (
                    <Typography 
                      variant="caption" 
                      color={theme.colors.text.secondary}
                      style={styles.eloValue}
                    >
                      {elo.toFixed(1)}
                    </Typography>
                  )}
                </View>
              );
            })}
          </View>
          
          <View style={styles.eloChartLabels}>
            <Caption color={theme.colors.text.secondary}>Il y a {eloHistory.length - 1} matchs</Caption>
            <Caption color={theme.colors.text.secondary}>Aujourd'hui</Caption>
          </View>
        </View>
      </Card>
    );
  };

  const WinLossSection = () => (
    <Card variant="elevated" style={styles.performanceCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Bilan Victoires/Défaites</Typography>
        <Icon name="stats-chart" size={20} color={theme.colors.primary[500]} />
      </View>
      
      <View style={styles.winLossContent}>
        {/* Statistiques globales */}
        <View style={styles.winLossStats}>
          <View style={styles.winLossStat}>
            <Typography variant="scoreLarge" color={theme.colors.success[500]}>
              {mockStats.wins}
            </Typography>
            <Caption color={theme.colors.success[500]}>Victoires</Caption>
          </View>
          
          <View style={styles.winLossVs}>
            <Typography variant="h4" color={theme.colors.text.secondary}>-</Typography>
          </View>
          
          <View style={styles.winLossStat}>
            <Typography variant="scoreLarge" color={theme.colors.error[500]}>
              {mockStats.losses}
            </Typography>
            <Caption color={theme.colors.error[500]}>Défaites</Caption>
          </View>
        </View>

        {/* Barre de progression du ratio */}
        <View style={styles.ratioVisualization}>
          <View style={styles.ratioBar}>
            <View 
              style={[
                styles.ratioFill, 
                { 
                  width: `${mockStats.winRate}%`,
                  backgroundColor: theme.colors.success[500] 
                }
              ]} 
            />
          </View>
          <Typography variant="scoreSmall" color={theme.colors.primary[500]}>
            {mockStats.winRate}% de victoires
          </Typography>
        </View>

        {/* Métriques détaillées */}
        <View style={styles.detailedStats}>
          <View style={styles.statRow}>
            <BodyText>Série actuelle</BodyText>
            <View style={styles.streakIndicator}>
              <Icon name="flame" size={16} color={theme.colors.warning[500]} />
              <Typography variant="subtitle2" color={theme.colors.warning[500]}>
                {mockStats.currentStreak} victoires
              </Typography>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <BodyText>Record personnel</BodyText>
            <Typography variant="subtitle2" color={theme.colors.success[500]}>
              {mockStats.bestStreak} victoires consécutives
            </Typography>
          </View>
          
          <View style={styles.statRow}>
            <BodyText>Progression Elo</BodyText>
            <Typography variant="subtitle2" color={eloChange >= 0 ? theme.colors.success[500] : theme.colors.error[500]}>
              {EloCalculator.formatEloChange(eloHistory[eloHistory.length - 1] - eloHistory[0])} (15 derniers)
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );

  const PerformanceSection = () => (
    <Card variant="elevated" style={styles.performanceCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Performance par période</Typography>
        <Icon name="analytics" size={20} color={theme.colors.primary[500]} />
      </View>
      
      <View style={styles.performanceContent}>
        <View style={styles.performanceItem}>
          <View style={styles.performanceRow}>
            <BodyText>Cette semaine</BodyText>
            <Typography variant="subtitle2" color={theme.colors.success[500]}>
              3-1 (75%)
            </Typography>
          </View>
        </View>
        
        <View style={styles.performanceItem}>
          <View style={styles.performanceRow}>
            <BodyText>Ce mois-ci</BodyText>
            <Typography variant="subtitle2" color={theme.colors.primary[500]}>
              {mockStats.wins}-{mockStats.losses} ({mockStats.winRate}%)
            </Typography>
          </View>
        </View>

        <View style={styles.performanceItem}>
          <View style={styles.performanceRow}>
            <BodyText>Niveau moyen adversaires</BodyText>
            <Typography variant="subtitle2" color={theme.colors.warning[500]}>
              Elo 5.8 ⭐
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );

  const QuickActionsSection = () => (
    <Card variant="elevated" style={styles.actionsCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Actions rapides</Typography>
        <Icon name="flash" size={20} color={theme.colors.primary[500]} />
      </View>
      
      <View style={styles.actionsGrid}>
        <Button
          title="Nouveau Match"
          variant="gradient"
          gradient={theme.colors.gradients.primary}
          size="large"
          onPress={() => navigation.navigate('AddMatch' as never)}
          icon={<Icon name="add-circle" size={20} color={theme.colors.text.inverse} />}
          style={styles.primaryAction}
        />
        
        <View style={styles.secondaryActions}>
          <Button
            title="Classement"
            variant="outlined"
            onPress={() => navigation.navigate('Classement' as never)}
            icon={<Icon name="trophy" size={18} color={theme.colors.primary[500]} />}
            style={styles.secondaryAction}
          />
          
          <Button
            title="Mes Matchs"
            variant="outlined"
            onPress={() => navigation.navigate('Matchs' as never)}
            icon={<Icon name="list" size={18} color={theme.colors.primary[500]} />}
            style={styles.secondaryAction}
          />
        </View>
      </View>

      {/* Encouragements et conseils */}
      <View style={styles.encouragementSection}>
        <View style={styles.encouragementCard}>
          <Icon name="bulb" size={16} color={theme.colors.warning[500]} />
          <Caption color={theme.colors.text.secondary}>
            {mockStats.currentStreak >= 3 
              ? "Tu es en feu ! Continue sur cette lancée 🔥" 
              : mockStats.winRate >= 60
              ? "Excellent niveau ! Essaie de jouer des adversaires plus forts 💪"
              : "Chaque match te fait progresser ! 🎯"}
          </Caption>
        </View>
      </View>
    </Card>
  );

  const getMatchResult = (match: any) => {
    const marieId = mockPlayers[1].id;
    const isTeam1 = match.player1.id === marieId || match.player2.id === marieId;
    const won = (isTeam1 && match.team1Score > match.team2Score) ||
                (!isTeam1 && match.team2Score > match.team1Score);
    return { won, isTeam1 };
  };

  const getOpponents = (match: any) => {
    const marieId = mockPlayers[1].id;
    const isTeam1 = match.player1.id === marieId || match.player2.id === marieId;
    
    if (isTeam1) {
      return `${match.player3.name.split(' ')[0]} & ${match.player4.name.split(' ')[0]}`;
    } else {
      return `${match.player1.name.split(' ')[0]} & ${match.player2.name.split(' ')[0]}`;
    }
  };

  const getPartner = (match: any) => {
    const marieId = mockPlayers[1].id;
    const isTeam1 = match.player1.id === marieId || match.player2.id === marieId;
    
    if (isTeam1) {
      return match.player1.id === marieId ? match.player2.name.split(' ')[0] : match.player1.name.split(' ')[0];
    } else {
      return match.player3.id === marieId ? match.player4.name.split(' ')[0] : match.player3.name.split(' ')[0];
    }
  };

  const MatchHistorySection = () => (
    <Card variant="elevated" style={styles.matchesCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Historique des matchs</Typography>
        <View style={styles.headerActions}>
          <Icon name="filter" size={16} color={theme.colors.primary[500]} />
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filterSection}>
        <View style={styles.filterButtons}>
          <Button
            title="Tous"
            size="small"
            variant={matchFilter === 'all' ? 'primary' : 'outlined'}
            onPress={() => setMatchFilter('all')}
            style={styles.filterButton}
          />
          <Button
            title="Victoires"
            size="small"
            variant={matchFilter === 'wins' ? 'primary' : 'outlined'}
            onPress={() => setMatchFilter('wins')}
            style={styles.filterButton}
          />
          <Button
            title="Défaites"
            size="small"
            variant={matchFilter === 'losses' ? 'primary' : 'outlined'}
            onPress={() => setMatchFilter('losses')}
            style={styles.filterButton}
          />
        </View>
      </View>

      {/* Liste des matchs */}
      {displayMatches.map((match, index) => {
        const { won, isTeam1 } = getMatchResult(match);
        const eloChange = won ? '+0.25' : '-0.18'; // Simulation changement Elo
        
        return (
          <View key={match.id} style={styles.matchItem}>
            <View style={styles.matchLeft}>
              <View style={[
                styles.matchStatus,
                { backgroundColor: won ? theme.colors.success[500] : theme.colors.error[500] }
              ]}>
                <Icon 
                  name={won ? 'trending-up' : 'trending-down'} 
                  size={16} 
                  color={theme.colors.text.inverse} 
                />
              </View>
              
              <View style={styles.matchDetails}>
                <View style={styles.matchPlayers}>
                  <BodyText>{getPartner(match)} & Moi</BodyText>
                  <Caption>vs {getOpponents(match)}</Caption>
                </View>
                <Caption color={theme.colors.text.secondary}>
                  {new Date(match.date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })} • {match.time}
                </Caption>
              </View>
            </View>
            
            <View style={styles.matchRight}>
              <Typography variant="scoreSmall">
                {isTeam1 ? `${match.team1Score}-${match.team2Score}` : `${match.team2Score}-${match.team1Score}`}
              </Typography>
              
              <View style={styles.matchResultRow}>
                <Caption color={won ? theme.colors.success[500] : theme.colors.error[500]}>
                  {won ? 'Victoire' : 'Défaite'}
                </Caption>
                <Caption 
                  color={won ? theme.colors.success[500] : theme.colors.error[500]}
                  style={styles.eloChange}
                >
                  {eloChange}
                </Caption>
              </View>
            </View>
          </View>
        );
      })}

      {/* Bouton Voir plus / Voir moins */}
      {filteredMatches.length > 5 && (
        <Button
          title={showAllMatches ? `Voir moins` : `Voir ${filteredMatches.length - 5} matchs de plus`}
          variant="outlined"
          size="small"
          onPress={() => setShowAllMatches(!showAllMatches)}
          style={styles.showMoreButton}
          icon={<Icon name={showAllMatches ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.primary[500]} />}
        />
      )}
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.success[500];
      case 'ongoing': return theme.colors.warning[500];
      case 'scheduled': return theme.colors.primary[500];
      default: return theme.colors.neutral[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark';
      case 'ongoing': return 'play';
      case 'scheduled': return 'calendar';
      default: return 'ellipse';
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <HeroCard />
      <QuickStats />
      <EloHistoryChart />
      <WinLossSection />
      <PerformanceSection />
      <QuickActionsSection />
      <MatchHistorySection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    paddingHorizontal: theme.spacing.layout.screen.horizontal,
    paddingBottom: theme.spacing.layout.section.large,
  },
  heroCard: {
    marginVertical: theme.spacing.md,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  heroText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  heroRight: {
    alignItems: 'flex-end',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  performanceCard: {
    marginBottom: theme.spacing.md,
  },
  performanceContent: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  performanceItem: {
    gap: theme.spacing.xs,
  },
  eloTrend: {
    alignItems: 'flex-start',
  },
  matchesCard: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  matchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  matchStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchRight: {
    alignItems: 'flex-end',
  },
  eloChartCard: {
    marginBottom: theme.spacing.md,
  },
  eloChart: {
    marginTop: theme.spacing.md,
  },
  eloChartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    paddingHorizontal: theme.spacing.xs,
  },
  eloPoint: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  eloBar: {
    width: 6,
    borderRadius: 3,
    marginBottom: theme.spacing.xs,
  },
  eloValue: {
    fontSize: 10,
    marginTop: theme.spacing.xs,
  },
  eloChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    minWidth: 60,
  },
  matchDetails: {
    flex: 1,
  },
  matchPlayers: {
    marginBottom: theme.spacing.xs,
  },
  matchResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  eloChange: {
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  showMoreButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
  winLossContent: {
    marginTop: theme.spacing.md,
  },
  winLossStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  winLossStat: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  winLossVs: {
    marginHorizontal: theme.spacing.lg,
  },
  ratioVisualization: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  ratioBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  ratioFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailedStats: {
    gap: theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionsCard: {
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    marginTop: theme.spacing.md,
  },
  primaryAction: {
    marginBottom: theme.spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  secondaryAction: {
    flex: 1,
  },
  encouragementSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  encouragementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.warning[50],
    padding: theme.spacing.md,
    borderRadius: theme.spacing.component.radius.md,
  },
});

export default DashboardScreen;
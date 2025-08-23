import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockStats, mockMatches } from '../data/mockData';
import { theme } from '../themes';
import { 
  Card, 
  StatCard, 
  Typography, 
  Title, 
  BodyText, 
  Caption,
  ProgressBar,
  Avatar 
} from '../components/ui';
import { EloCalculator } from '../services/EloCalculator';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const recentMatches = mockMatches.slice(0, 3);

  // Utilisation des vraies données Elo du système
  const currentElo = mockStats.elo;
  const eloHistory = mockStats.eloHistory;
  const eloChange = eloHistory.length >= 2 
    ? (eloHistory[eloHistory.length - 1] - eloHistory[eloHistory.length - 2]) 
    : 0;

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
              Membre depuis 2024
            </Caption>
          </View>
        </View>
        <View style={styles.heroRight}>
          <Typography variant="scoreLarge" color={theme.colors.text.inverse}>
            {currentElo.toFixed(2)}
          </Typography>
          <Caption color={theme.colors.text.inverse}>
            Elo Rating
          </Caption>
          <View style={styles.trendIndicator}>
            <Icon 
              name={eloChange >= 0 ? "trending-up" : "trending-down"} 
              size={16} 
              color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]} 
            />
            <Caption color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]}>
              {EloCalculator.formatEloChange(eloChange)}
            </Caption>
          </View>
        </View>
      </View>
    </Card>
  );

  const QuickStats = () => (
    <View style={styles.quickStats}>
      <StatCard
        title="Classement"
        value={`#${mockStats.ranking}`}
        icon={<Icon name="trophy" size={24} color={theme.colors.warning[500]} />}
        gradient={theme.colors.gradients.sunset}
      />
      <StatCard
        title="Victoires"
        value={mockStats.wins}
        subtitle={`${mockStats.winRate}%`}
        icon={<Icon name="checkmark-circle" size={24} color={theme.colors.success[500]} />}
      />
      <StatCard
        title="Matchs"
        value={mockStats.totalMatches}
        subtitle="Cette saison"
        icon={<Icon name="tennisball" size={24} color={theme.colors.primary[500]} />}
      />
      <StatCard
        title="Série"
        value={mockStats.currentStreak}
        subtitle="Victoires"
        icon={<Icon name="flame" size={24} color={theme.colors.error[500]} />}
        gradient={theme.colors.gradients.forest}
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

  const PerformanceSection = () => (
    <Card variant="elevated" style={styles.performanceCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Performance</Typography>
        <Icon name="analytics" size={20} color={theme.colors.primary[500]} />
      </View>
      
      <View style={styles.performanceContent}>
        <View style={styles.performanceItem}>
          <BodyText>Taux de victoire</BodyText>
          <ProgressBar 
            progress={mockStats.winRate} 
            showLabel={true} 
            height={8}
            gradient={theme.colors.gradients.success}
            style={{ marginTop: theme.spacing.sm }}
          />
        </View>
        
        <View style={styles.performanceItem}>
          <BodyText>Progression Elo</BodyText>
          <View style={styles.eloTrend}>
            <Typography variant="scoreMedium" color={eloChange >= 0 ? theme.colors.success[500] : theme.colors.error[500]}>
              {EloCalculator.formatEloChange(eloHistory[eloHistory.length - 1] - eloHistory[0])}
            </Typography>
            <Caption>Derniers matchs</Caption>
          </View>
        </View>

        <View style={styles.performanceItem}>
          <BodyText>Meilleure série</BodyText>
          <Typography variant="scoreSmall" color={theme.colors.success[500]}>
            {mockStats.bestStreak} victoires
          </Typography>
        </View>
      </View>
    </Card>
  );

  const RecentMatchesSection = () => (
    <Card variant="elevated" style={styles.matchesCard}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Derniers matchs</Typography>
        <Icon name="time" size={20} color={theme.colors.primary[500]} />
      </View>

      {recentMatches.map((match, index) => (
        <View key={match.id} style={styles.matchItem}>
          <View style={styles.matchLeft}>
            <View style={[
              styles.matchStatus,
              { backgroundColor: getStatusColor(match.status) }
            ]}>
              <Icon 
                name={getStatusIcon(match.status)} 
                size={16} 
                color={theme.colors.text.inverse} 
              />
            </View>
            <View>
              <BodyText>
                {match.player3.name} & {match.player4.name}
              </BodyText>
              <Caption>
                {new Date(match.date).toLocaleDateString('fr-FR')} • {match.time}
              </Caption>
            </View>
          </View>
          
          <View style={styles.matchRight}>
            <Typography variant="scoreSmall">
              {match.team1Score} - {match.team2Score}
            </Typography>
            {match.status === 'completed' && (
              <Caption color={match.team1Score > match.team2Score ? theme.colors.success[500] : theme.colors.error[500]}>
                {match.team1Score > match.team2Score ? 'Victoire' : 'Défaite'}
              </Caption>
            )}
          </View>
        </View>
      ))}
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
      <PerformanceSection />
      <RecentMatchesSection />
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
});

export default DashboardScreen;
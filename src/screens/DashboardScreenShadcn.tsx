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
import { Typography, Avatar } from '../components/ui';
import { EloCalculator } from '../services/EloCalculator';

// Import des nouveaux composants shadcn
import {
  CardContainer,
  CardBody,
  CardItem,
  RippleButton,
  AvatarGroup,
  Counter,
  SlidingNumber,
  Status,
  StatusBadge,
  LineChart,
  PieChart,
  BarChart,
  LineChartDataPoint,
  PieChartDataPoint,
  BarChartDataPoint,
} from '../components/shadcn';

const { width } = Dimensions.get('window');

const DashboardScreenShadcn = () => {
  const navigation = useNavigation();
  const [showAllMatches, setShowAllMatches] = React.useState(false);
  const [matchFilter, setMatchFilter] = React.useState<'all' | 'wins' | 'losses'>('all');
  
  // Filtrer les matchs de Marie seulement
  const marieMatches = mockMatches.filter(match => {
    const marieId = mockPlayers[1].id;
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

  // Utilisation des vraies données Elo du système
  const currentElo = mockStats.elo;
  const eloHistory = mockStats.eloHistory;
  const eloChange = eloHistory.length >= 2 
    ? (eloHistory[eloHistory.length - 1] - eloHistory[eloHistory.length - 2]) 
    : 0;

  // Préparer les données pour les graphiques
  const lineChartData: LineChartDataPoint[] = eloHistory.map((elo, index) => ({
    date: new Date(Date.now() - (eloHistory.length - 1 - index) * 24 * 60 * 60 * 1000).toISOString(),
    value: elo,
    label: `Match ${index + 1}`,
  }));

  const winLossData: PieChartDataPoint[] = [
    {
      label: 'Victoires',
      value: mockStats.wins,
      color: theme.colors.success[500],
    },
    {
      label: 'Défaites', 
      value: mockStats.losses,
      color: theme.colors.error[500],
    },
  ];

  const performanceData: BarChartDataPoint[] = [
    { label: 'Sem.', value: 75, color: theme.colors.success[400] },
    { label: 'Mois', value: mockStats.winRate, color: theme.colors.primary[500] },
    { label: 'Trim.', value: 68, color: theme.colors.warning[500] },
    { label: 'Année', value: 72, color: theme.colors.info[500] },
  ];

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
    <CardContainer enable3D style={styles.heroCardContainer}>
      <CardBody style={styles.heroCard}>
        <LinearGradient
          colors={theme.colors.gradients.primary}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <CardItem translateX={-10} translateY={-5} rotateY={5}>
              <View style={styles.heroLeft}>
                <Avatar name="Marie Laurent" size="large" />
                <View style={styles.heroText}>
                  <Typography variant="h4" color={theme.colors.text.inverse}>
                    Marie Laurent
                  </Typography>
                  <Typography variant="caption" color={theme.colors.text.inverse}>
                    Niveau {getEloLevel(currentElo)} • {getMotivationalMessage()}
                  </Typography>
                  <StatusBadge status="online" style={styles.statusBadge}>
                    En ligne
                  </StatusBadge>
                </View>
              </View>
            </CardItem>
            
            <CardItem translateX={10} translateY={-5} rotateY={-5}>
              <View style={styles.heroRight}>
                <SlidingNumber 
                  value={parseFloat(currentElo.toFixed(2))} 
                  style={styles.eloNumber}
                  textStyle={{ 
                    fontSize: 32, 
                    fontWeight: '800', 
                    color: theme.colors.text.inverse 
                  }}
                />
                <Typography variant="caption" color={theme.colors.text.inverse}>
                  Elo Rating (sur 10)
                </Typography>
                <View style={styles.trendIndicator}>
                  <Icon 
                    name={eloChange >= 0 ? "trending-up" : "trending-down"} 
                    size={16} 
                    color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]} 
                  />
                  <Typography variant="caption" color={eloChange >= 0 ? theme.colors.success[300] : theme.colors.error[300]}>
                    {EloCalculator.formatEloChange(eloChange)} dernière évolution
                  </Typography>
                </View>
              </View>
            </CardItem>
          </View>
        </LinearGradient>
      </CardBody>
    </CardContainer>
  );

  const QuickStats = () => (
    <View style={styles.quickStats}>
      <CardContainer enable3D style={styles.statCard}>
        <CardBody style={styles.statCardBody}>
          <CardItem translateY={-5}>
            <View style={styles.statContent}>
              <Icon name="trophy" size={24} color={theme.colors.warning[500]} />
              <Typography variant="h3" style={styles.statValue}>#{mockStats.ranking}</Typography>
              <Typography variant="caption" color={theme.colors.text.secondary}>
                Position globale
              </Typography>
            </View>
          </CardItem>
        </CardBody>
      </CardContainer>

      <CardContainer enable3D style={styles.statCard}>
        <CardBody style={styles.statCardBody}>
          <CardItem translateY={-5}>
            <View style={styles.statContent}>
              <Icon name="checkmark-circle" size={24} color={theme.colors.success[500]} />
              <SlidingNumber 
                value={mockStats.winRate} 
                textStyle={styles.statValue}
              />
              <Typography variant="caption" color={theme.colors.text.secondary}>
                % de réussite
              </Typography>
            </View>
          </CardItem>
        </CardBody>
      </CardContainer>

      <CardContainer enable3D style={styles.statCard}>
        <CardBody style={styles.statCardBody}>
          <CardItem translateY={-5}>
            <View style={styles.statContent}>
              <Icon name="tennisball" size={24} color={theme.colors.primary[500]} />
              <Counter
                value={mockStats.totalMatches}
                onValueChange={() => {}}
                showButtons={false}
                style={styles.counter}
              />
              <Typography variant="caption" color={theme.colors.text.secondary}>
                Matchs joués
              </Typography>
            </View>
          </CardItem>
        </CardBody>
      </CardContainer>

      <CardContainer enable3D style={styles.statCard}>
        <CardBody style={styles.statCardBody}>
          <CardItem translateY={-5}>
            <View style={styles.statContent}>
              <Icon name="flame" size={24} color={theme.colors.error[500]} />
              <SlidingNumber 
                value={mockStats.currentStreak} 
                textStyle={styles.statValue}
              />
              <Typography variant="caption" color={theme.colors.text.secondary}>
                Série actuelle
              </Typography>
            </View>
          </CardItem>
        </CardBody>
      </CardContainer>
    </View>
  );

  const EloEvolutionChart = () => (
    <CardContainer enable3D style={styles.chartContainer}>
      <CardBody style={styles.chartCard}>
        <CardItem translateY={-3}>
          <View style={styles.chartHeader}>
            <Typography variant="h4">Évolution Elo</Typography>
            <Icon name="trending-up" size={20} color={theme.colors.primary[500]} />
          </View>
          
          <LineChart
            data={lineChartData}
            height={180}
            interactive={true}
            showDots={true}
            onPointPress={(point, index) => {
              console.log(`Point cliqué: ${point.value} à l'index ${index}`);
            }}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  const WinLossChart = () => (
    <CardContainer enable3D style={styles.chartContainer}>
      <CardBody style={styles.chartCard}>
        <CardItem translateY={-3}>
          <View style={styles.chartHeader}>
            <Typography variant="h4">Bilan Victoires/Défaites</Typography>
            <Icon name="stats-chart" size={20} color={theme.colors.primary[500]} />
          </View>
          
          <PieChart
            data={winLossData}
            size={200}
            innerRadius={60}
            interactive={true}
            onSlicePress={(slice, index) => {
              console.log(`Tranche cliquée: ${slice.label} - ${slice.value}`);
            }}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  const PerformanceChart = () => (
    <CardContainer enable3D style={styles.chartContainer}>
      <CardBody style={styles.chartCard}>
        <CardItem translateY={-3}>
          <View style={styles.chartHeader}>
            <Typography variant="h4">Performance par période</Typography>
            <Icon name="analytics" size={20} color={theme.colors.primary[500]} />
          </View>
          
          <BarChart
            data={performanceData}
            height={160}
            interactive={true}
            showValues={true}
            onBarPress={(bar, index) => {
              console.log(`Barre cliquée: ${bar.label} - ${bar.value}%`);
            }}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  const QuickActions = () => (
    <CardContainer enable3D style={styles.actionsContainer}>
      <CardBody style={styles.actionsCard}>
        <CardItem translateY={-3}>
          <View style={styles.actionsHeader}>
            <Typography variant="h4">Actions rapides</Typography>
            <Icon name="flash" size={20} color={theme.colors.primary[500]} />
          </View>
          
          <View style={styles.actionsGrid}>
            <RippleButton
              variant="default"
              size="lg"
              onPress={() => navigation.navigate('AddMatch' as never)}
              style={styles.primaryActionButton}
            >
              <Icon name="add-circle" size={20} color={theme.colors.text.inverse} />
              <Typography variant="button" color={theme.colors.text.inverse}>
                Nouveau Match
              </Typography>
            </RippleButton>
            
            <View style={styles.secondaryActions}>
              <RippleButton
                variant="outline"
                onPress={() => navigation.navigate('Classement' as never)}
                style={styles.secondaryActionButton}
              >
                <Icon name="trophy" size={18} color={theme.colors.primary[500]} />
                <Typography variant="caption">Classement</Typography>
              </RippleButton>
              
              <RippleButton
                variant="outline"
                onPress={() => navigation.navigate('Matchs' as never)}
                style={styles.secondaryActionButton}
              >
                <Icon name="list" size={18} color={theme.colors.primary[500]} />
                <Typography variant="caption">Mes Matchs</Typography>
              </RippleButton>
            </View>
          </View>

          {/* Section d'encouragement avec badge interactif */}
          <View style={styles.encouragementSection}>
            <StatusBadge status="playing" variant="default">
              💡 Conseil du jour
            </StatusBadge>
            <Typography variant="caption" color={theme.colors.text.secondary} style={styles.encouragementText}>
              {mockStats.currentStreak >= 3 
                ? "Tu es en feu ! Continue sur cette lancée 🔥" 
                : mockStats.winRate >= 60
                ? "Excellent niveau ! Essaie de jouer des adversaires plus forts 💪"
                : "Chaque match te fait progresser ! 🎯"}
            </Typography>
          </View>
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <HeroCard />
      <QuickStats />
      <EloEvolutionChart />
      
      <View style={styles.chartsRow}>
        <View style={styles.halfWidth}>
          <WinLossChart />
        </View>
        <View style={styles.halfWidth}>
          <PerformanceChart />
        </View>
      </View>
      
      <QuickActions />
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
  heroCardContainer: {
    marginVertical: theme.spacing.md,
  },
  heroCard: {
    width: width - 32,
    height: 140,
    borderRadius: theme.spacing.component.radius.xl,
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
  statusBadge: {
    marginTop: theme.spacing.xs,
  },
  eloNumber: {
    alignItems: 'center',
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
  statCard: {
    width: (width - 48) / 2,
  },
  statCardBody: {
    width: '100%',
    height: 100,
    padding: theme.spacing.md,
  },
  statContent: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary[500],
  },
  counter: {
    backgroundColor: 'transparent',
  },
  chartContainer: {
    marginBottom: theme.spacing.md,
  },
  chartCard: {
    width: width - 32,
    padding: theme.spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  actionsContainer: {
    marginBottom: theme.spacing.md,
  },
  actionsCard: {
    width: width - 32,
    padding: theme.spacing.lg,
  },
  actionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    gap: theme.spacing.md,
  },
  primaryActionButton: {
    height: 56,
    gap: theme.spacing.sm,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  secondaryActionButton: {
    flex: 1,
    height: 48,
    gap: theme.spacing.xs,
  },
  encouragementSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    gap: theme.spacing.sm,
  },
  encouragementText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DashboardScreenShadcn;
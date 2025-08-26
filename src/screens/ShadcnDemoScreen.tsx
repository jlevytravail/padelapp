import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { theme } from '../themes';
import { Typography } from '../components/ui';

// Import des composants shadcn pour demo
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
  Dock,
  LineChartDataPoint,
  PieChartDataPoint,
  BarChartDataPoint,
  DockItem,
} from '../components/shadcn';
import { Avatar } from '../components/ui';
import Icon from 'react-native-vector-icons/Ionicons';

export const ShadcnDemoScreen = () => {
  const [counter, setCounter] = useState(42);
  const [slidingNumber, setSlidingNumber] = useState(128);
  const [activeTab, setActiveTab] = useState('components');

  // Données de demo pour les graphiques
  const lineData: LineChartDataPoint[] = [
    { date: '2024-01-01', value: 5.2, label: 'Jan' },
    { date: '2024-02-01', value: 5.8, label: 'Fév' },
    { date: '2024-03-01', value: 5.1, label: 'Mar' },
    { date: '2024-04-01', value: 6.2, label: 'Avr' },
    { date: '2024-05-01', value: 6.8, label: 'Mai' },
    { date: '2024-06-01', value: 7.1, label: 'Jun' },
  ];

  const pieData: PieChartDataPoint[] = [
    { label: 'Victoires', value: 15, color: theme.colors.success[500] },
    { label: 'Défaites', value: 8, color: theme.colors.error[500] },
    { label: 'Égalités', value: 2, color: theme.colors.neutral[400] },
  ];

  const barData: BarChartDataPoint[] = [
    { label: 'Lun', value: 75 },
    { label: 'Mar', value: 89 },
    { label: 'Mer', value: 45 },
    { label: 'Jeu', value: 92 },
    { label: 'Ven', value: 67 },
  ];

  const dockItems: DockItem[] = [
    {
      id: 'components',
      label: 'Composants',
      icon: 'cube',
      isActive: activeTab === 'components',
      onPress: () => setActiveTab('components'),
    },
    {
      id: 'charts',
      label: 'Graphiques',
      icon: 'stats-chart',
      isActive: activeTab === 'charts',
      onPress: () => setActiveTab('charts'),
      badge: 3,
    },
    {
      id: 'animations',
      label: 'Animations',
      icon: 'flash',
      isActive: activeTab === 'animations',
      onPress: () => setActiveTab('animations'),
    },
    {
      id: 'demo',
      label: 'Demo',
      icon: 'play',
      isActive: activeTab === 'demo',
      onPress: () => setActiveTab('demo'),
    },
  ];

  const ComponentsDemo = () => (
    <View style={styles.section}>
      <Typography variant="h2" style={styles.sectionTitle}>
        🧩 Composants UI
      </Typography>

      {/* Cards 3D */}
      <View style={styles.demoGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Cards 3D Interactives</Typography>
        
        <View style={styles.cardsRow}>
          <CardContainer enable3D style={styles.demoCard}>
            <CardBody style={styles.cardBody}>
              <CardItem translateY={-5} rotateX={5}>
                <Icon name="trophy" size={32} color={theme.colors.warning[500]} />
                <Typography variant="h3" style={styles.cardValue}>1er</Typography>
                <Typography variant="caption">Position</Typography>
              </CardItem>
            </CardBody>
          </CardContainer>

          <CardContainer enable3D style={styles.demoCard}>
            <CardBody style={styles.cardBody}>
              <CardItem translateY={-3} rotateY={-5}>
                <Icon name="tennisball" size={32} color={theme.colors.primary[500]} />
                <SlidingNumber 
                  value={slidingNumber} 
                  textStyle={styles.cardValue}
                />
                <Typography variant="caption">Matchs</Typography>
              </CardItem>
            </CardBody>
          </CardContainer>
        </View>
      </View>

      {/* Boutons Ripple */}
      <View style={styles.demoGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Boutons avec Effet Ripple</Typography>
        
        <View style={styles.buttonsRow}>
          <RippleButton
            variant="default"
            onPress={() => Alert.alert('🎾', 'Bouton Principal cliqué!')}
            style={styles.demoButton}
          >
            <Icon name="add" size={16} color={theme.colors.text.inverse} />
            <Typography variant="button" color={theme.colors.text.inverse}>
              Principal
            </Typography>
          </RippleButton>

          <RippleButton
            variant="outline"
            onPress={() => Alert.alert('⚡', 'Bouton Secondaire cliqué!')}
            style={styles.demoButton}
          >
            <Icon name="star" size={16} color={theme.colors.primary[500]} />
            <Typography variant="button">Secondaire</Typography>
          </RippleButton>

          <RippleButton
            variant="ghost"
            size="icon"
            onPress={() => Alert.alert('❤️', 'Bouton Icône cliqué!')}
          >
            <Icon name="heart" size={20} color={theme.colors.error[500]} />
          </RippleButton>
        </View>
      </View>

      {/* Avatars et Status */}
      <View style={styles.demoGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Avatars & Status</Typography>
        
        <AvatarGroup variant="stack" size="medium" style={styles.avatarDemo}>
          <Avatar name="Marie Laurent" size="medium" />
          <Avatar name="Pierre Durand" size="medium" />
          <Avatar name="Sophie Martin" size="medium" />
          <Avatar name="Lucas Bernard" size="medium" />
        </AvatarGroup>

        <View style={styles.statusRow}>
          <StatusBadge status="online">En ligne</StatusBadge>
          <StatusBadge status="playing">En jeu</StatusBadge>
          <StatusBadge status="offline">Hors ligne</StatusBadge>
        </View>
      </View>

      {/* Compteurs */}
      <View style={styles.demoGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Compteurs Interactifs</Typography>
        
        <View style={styles.countersRow}>
          <View style={styles.counterDemo}>
            <Typography variant="caption">Score Set</Typography>
            <Counter
              value={counter}
              onValueChange={setCounter}
              min={0}
              max={100}
              size="lg"
            />
          </View>

          <View style={styles.counterDemo}>
            <Typography variant="caption">Animation</Typography>
            <RippleButton
              variant="outline"
              onPress={() => setSlidingNumber(Math.floor(Math.random() * 200))}
            >
              <Typography variant="button">Randomize</Typography>
            </RippleButton>
          </View>
        </View>
      </View>
    </View>
  );

  const ChartsDemo = () => (
    <View style={styles.section}>
      <Typography variant="h2" style={styles.sectionTitle}>
        📊 Graphiques Interactifs
      </Typography>

      {/* Line Chart */}
      <View style={styles.chartGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Évolution Elo</Typography>
        <LineChart
          data={lineData}
          height={180}
          interactive={true}
          onPointPress={(point) => Alert.alert('📈', `Elo: ${point.value} en ${point.label}`)}
        />
      </View>

      {/* Pie Chart */}
      <View style={styles.chartGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Répartition Matchs</Typography>
        <PieChart
          data={pieData}
          size={220}
          innerRadius={50}
          interactive={true}
          onSlicePress={(slice) => Alert.alert('🥧', `${slice.label}: ${slice.value}`)}
        />
      </View>

      {/* Bar Chart */}
      <View style={styles.chartGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Performance Semaine</Typography>
        <BarChart
          data={barData}
          height={160}
          interactive={true}
          onBarPress={(bar) => Alert.alert('📊', `${bar.label}: ${bar.value}%`)}
        />
      </View>
    </View>
  );

  const AnimationsDemo = () => (
    <View style={styles.section}>
      <Typography variant="h2" style={styles.sectionTitle}>
        ✨ Animations
      </Typography>

      <View style={styles.animationGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Effets 3D</Typography>
        
        <CardContainer enable3D>
          <CardBody style={styles.animationCard}>
            <CardItem translateY={-10} rotateX={10} rotateY={5}>
              <Icon name="cube" size={48} color={theme.colors.primary[500]} />
              <Typography variant="h3">Interactif</Typography>
              <Typography variant="caption">Touchez et bougez</Typography>
            </CardItem>
          </CardBody>
        </CardContainer>
      </View>

      <View style={styles.animationGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Nombres Animés</Typography>
        
        <View style={styles.numbersDemo}>
          <SlidingNumber
            value={slidingNumber}
            textStyle={styles.bigNumber}
          />
          <RippleButton
            variant="default"
            onPress={() => setSlidingNumber(prev => prev + Math.floor(Math.random() * 50))}
            style={styles.animateButton}
          >
            <Icon name="trending-up" size={16} color={theme.colors.text.inverse} />
            <Typography variant="button" color={theme.colors.text.inverse}>
              Incrémenter
            </Typography>
          </RippleButton>
        </View>
      </View>

      <View style={styles.animationGroup}>
        <Typography variant="h4" style={styles.groupTitle}>Status Animés</Typography>
        
        <View style={styles.statusDemo}>
          <Status status="online" size="lg" animated={true} />
          <Status status="playing" size="lg" animated={true} />
          <Status status="offline" size="lg" animated={false} />
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsDemo />;
      case 'charts':
        return <ChartsDemo />;
      case 'animations':
        return <AnimationsDemo />;
      default:
        return <ComponentsDemo />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            🎨 Shadcn Demo
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            Découvrez tous les composants modernisés
          </Typography>
        </View>

        {renderContent()}

        {/* Espace pour le dock */}
        <View style={styles.dockSpace} />
      </ScrollView>

      {/* Dock de navigation */}
      <Dock
        items={dockItems}
        variant="floating"
        position="bottom"
        showLabels={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.primary[500],
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.primary[500],
  },
  demoGroup: {
    marginBottom: theme.spacing.xl,
  },
  groupTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  demoCard: {
    flex: 1,
    maxWidth: 120,
  },
  cardBody: {
    width: '100%',
    height: 120,
    padding: theme.spacing.md,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary[500],
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  demoButton: {
    gap: theme.spacing.xs,
    minWidth: 100,
  },
  avatarDemo: {
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  countersRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    justifyContent: 'space-around',
  },
  counterDemo: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  chartGroup: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  animationGroup: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  animationCard: {
    width: 200,
    height: 160,
    padding: theme.spacing.lg,
  },
  numbersDemo: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.primary[500],
  },
  animateButton: {
    gap: theme.spacing.xs,
  },
  statusDemo: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  dockSpace: {
    height: 100, // Espace pour le dock
  },
});

export default ShadcnDemoScreen;
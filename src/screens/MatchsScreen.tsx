import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';
import { theme } from '../themes';
import { 
  Card, 
  Typography, 
  Caption,
  FAB,
  Avatar 
} from '../components/ui';

const MatchsScreen = () => {
  const navigation = useNavigation();
  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'ongoing':
        return '#FF9800';
      case 'scheduled':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'ongoing':
        return 'En cours';
      case 'scheduled':
        return 'Programmé';
      default:
        return status;
    }
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <Card variant="elevated" style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <View style={styles.matchInfo}>
          <Typography variant="subtitle1">{new Date(item.date).toLocaleDateString('fr-FR')}</Typography>
          <Caption>{item.time} • {item.court}</Caption>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Icon name={getStatusIcon(item.status)} size={12} color={theme.colors.text.inverse} />
          <Typography variant="caption" color={theme.colors.text.inverse} style={styles.statusText}>
            {getStatusText(item.status)}
          </Typography>
        </View>
      </View>
      
      <View style={styles.matchContent}>
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Typography variant="overline" color={theme.colors.primary[500]} style={styles.teamTitle}>
              Équipe 1
            </Typography>
            <View style={styles.playersRow}>
              <Avatar name={item.player1.name} size="small" />
              <Avatar name={item.player2.name} size="small" />
            </View>
            <Caption style={styles.playerNames}>
              {item.player1.name.split(' ')[0]} & {item.player2.name.split(' ')[0]}
            </Caption>
          </View>
          
          <View style={styles.scoreContainer}>
            <Typography variant="scoreLarge" color={getScoreColor(item)}>
              {item.team1Score}
            </Typography>
            <Typography variant="h4" color={theme.colors.neutral[500]}>-</Typography>
            <Typography variant="scoreLarge" color={getScoreColor(item, false)}>
              {item.team2Score}
            </Typography>
            {item.sets && item.sets.length > 0 && (
              <Caption style={styles.setsInfo}>
                {item.sets.length} set{item.sets.length > 1 ? 's' : ''}
              </Caption>
            )}
          </View>
          
          <View style={styles.team}>
            <Typography variant="overline" color={theme.colors.secondary[500]} style={styles.teamTitle}>
              Équipe 2
            </Typography>
            <View style={styles.playersRow}>
              <Avatar name={item.player3.name} size="small" />
              <Avatar name={item.player4.name} size="small" />
            </View>
            <Caption style={styles.playerNames}>
              {item.player3.name.split(' ')[0]} & {item.player4.name.split(' ')[0]}
            </Caption>
          </View>
        </View>
      </View>
    </Card>
  );

  const getScoreColor = (match: Match, isTeam1: boolean = true) => {
    if (match.status !== 'completed') return theme.colors.neutral[500];
    
    const isWinning = isTeam1 
      ? match.team1Score > match.team2Score 
      : match.team2Score > match.team1Score;
      
    return isWinning ? theme.colors.success[500] : theme.colors.error[500];
  };

  const getStatusIcon = (status: Match['status']) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'ongoing': return 'play-circle';
      case 'scheduled': return 'time';
      default: return 'ellipse';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMatches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <FAB 
        onPress={() => navigation.navigate('AddMatch')}
        icon={<Icon name="add" size={24} color={theme.colors.text.inverse} />}
        gradient={theme.colors.gradients.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  list: {
    paddingHorizontal: theme.spacing.layout.screen.horizontal,
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing['20'], // Extra space for FAB
  },
  matchCard: {
    marginBottom: theme.spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  matchInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.full,
  },
  statusText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchContent: {
    marginTop: theme.spacing.sm,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  playersRow: {
    flexDirection: 'row',
    gap: -theme.spacing.xs, // Overlap avatars slightly
    marginBottom: theme.spacing.xs,
  },
  playerNames: {
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  setsInfo: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});

export default MatchsScreen;
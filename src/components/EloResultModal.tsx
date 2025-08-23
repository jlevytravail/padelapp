import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { MatchResult, EloChange } from '../types';
import { theme } from '../themes';
import { 
  Card, 
  Typography, 
  Button,
  Avatar 
} from './ui';
import { EloCalculator } from '../services/EloCalculator';

interface EloResultModalProps {
  visible: boolean;
  matchResult: MatchResult | null;
  onClose: () => void;
  onConfirm: () => void;
}

const { width } = Dimensions.get('window');

export const EloResultModal: React.FC<EloResultModalProps> = ({
  visible,
  matchResult,
  onClose,
  onConfirm,
}) => {
  if (!matchResult) return null;

  const { match, eloChanges, team1Expected, team2Expected, upset } = matchResult;

  const team1Changes = eloChanges.slice(0, 2);
  const team2Changes = eloChanges.slice(2, 4);

  const team1Won = match.team1Score > match.team2Score;
  const team2Won = match.team2Score > match.team1Score;

  const EloChangeCard = ({ changes, teamName, won, color }: {
    changes: EloChange[];
    teamName: string;
    won: boolean;
    color: string;
  }) => (
    <Card variant="elevated" style={[styles.teamCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.teamHeader}>
        <Typography variant="subtitle1" color={color}>
          {teamName}
        </Typography>
        {won && (
          <View style={[styles.winnerBadge, { backgroundColor: color }]}>
            <Icon name="trophy" size={16} color={theme.colors.text.inverse} />
            <Typography variant="caption" color={theme.colors.text.inverse}>
              Vainqueur
            </Typography>
          </View>
        )}
      </View>

      {changes.map((change, index) => {
        // Équipe 1: index 0 = player1, index 1 = player2
        // Équipe 2: index 0 = player3, index 1 = player4
        const isTeam1 = changes === team1Changes;
        const player = isTeam1 
          ? (index === 0 ? match.player1 : match.player2)
          : (index === 0 ? match.player3 : match.player4);
        
        return (
          <View key={change.playerId} style={styles.playerChange}>
            <Avatar name={player.name} size="medium" />
            
            <View style={styles.playerInfo}>
              <Typography variant="subtitle2">{player.name}</Typography>
              <View style={styles.eloRow}>
                <Typography variant="caption" color={theme.colors.text.secondary}>
                  {change.oldElo.toFixed(2)}
                </Typography>
                <Icon 
                  name="arrow-forward" 
                  size={14} 
                  color={theme.colors.text.secondary}
                  style={styles.arrow}
                />
                <Typography variant="subtitle1" color={EloCalculator.getEloChangeColor(change.change)}>
                  {change.newElo.toFixed(2)}
                </Typography>
              </View>
            </View>

            <View style={styles.changeIndicator}>
              <LinearGradient
                colors={change.change >= 0 ? theme.colors.gradients.success : ['#F44336', '#FF8A80']}
                style={[styles.changeValue, { opacity: Math.abs(change.change) > 0.1 ? 1 : 0.7 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Typography 
                  variant="buttonSmall" 
                  color={theme.colors.text.inverse}
                  style={styles.changeText}
                >
                  {EloCalculator.formatEloChange(change.change)}
                </Typography>
              </LinearGradient>
            </View>
          </View>
        );
      })}
    </Card>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Card variant="elevated" style={styles.modal}>
            
            {/* Header avec score final */}
            <LinearGradient
              colors={team1Won ? theme.colors.gradients.success : team2Won ? ['#F44336', '#FF8A80'] : theme.colors.gradients.primary}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Typography variant="h4" color={theme.colors.text.inverse}>
                Match terminé !
              </Typography>
              
              <View style={styles.finalScore}>
                <Typography variant="scoreLarge" color={theme.colors.text.inverse}>
                  {match.team1Score}
                </Typography>
                <Typography variant="h4" color={theme.colors.text.inverse}>-</Typography>
                <Typography variant="scoreLarge" color={theme.colors.text.inverse}>
                  {match.team2Score}
                </Typography>
              </View>

              {upset && (
                <View style={styles.upsetBadge}>
                  <Icon name="flash" size={16} color={theme.colors.warning[500]} />
                  <Typography variant="caption" color={theme.colors.warning[500]}>
                    Exploit ! L'outsider a gagné
                  </Typography>
                </View>
              )}
            </LinearGradient>

            {/* Probabilités pré-match */}
            <View style={styles.predictions}>
              <Typography variant="h5" style={styles.sectionTitle}>
                Probabilités avant match
              </Typography>
              <View style={styles.predictionRow}>
                <View style={styles.predictionItem}>
                  <Typography variant="caption" color={theme.colors.primary[500]}>Équipe 1</Typography>
                  <Typography variant="scoreSmall">{(team1Expected * 100).toFixed(0)}%</Typography>
                </View>
                <View style={styles.predictionItem}>
                  <Typography variant="caption" color={theme.colors.secondary[500]}>Équipe 2</Typography>
                  <Typography variant="scoreSmall">{(team2Expected * 100).toFixed(0)}%</Typography>
                </View>
              </View>
            </View>

            {/* Changements d'Elo par équipe */}
            <EloChangeCard 
              changes={team1Changes}
              teamName="Équipe 1"
              won={team1Won}
              color={theme.colors.primary[500]}
            />

            <EloChangeCard 
              changes={team2Changes}
              teamName="Équipe 2" 
              won={team2Won}
              color={theme.colors.secondary[500]}
            />

            {/* Actions */}
            <View style={styles.actions}>
              <Button 
                title="Annuler"
                onPress={onClose}
                variant="outlined"
                style={styles.actionButton}
              />
              
              <Button 
                title="Confirmer"
                onPress={onConfirm}
                variant="gradient"
                gradient={theme.colors.gradients.primary}
                style={styles.actionButton}
                icon={<Icon name="checkmark" size={20} color={theme.colors.text.inverse} />}
              />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.95,
    maxHeight: '90%',
  },
  modal: {
    padding: 0,
    borderRadius: theme.spacing.component.radius.xl,
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  finalScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  upsetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.full,
    marginTop: theme.spacing.sm,
  },
  predictions: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  predictionItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  teamCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.full,
  },
  playerChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  playerInfo: {
    flex: 1,
  },
  eloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  arrow: {
    marginHorizontal: theme.spacing.xs,
  },
  changeIndicator: {
    alignItems: 'center',
  },
  changeValue: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  changeText: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
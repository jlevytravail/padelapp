import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Player, NewMatch, Set, MatchResult } from '../types';
import { mockPlayers, addMatch } from '../data/mockData';
import { theme } from '../themes';
import { 
  Card, 
  Button, 
  Typography 
} from '../components/ui';
import PlayerSelector from '../components/PlayerSelector';
import SetScoreInput from '../components/SetScoreInput';
import PositionSelector from '../components/PositionSelector';
import { EloResultModal } from '../components/EloResultModal';
import { EloCalculator } from '../services/EloCalculator';

const AddMatchScreen = () => {
  const navigation = useNavigation();
  
  const [newMatch, setNewMatch] = useState<NewMatch>({
    player1: null,
    player2: null,
    player3: null,
    player4: null,
    sets: [{ team1: 0, team2: 0 }],
  });

  const [positions, setPositions] = useState({
    player1: null as 'left' | 'right' | null,
    player2: null as 'left' | 'right' | null,
    player3: null as 'left' | 'right' | null,
    player4: null as 'left' | 'right' | null,
  });

  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showEloModal, setShowEloModal] = useState(false);

  const addSet = () => {
    setNewMatch(prev => ({
      ...prev,
      sets: [...prev.sets, { team1: 0, team2: 0 }]
    }));
  };

  const removeSet = (index: number) => {
    if (newMatch.sets.length > 1) {
      setNewMatch(prev => ({
        ...prev,
        sets: prev.sets.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSet = (index: number, set: Set) => {
    setNewMatch(prev => ({
      ...prev,
      sets: prev.sets.map((s, i) => i === index ? set : s)
    }));
  };

  const selectPlayer = (playerKey: keyof NewMatch, player: Player) => {
    setNewMatch(prev => ({
      ...prev,
      [playerKey]: player
    }));
  };

  const setPosition = (playerKey: string, position: 'left' | 'right' | null) => {
    setPositions(prev => ({
      ...prev,
      [playerKey]: position
    }));
  };

  const validateMatch = (): boolean => {
    const { player1, player2, player3, player4, sets } = newMatch;
    
    if (!player1 || !player2 || !player3 || !player4) {
      Alert.alert('Erreur', 'Veuillez sélectionner les 4 joueurs');
      return false;
    }

    const playerIds = [player1.id, player2.id, player3.id, player4.id];
    if (new Set(playerIds).size !== 4) {
      Alert.alert('Erreur', 'Tous les joueurs doivent être différents');
      return false;
    }

    if (sets.some(set => set.team1 < 0 || set.team2 < 0)) {
      Alert.alert('Erreur', 'Les scores ne peuvent pas être négatifs');
      return false;
    }

    return true;
  };

  const previewMatch = () => {
    if (!validateMatch()) return;

    try {
      const { player1, player2, player3, player4, sets } = newMatch;

      // Création d'un match temporaire pour la preview
      const tempMatch = {
        id: 'temp',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        player1: player1!,
        player2: player2!,
        player3: player3!,
        player4: player4!,
        team1Score: sets.reduce((acc, set) => acc + (set.team1 > set.team2 ? 1 : 0), 0),
        team2Score: sets.reduce((acc, set) => acc + (set.team2 > set.team1 ? 1 : 0), 0),
        sets,
        status: 'completed' as const,
        court: 'Court 1',
      };

      // Calcul du résultat avec les changements d'Elo
      const result = EloCalculator.createMatchResult(
        player1!, player2!, player3!, player4!, sets, tempMatch
      );

      setMatchResult(result);
      setShowEloModal(true);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du calcul des changements d\'Elo');
    }
  };

  const confirmMatch = () => {
    if (!matchResult) return;

    try {
      // Application des changements d'Elo aux joueurs
      EloCalculator.applyEloChanges(mockPlayers, matchResult.eloChanges);

      // Ajout du match aux données
      const matchToSave = {
        player1: newMatch.player1,
        player2: newMatch.player2,
        player3: newMatch.player3,
        player4: newMatch.player4,
        sets: newMatch.sets,
      };

      addMatch(matchToSave);

      setShowEloModal(false);
      setMatchResult(null);

      Alert.alert(
        'Match enregistré',
        'Le match et les nouveaux classements Elo ont été sauvegardés !',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement du match');
    }
  };

  const cancelMatch = () => {
    setShowEloModal(false);
    setMatchResult(null);
  };

  const getSelectedPlayers = () => {
    return [newMatch.player1, newMatch.player2, newMatch.player3, newMatch.player4]
      .filter(Boolean)
      .map(p => p!.id);
  };

  const canPreviewElo = () => {
    const { player1, player2, player3, player4, sets } = newMatch;
    return player1 && player2 && player3 && player4 && 
           sets.some(set => set.team1 > 0 || set.team2 > 0);
  };

  const getEloPreview = () => {
    if (!canPreviewElo()) return null;

    const { player1, player2, player3, player4, sets } = newMatch;
    const team1Elo = EloCalculator.getTeamElo(player1!, player2!);
    const team2Elo = EloCalculator.getTeamElo(player3!, player4!);
    
    const team1Expected = EloCalculator.getExpectedScore(team1Elo, team2Elo);
    const team2Expected = 1 - team1Expected;

    return {
      team1Elo: team1Elo.toFixed(2),
      team2Elo: team2Elo.toFixed(2),
      team1Expected: (team1Expected * 100).toFixed(0),
      team2Expected: (team2Expected * 100).toFixed(0),
    };
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header avec progression */}
      <Card variant="elevated" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Typography variant="h4">Nouveau Match</Typography>
          <View style={styles.progressSteps}>
            <View style={[styles.step, styles.stepActive]}>
              <Typography variant="caption" color={theme.colors.text.inverse}>1</Typography>
            </View>
            <View style={styles.stepLine} />
            <View style={[styles.step, newMatch.sets.some(s => s.team1 > 0 || s.team2 > 0) && styles.stepActive]}>
              <Typography variant="caption" color={newMatch.sets.some(s => s.team1 > 0 || s.team2 > 0) ? theme.colors.text.inverse : theme.colors.text.secondary}>2</Typography>
            </View>
          </View>
        </View>
      </Card>

      {/* Section Joueurs */}
      <Card variant="elevated" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Joueurs</Typography>
          <Icon name="people" size={20} color={theme.colors.primary[500]} />
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Typography variant="subtitle1" color={theme.colors.primary[500]} style={styles.teamTitle}>
              Équipe 1
            </Typography>
            
            <View style={styles.playerContainer}>
              <PlayerSelector
                selectedPlayer={newMatch.player1}
                onPlayerSelect={(player) => selectPlayer('player1', player)}
                availablePlayers={mockPlayers.filter(p => !getSelectedPlayers().includes(p.id))}
                placeholder="Joueur 1"
              />
              <PositionSelector
                selectedPosition={positions.player1}
                onPositionSelect={(position) => setPosition('player1', position)}
              />
            </View>

            <View style={styles.playerContainer}>
              <PlayerSelector
                selectedPlayer={newMatch.player2}
                onPlayerSelect={(player) => selectPlayer('player2', player)}
                availablePlayers={mockPlayers.filter(p => !getSelectedPlayers().includes(p.id))}
                placeholder="Joueur 2"
              />
              <PositionSelector
                selectedPosition={positions.player2}
                onPositionSelect={(position) => setPosition('player2', position)}
              />
            </View>
          </View>

          <View style={styles.vsContainer}>
            <View style={styles.vsCircle}>
              <Typography variant="h4" color={theme.colors.text.inverse}>VS</Typography>
            </View>
          </View>

          <View style={styles.team}>
            <Typography variant="subtitle1" color={theme.colors.secondary[500]} style={styles.teamTitle}>
              Équipe 2
            </Typography>
            
            <View style={styles.playerContainer}>
              <PlayerSelector
                selectedPlayer={newMatch.player3}
                onPlayerSelect={(player) => selectPlayer('player3', player)}
                availablePlayers={mockPlayers.filter(p => !getSelectedPlayers().includes(p.id))}
                placeholder="Joueur 3"
              />
              <PositionSelector
                selectedPosition={positions.player3}
                onPositionSelect={(position) => setPosition('player3', position)}
              />
            </View>

            <View style={styles.playerContainer}>
              <PlayerSelector
                selectedPlayer={newMatch.player4}
                onPlayerSelect={(player) => selectPlayer('player4', player)}
                availablePlayers={mockPlayers.filter(p => !getSelectedPlayers().includes(p.id))}
                placeholder="Joueur 4"
              />
              <PositionSelector
                selectedPosition={positions.player4}
                onPositionSelect={(position) => setPosition('player4', position)}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* Section Sets */}
      <Card variant="elevated" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Scores par set</Typography>
          <Button 
            title="Ajouter" 
            onPress={addSet}
            size="small"
            variant="outlined"
            icon={<Icon name="add" size={16} color={theme.colors.primary[500]} />}
          />
        </View>

        {newMatch.sets.map((set, index) => (
          <SetScoreInput
            key={index}
            set={set}
            setNumber={index + 1}
            onSetChange={(updatedSet) => updateSet(index, updatedSet)}
            onRemove={newMatch.sets.length > 1 ? () => removeSet(index) : undefined}
          />
        ))}

        {/* Preview Elo */}
        {canPreviewElo() && (
          <Card variant="outlined" style={styles.eloPreviewCard}>
            <View style={styles.eloPreviewHeader}>
              <Icon name="trending-up" size={20} color={theme.colors.warning[500]} />
              <Typography variant="subtitle1" color={theme.colors.warning[500]}>
                Probabilités de victoire
              </Typography>
            </View>
            
            {(() => {
              const preview = getEloPreview();
              return preview ? (
                <View style={styles.eloPreviewContent}>
                  <View style={styles.eloTeamPreview}>
                    <Typography variant="caption" color={theme.colors.primary[500]}>Équipe 1 (Elo: {preview.team1Elo})</Typography>
                    <Typography variant="scoreSmall" color={theme.colors.primary[500]}>{preview.team1Expected}%</Typography>
                  </View>
                  <View style={styles.eloTeamPreview}>
                    <Typography variant="caption" color={theme.colors.secondary[500]}>Équipe 2 (Elo: {preview.team2Elo})</Typography>
                    <Typography variant="scoreSmall" color={theme.colors.secondary[500]}>{preview.team2Expected}%</Typography>
                  </View>
                </View>
              ) : null;
            })()}
          </Card>
        )}
      </Card>

      {/* Boutons d'action */}
      <View style={styles.actions}>
        <Button 
          title="Annuler"
          onPress={() => navigation.goBack()}
          variant="outlined"
          style={styles.actionButton}
        />
        
        <Button 
          title="Prévisualiser"
          onPress={previewMatch}
          variant="gradient"
          gradient={theme.colors.gradients.primary}
          style={styles.actionButton}
          icon={<Icon name="eye" size={20} color={theme.colors.text.inverse} />}
        />
      </View>

      {/* Modal de prévisualisation Elo */}
      <EloResultModal
        visible={showEloModal}
        matchResult={matchResult}
        onClose={cancelMatch}
        onConfirm={confirmMatch}
      />
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
  progressCard: {
    marginVertical: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: theme.colors.primary[500],
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.neutral[300],
    marginHorizontal: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
  },
  teamTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  playerContainer: {
    marginBottom: theme.spacing.md,
  },
  vsContainer: {
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  vsCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.neutral[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.ios.sm,
    elevation: theme.shadows.android.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  eloPreviewCard: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.warning[50],
  },
  eloPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  eloPreviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eloTeamPreview: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});

export default AddMatchScreen;
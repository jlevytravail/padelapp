import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Player, NewMatch, Set, MatchResult } from '../types';
import { mockPlayers, addMatch } from '../data/mockData';
import { theme } from '../themes';
import { Typography, Avatar } from '../components/ui';
import { EloResultModal } from '../components/EloResultModal';
import { EloCalculator } from '../services/EloCalculator';

// Import des composants shadcn
import {
  CardContainer,
  CardBody,
  CardItem,
  RippleButton,
  AvatarGroup,
  Counter,
  Status,
  StatusBadge,
} from '../components/shadcn';

const { width } = Dimensions.get('window');

const AddMatchScreenShadcn = () => {
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
  const [currentStep, setCurrentStep] = useState<'players' | 'positions' | 'scores'>('players');

  const addSet = () => {
    setNewMatch(prev => ({
      ...prev,
      sets: [...prev.sets, { team1: 0, team2: 0 }]
    }));
  };

  const removeSet = (index: number) => {
    if (newMatch.sets.length <= 1) return;
    setNewMatch(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const updateSetScore = (setIndex: number, team: 'team1' | 'team2', score: number) => {
    setNewMatch(prev => ({
      ...prev,
      sets: prev.sets.map((set, index) => 
        index === setIndex ? { ...set, [team]: score } : set
      )
    }));
  };

  const selectPlayer = (position: keyof NewMatch, player: Player | null) => {
    setNewMatch(prev => ({ ...prev, [position]: player }));
  };

  const setPlayerPosition = (playerKey: keyof typeof positions, position: 'left' | 'right') => {
    setPositions(prev => ({ ...prev, [playerKey]: position }));
  };

  const isFormValid = () => {
    const { player1, player2, player3, player4, sets } = newMatch;
    const playersSelected = player1 && player2 && player3 && player4;
    const positionsSet = Object.values(positions).every(pos => pos !== null);
    const scoresValid = sets.every(set => 
      set.team1 >= 0 && set.team2 >= 0 && 
      set.team1 <= 6 && set.team2 <= 6 &&
      (set.team1 !== set.team2 || (set.team1 === 6 && set.team2 === 6))
    );
    
    return playersSelected && positionsSet && scoresValid;
  };

  const calculateMatchResult = (): MatchResult => {
    const { player1, player2, player3, player4, sets } = newMatch;
    
    let team1Score = 0;
    let team2Score = 0;
    
    sets.forEach(set => {
      if (set.team1 > set.team2) team1Score++;
      else if (set.team2 > set.team1) team2Score++;
    });

    const team1Players = [player1!, player2!];
    const team2Players = [player3!, player4!];

    const winner = team1Score > team2Score ? 'team1' : 'team2';
    const winnerPlayers = winner === 'team1' ? team1Players : team2Players;
    const loserPlayers = winner === 'team1' ? team2Players : team1Players;

    const eloChanges = EloCalculator.calculateMatchEloChanges(
      winnerPlayers,
      loserPlayers
    );

    return {
      winner,
      team1Score,
      team2Score,
      sets,
      eloChanges,
      players: { team1: team1Players, team2: team2Players }
    };
  };

  const handleSubmitMatch = () => {
    if (!isFormValid()) {
      Alert.alert('Erreur', 'Veuillez compléter tous les champs requis');
      return;
    }

    const result = calculateMatchResult();
    setMatchResult(result);
    setShowEloModal(true);
  };

  const confirmMatch = () => {
    if (matchResult) {
      const matchData = {
        ...newMatch,
        result: matchResult,
        date: new Date().toISOString(),
        status: 'completed' as const,
      };
      
      addMatch(matchData);
      setShowEloModal(false);
      navigation.goBack();
    }
  };

  const getSelectedPlayers = () => {
    return Object.values(newMatch).filter((player): player is Player => 
      player !== null && typeof player === 'object'
    );
  };

  const getAvailablePlayers = () => {
    const selected = getSelectedPlayers().map(p => p.id);
    return mockPlayers.filter(p => !selected.includes(p.id));
  };

  const getTeamAvatars = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      return [newMatch.player1, newMatch.player2].filter(Boolean);
    } else {
      return [newMatch.player3, newMatch.player4].filter(Boolean);
    }
  };

  const PlayerSelectionStep = () => (
    <CardContainer enable3D>
      <CardBody style={styles.stepCard}>
        <CardItem translateY={-3}>
          <View style={styles.stepHeader}>
            <Typography variant="h3">Sélection des joueurs</Typography>
            <StatusBadge status="playing" variant="outline">
              Étape 1/3
            </StatusBadge>
          </View>

          <View style={styles.teamsContainer}>
            {/* Équipe 1 */}
            <View style={styles.teamSection}>
              <Typography variant="h4" style={styles.teamTitle}>Équipe 1</Typography>
              <View style={styles.teamPlayers}>
                <View style={styles.playerSlots}>
                  {[newMatch.player1, newMatch.player2].map((player, index) => (
                    <View key={index} style={styles.playerSlot}>
                      {player ? (
                        <View style={styles.selectedPlayer}>
                          <Avatar name={player.name} size="medium" />
                          <Typography variant="caption" style={styles.playerName}>
                            {player.name.split(' ')[0]}
                          </Typography>
                          <RippleButton
                            size="sm"
                            variant="ghost"
                            onPress={() => selectPlayer(
                              index === 0 ? 'player1' : 'player2', 
                              null
                            )}
                          >
                            <Icon name="close" size={16} color={theme.colors.error[500]} />
                          </RippleButton>
                        </View>
                      ) : (
                        <RippleButton
                          variant="outline"
                          style={styles.emptySlot}
                          onPress={() => {
                            // Ouvrir la sélection de joueur
                          }}
                        >
                          <Icon name="add" size={24} color={theme.colors.primary[500]} />
                          <Typography variant="caption">Joueur {index + 1}</Typography>
                        </RippleButton>
                      )}
                    </View>
                  ))}
                </View>
                
                <AvatarGroup variant="stack" size="medium" style={styles.teamPreview}>
                  {getTeamAvatars('team1').map((player, index) => (
                    <Avatar key={index} name={player!.name} size="medium" />
                  ))}
                </AvatarGroup>
              </View>
            </View>

            <View style={styles.vsSection}>
              <Typography variant="h2" color={theme.colors.primary[500]}>VS</Typography>
            </View>

            {/* Équipe 2 */}
            <View style={styles.teamSection}>
              <Typography variant="h4" style={styles.teamTitle}>Équipe 2</Typography>
              <View style={styles.teamPlayers}>
                <View style={styles.playerSlots}>
                  {[newMatch.player3, newMatch.player4].map((player, index) => (
                    <View key={index} style={styles.playerSlot}>
                      {player ? (
                        <View style={styles.selectedPlayer}>
                          <Avatar name={player.name} size="medium" />
                          <Typography variant="caption" style={styles.playerName}>
                            {player.name.split(' ')[0]}
                          </Typography>
                          <RippleButton
                            size="sm"
                            variant="ghost"
                            onPress={() => selectPlayer(
                              index === 0 ? 'player3' : 'player4', 
                              null
                            )}
                          >
                            <Icon name="close" size={16} color={theme.colors.error[500]} />
                          </RippleButton>
                        </View>
                      ) : (
                        <RippleButton
                          variant="outline"
                          style={styles.emptySlot}
                          onPress={() => {
                            // Ouvrir la sélection de joueur
                          }}
                        >
                          <Icon name="add" size={24} color={theme.colors.primary[500]} />
                          <Typography variant="caption">Joueur {index + 3}</Typography>
                        </RippleButton>
                      )}
                    </View>
                  ))}
                </View>
                
                <AvatarGroup variant="stack" size="medium" style={styles.teamPreview}>
                  {getTeamAvatars('team2').map((player, index) => (
                    <Avatar key={index} name={player!.name} size="medium" />
                  ))}
                </AvatarGroup>
              </View>
            </View>
          </View>

          {/* Liste des joueurs disponibles */}
          <View style={styles.availablePlayersSection}>
            <Typography variant="h4" style={styles.sectionTitle}>
              Joueurs disponibles
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.availablePlayers}>
                {getAvailablePlayers().map(player => (
                  <RippleButton
                    key={player.id}
                    variant="ghost"
                    style={styles.availablePlayerButton}
                    onPress={() => {
                      // Logic pour assigner le joueur au prochain slot libre
                      if (!newMatch.player1) selectPlayer('player1', player);
                      else if (!newMatch.player2) selectPlayer('player2', player);
                      else if (!newMatch.player3) selectPlayer('player3', player);
                      else if (!newMatch.player4) selectPlayer('player4', player);
                    }}
                  >
                    <Avatar name={player.name} size="medium" />
                    <Typography variant="caption" style={styles.availablePlayerName}>
                      {player.name}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.secondary}>
                      Elo: {player.elo.toFixed(1)}
                    </Typography>
                  </RippleButton>
                ))}
              </View>
            </ScrollView>
          </View>
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  const ScoreStep = () => (
    <CardContainer enable3D>
      <CardBody style={styles.stepCard}>
        <CardItem translateY={-3}>
          <View style={styles.stepHeader}>
            <Typography variant="h3">Scores des sets</Typography>
            <StatusBadge status="playing" variant="outline">
              Étape 3/3
            </StatusBadge>
          </View>

          <View style={styles.setsContainer}>
            {newMatch.sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Typography variant="h4" style={styles.setLabel}>
                  Set {index + 1}
                </Typography>
                
                <View style={styles.setScores}>
                  <View style={styles.teamScore}>
                    <Typography variant="caption" style={styles.teamLabel}>
                      Équipe 1
                    </Typography>
                    <Counter
                      value={set.team1}
                      onValueChange={(value) => updateSetScore(index, 'team1', value)}
                      min={0}
                      max={6}
                      size="lg"
                    />
                  </View>
                  
                  <Typography variant="h3" color={theme.colors.primary[500]}>
                    -
                  </Typography>
                  
                  <View style={styles.teamScore}>
                    <Typography variant="caption" style={styles.teamLabel}>
                      Équipe 2
                    </Typography>
                    <Counter
                      value={set.team2}
                      onValueChange={(value) => updateSetScore(index, 'team2', value)}
                      min={0}
                      max={6}
                      size="lg"
                    />
                  </View>
                </View>

                {newMatch.sets.length > 1 && (
                  <RippleButton
                    variant="ghost"
                    size="sm"
                    onPress={() => removeSet(index)}
                    style={styles.removeSetButton}
                  >
                    <Icon name="trash" size={16} color={theme.colors.error[500]} />
                  </RippleButton>
                )}
              </View>
            ))}
          </View>

          <View style={styles.setActions}>
            {newMatch.sets.length < 3 && (
              <RippleButton
                variant="outline"
                onPress={addSet}
                style={styles.addSetButton}
              >
                <Icon name="add" size={16} color={theme.colors.primary[500]} />
                <Typography variant="button">Ajouter un set</Typography>
              </RippleButton>
            )}
          </View>
        </CardItem>
      </CardBody>
    </CardContainer>
  );

  const NavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep !== 'players' && (
        <RippleButton
          variant="outline"
          onPress={() => {
            if (currentStep === 'scores') setCurrentStep('positions');
            else if (currentStep === 'positions') setCurrentStep('players');
          }}
          style={styles.navButton}
        >
          <Icon name="chevron-back" size={16} />
          <Typography variant="button">Précédent</Typography>
        </RippleButton>
      )}

      {currentStep !== 'scores' ? (
        <RippleButton
          variant="default"
          onPress={() => {
            if (currentStep === 'players') {
              const allPlayersSelected = newMatch.player1 && newMatch.player2 && 
                                       newMatch.player3 && newMatch.player4;
              if (allPlayersSelected) {
                setCurrentStep('positions');
              } else {
                Alert.alert('Attention', 'Veuillez sélectionner tous les joueurs');
              }
            } else if (currentStep === 'positions') {
              setCurrentStep('scores');
            }
          }}
          style={styles.navButton}
        >
          <Typography variant="button">Suivant</Typography>
          <Icon name="chevron-forward" size={16} />
        </RippleButton>
      ) : (
        <RippleButton
          variant="default"
          onPress={handleSubmitMatch}
          disabled={!isFormValid()}
          style={[styles.navButton, styles.submitButton]}
        >
          <Icon name="checkmark" size={16} color={theme.colors.text.inverse} />
          <Typography variant="button" color={theme.colors.text.inverse}>
            Valider le match
          </Typography>
        </RippleButton>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {currentStep === 'players' && <PlayerSelectionStep />}
      {currentStep === 'scores' && <ScoreStep />}
      
      <NavigationButtons />

      {matchResult && (
        <EloResultModal
          visible={showEloModal}
          result={matchResult}
          onConfirm={confirmMatch}
          onCancel={() => setShowEloModal(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.layout.section.large,
  },
  stepCard: {
    width: width - 32,
    minHeight: 400,
    padding: theme.spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  teamsContainer: {
    gap: theme.spacing.lg,
  },
  teamSection: {
    gap: theme.spacing.md,
  },
  teamTitle: {
    textAlign: 'center',
    color: theme.colors.primary[500],
  },
  teamPlayers: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  playerSlots: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  playerSlot: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  selectedPlayer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.component.radius.md,
    backgroundColor: theme.colors.primary[50],
  },
  playerName: {
    fontWeight: '500',
  },
  emptySlot: {
    width: 80,
    height: 80,
    borderRadius: theme.spacing.component.radius.md,
    borderStyle: 'dashed',
    gap: theme.spacing.xs,
  },
  teamPreview: {
    marginTop: theme.spacing.sm,
  },
  vsSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  availablePlayersSection: {
    marginTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  availablePlayers: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  availablePlayerButton: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.component.radius.md,
    backgroundColor: theme.colors.background.card,
    minWidth: 100,
  },
  availablePlayerName: {
    fontWeight: '500',
    textAlign: 'center',
  },
  setsContainer: {
    gap: theme.spacing.lg,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.spacing.component.radius.lg,
    gap: theme.spacing.md,
  },
  setLabel: {
    minWidth: 60,
  },
  setScores: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  teamScore: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  teamLabel: {
    fontWeight: '500',
  },
  removeSetButton: {
    padding: theme.spacing.sm,
  },
  setActions: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  addSetButton: {
    gap: theme.spacing.xs,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
    height: 48,
    gap: theme.spacing.xs,
  },
  submitButton: {
    backgroundColor: theme.colors.success[500],
  },
});

export default AddMatchScreenShadcn;
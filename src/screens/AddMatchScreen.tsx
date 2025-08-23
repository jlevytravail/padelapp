import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Player, NewMatch, Set } from '../types';
import { mockPlayers, addMatch } from '../data/mockData';
import PlayerSelector from '../components/PlayerSelector';
import SetScoreInput from '../components/SetScoreInput';
import PositionSelector from '../components/PositionSelector';

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

  const saveMatch = () => {
    if (!validateMatch()) return;

    try {
      const matchToSave = {
        player1: newMatch.player1,
        player2: newMatch.player2,
        player3: newMatch.player3,
        player4: newMatch.player4,
        sets: newMatch.sets,
      };

      addMatch(matchToSave);

      Alert.alert(
        'Match enregistré',
        'Le match a été ajouté avec succès !',
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

  const getSelectedPlayers = () => {
    return [newMatch.player1, newMatch.player2, newMatch.player3, newMatch.player4]
      .filter(Boolean)
      .map(p => p!.id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        
        {/* Section Joueurs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#1A73E8" />
            <Text style={styles.sectionTitle}>Sélection des joueurs</Text>
          </View>
          
          <View style={styles.teamsContainer}>
            <View style={styles.team}>
              <View style={styles.teamHeader}>
                <View style={[styles.teamBadge, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.teamTitle, { color: '#1A73E8' }]}>Équipe 1</Text>
                </View>
              </View>
              
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
                <Text style={styles.vs}>VS</Text>
              </View>
            </View>

            <View style={styles.team}>
              <View style={styles.teamHeader}>
                <View style={[styles.teamBadge, { backgroundColor: '#F3E5F5' }]}>
                  <Text style={[styles.teamTitle, { color: '#7B1FA2' }]}>Équipe 2</Text>
                </View>
              </View>
              
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
        </View>

        {/* Section Sets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="trophy" size={24} color="#1A73E8" />
              <Text style={styles.sectionTitle}>Scores par set</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addSet} activeOpacity={0.7}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
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
        </View>


      </View>

      {/* Boutons d'action */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#8E8E93" />
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveMatch}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  team: {
    flex: 1,
  },
  teamHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  teamBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playerContainer: {
    marginBottom: 16,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  vs: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8E8E93',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1A73E8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});

export default AddMatchScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        {/* Section Joueurs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Joueurs</Text>
          
          <View style={styles.teamsContainer}>
            <View style={styles.team}>
              <Text style={styles.teamTitle}>Équipe 1</Text>
              
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

            <Text style={styles.vs}>VS</Text>

            <View style={styles.team}>
              <Text style={styles.teamTitle}>Équipe 2</Text>
              
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
            <Text style={styles.sectionTitle}>Scores par set</Text>
            <TouchableOpacity style={styles.addButton} onPress={addSet}>
              <Text style={styles.addButtonText}>+ Ajouter un set</Text>
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
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={saveMatch}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  playerContainer: {
    marginBottom: 12,
  },
  vs: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddMatchScreen;
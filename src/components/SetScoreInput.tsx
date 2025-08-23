import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Set } from '../types';

interface SetScoreInputProps {
  set: Set;
  setNumber: number;
  onSetChange: (set: Set) => void;
  onRemove?: () => void;
}

const SetScoreInput: React.FC<SetScoreInputProps> = ({
  set,
  setNumber,
  onSetChange,
  onRemove,
}) => {
  const updateTeam1Score = (score: string) => {
    const numericScore = parseInt(score) || 0;
    if (numericScore >= 0) {
      onSetChange({ ...set, team1: numericScore });
    }
  };

  const updateTeam2Score = (score: string) => {
    const numericScore = parseInt(score) || 0;
    if (numericScore >= 0) {
      onSetChange({ ...set, team2: numericScore });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.setTitle}>Set {setNumber}</Text>
        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.teamScore}>
          <Text style={styles.teamLabel}>Équipe 1</Text>
          <TextInput
            style={styles.scoreInput}
            value={set.team1.toString()}
            onChangeText={updateTeam1Score}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <Text style={styles.separator}>-</Text>

        <View style={styles.teamScore}>
          <Text style={styles.teamLabel}>Équipe 2</Text>
          <TextInput
            style={styles.scoreInput}
            value={set.team2.toString()}
            onChangeText={updateTeam2Score}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      {/* Affichage du résultat du set */}
      {(set.team1 > 0 || set.team2 > 0) && (
        <View style={styles.resultContainer}>
          <Text style={[
            styles.resultText,
            set.team1 > set.team2 ? styles.team1Winner : 
            set.team2 > set.team1 ? styles.team2Winner : 
            styles.tie
          ]}>
            {set.team1 > set.team2 ? 'Équipe 1 gagne' : 
             set.team2 > set.team1 ? 'Équipe 2 gagne' : 
             'Égalité'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  setTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  scoreInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    width: 60,
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  resultContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  team1Winner: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  team2Winner: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
  },
  tie: {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
});

export default SetScoreInput;
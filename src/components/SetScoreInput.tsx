import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <View style={styles.setTitleContainer}>
          <View style={styles.setNumberBadge}>
            <Text style={styles.setNumber}>{setNumber}</Text>
          </View>
          <Text style={styles.setTitle}>Set {setNumber}</Text>
        </View>
        {onRemove && (
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.teamScore}>
          <View style={styles.teamLabelContainer}>
            <View style={[styles.teamColorDot, { backgroundColor: '#1A73E8' }]} />
            <Text style={styles.teamLabel}>Équipe 1</Text>
          </View>
          <TextInput
            style={styles.scoreInput}
            value={set.team1.toString()}
            onChangeText={updateTeam1Score}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        <View style={styles.separatorContainer}>
          <Text style={styles.separator}>-</Text>
        </View>

        <View style={styles.teamScore}>
          <View style={styles.teamLabelContainer}>
            <View style={[styles.teamColorDot, { backgroundColor: '#7B1FA2' }]} />
            <Text style={styles.teamLabel}>Équipe 2</Text>
          </View>
          <TextInput
            style={styles.scoreInput}
            value={set.team2.toString()}
            onChangeText={updateTeam2Score}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#C7C7CC"
          />
        </View>
      </View>

      {/* Affichage du résultat du set */}
      {(set.team1 > 0 || set.team2 > 0) && (
        <View style={styles.resultContainer}>
          <View style={[
            styles.resultBadge,
            set.team1 > set.team2 ? styles.team1WinnerBadge : 
            set.team2 > set.team1 ? styles.team2WinnerBadge : 
            styles.tieBadge
          ]}>
            <Ionicons 
              name={set.team1 === set.team2 ? "remove" : "trophy"} 
              size={14} 
              color="#fff" 
            />
            <Text style={styles.resultText}>
              {set.team1 > set.team2 ? 'Équipe 1' : 
               set.team2 > set.team1 ? 'Équipe 2' : 
               'Égalité'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  setTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  setNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  setTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  teamColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  teamLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  scoreInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    width: 80,
    color: '#1D1D1F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  separatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    fontSize: 24,
    fontWeight: '800',
    color: '#8E8E93',
  },
  resultContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  team1WinnerBadge: {
    backgroundColor: '#1A73E8',
  },
  team2WinnerBadge: {
    backgroundColor: '#7B1FA2',
  },
  tieBadge: {
    backgroundColor: '#FF9500',
  },
});

export default SetScoreInput;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PositionSelectorProps {
  selectedPosition: 'left' | 'right' | null;
  onPositionSelect: (position: 'left' | 'right' | null) => void;
}

const PositionSelector: React.FC<PositionSelectorProps> = ({
  selectedPosition,
  onPositionSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Position sur le terrain</Text>
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedPosition === 'left' && styles.optionSelected
          ]}
          onPress={() => onPositionSelect(selectedPosition === 'left' ? null : 'left')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="arrow-back" 
            size={16} 
            color={selectedPosition === 'left' ? '#fff' : '#8E8E93'} 
          />
          <Text style={[
            styles.optionText,
            selectedPosition === 'left' && styles.optionTextSelected
          ]}>
            Gauche
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedPosition === 'right' && styles.optionSelected
          ]}
          onPress={() => onPositionSelect(selectedPosition === 'right' ? null : 'right')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="arrow-forward" 
            size={16} 
            color={selectedPosition === 'right' ? '#fff' : '#8E8E93'} 
          />
          <Text style={[
            styles.optionText,
            selectedPosition === 'right' && styles.optionTextSelected
          ]}>
            Droite
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  optionSelected: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  optionText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
});

export default PositionSelector;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
      <Text style={styles.label}>Position (optionnel)</Text>
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedPosition === 'left' && styles.optionSelected
          ]}
          onPress={() => onPositionSelect(selectedPosition === 'left' ? null : 'left')}
        >
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
        >
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
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
});

export default PositionSelector;
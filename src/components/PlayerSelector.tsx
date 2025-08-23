import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Player } from '../types';

interface PlayerSelectorProps {
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
  availablePlayers: Player[];
  placeholder: string;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  selectedPlayer,
  onPlayerSelect,
  availablePlayers,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player);
    setIsVisible(false);
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={styles.playerOption}
      onPress={() => handlePlayerSelect(item)}
    >
      <View>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerInfo}>
          Ranking: #{item.ranking} • {item.points} pts
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.selectorText,
          !selectedPlayer && styles.placeholderText
        ]}>
          {selectedPlayer ? selectedPlayer.name : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un joueur</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availablePlayers}
              renderItem={renderPlayer}
              keyExtractor={(item) => item.id}
              style={styles.playersList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  playersList: {
    maxHeight: 300,
  },
  playerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  playerInfo: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlayerSelector;
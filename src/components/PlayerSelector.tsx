import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      activeOpacity={0.7}
    >
      <View style={styles.playerAvatar}>
        <Text style={styles.playerInitials}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.playerDetails}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerInfo}>
          #{item.ranking} • {item.points} pts • {((item.matchesWon / item.matchesPlayed) * 100).toFixed(0)}% victoires
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedPlayer ? (
            <View style={styles.selectedPlayerContainer}>
              <View style={styles.selectedPlayerAvatar}>
                <Text style={styles.selectedPlayerInitials}>
                  {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View>
                <Text style={styles.selectorText}>{selectedPlayer.name}</Text>
                <Text style={styles.selectedPlayerInfo}>
                  #{selectedPlayer.ranking} • {selectedPlayer.points} pts
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#C7C7CC" />
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
              <Text style={styles.modalTitle}>Choisir un joueur</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#8E8E93" />
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
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  selectorContent: {
    flex: 1,
  },
  selectedPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedPlayerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPlayerInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  selectorText: {
    fontSize: 17,
    color: '#1D1D1F',
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedPlayerInfo: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 17,
    color: '#C7C7CC',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playersList: {
    maxHeight: 400,
  },
  playerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 12,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  playerInfo: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
});

export default PlayerSelector;
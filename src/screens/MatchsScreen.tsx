import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';

const MatchsScreen = () => {
  const navigation = useNavigation();
  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'ongoing':
        return '#FF9800';
      case 'scheduled':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: Match['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'ongoing':
        return 'En cours';
      case 'scheduled':
        return 'Programmé';
      default:
        return status;
    }
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
        <Text style={styles.time}>{item.time}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.matchDetails}>
        <Text style={styles.court}>{item.court}</Text>
        
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Équipe 1</Text>
            <Text style={styles.playerName}>{item.player1.name}</Text>
            <Text style={styles.playerName}>{item.player2.name}</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>
              {item.team1Score} - {item.team2Score}
            </Text>
          </View>
          
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Équipe 2</Text>
            <Text style={styles.playerName}>{item.player3.name}</Text>
            <Text style={styles.playerName}>{item.player4.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockMatches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bouton flottant pour ajouter un match */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddMatch')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  matchDetails: {
    gap: 12,
  },
  court: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  playerName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  scoreContainer: {
    paddingHorizontal: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MatchsScreen;
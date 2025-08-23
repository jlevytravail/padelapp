import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LinearGradient,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';

const MatchsScreen = () => {
  const navigation = useNavigation();
  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'ongoing':
        return '#FF9500';
      case 'scheduled':
        return '#1A73E8';
      default:
        return '#8E8E93';
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
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.7}>
      <View style={styles.matchHeader}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString('fr-FR')}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.matchDetails}>
        <View style={styles.courtContainer}>
          <Ionicons name="location" size={16} color="#8E8E93" />
          <Text style={styles.court}>{item.court}</Text>
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Équipe 1</Text>
            <View style={styles.playersContainer}>
              <Text style={styles.playerName}>{item.player1.name}</Text>
              <Text style={styles.playerName}>{item.player2.name}</Text>
            </View>
          </View>
          
          <View style={styles.scoreContainer}>
            {item.status === 'completed' ? (
              <View style={styles.finalScore}>
                <Text style={styles.score}>{item.team1Score} - {item.team2Score}</Text>
                <Text style={styles.setsLabel}>sets</Text>
              </View>
            ) : (
              <Text style={styles.scheduledText}>
                {item.status === 'ongoing' ? 'En cours' : 'À venir'}
              </Text>
            )}
          </View>
          
          <View style={styles.team}>
            <Text style={styles.teamTitle}>Équipe 2</Text>
            <View style={styles.playersContainer}>
              <Text style={styles.playerName}>{item.player3.name}</Text>
              <Text style={styles.playerName}>{item.player4.name}</Text>
            </View>
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
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flex: 1,
  },
  date: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  time: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  matchDetails: {
    gap: 16,
  },
  courtContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  court: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
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
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playersContainer: {
    alignItems: 'center',
    gap: 4,
  },
  playerName: {
    fontSize: 15,
    color: '#1D1D1F',
    fontWeight: '600',
  },
  scoreContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  finalScore: {
    alignItems: 'center',
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A73E8',
  },
  setsLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  scheduledText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
});

export default MatchsScreen;
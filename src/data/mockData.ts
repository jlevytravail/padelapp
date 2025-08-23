import { Player, Match, Stats } from '../types';

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Pierre Dubois',
    ranking: 1,
    points: 1250,
    matchesPlayed: 45,
    matchesWon: 38,
  },
  {
    id: '2', 
    name: 'Marie Laurent',
    ranking: 2,
    points: 1180,
    matchesPlayed: 42,
    matchesWon: 34,
  },
  {
    id: '3',
    name: 'Antoine Martin',
    ranking: 3,
    points: 1120,
    matchesPlayed: 40,
    matchesWon: 30,
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    ranking: 4,
    points: 1080,
    matchesPlayed: 38,
    matchesWon: 28,
  },
  {
    id: '5',
    name: 'Lucas Petit',
    ranking: 5,
    points: 1040,
    matchesPlayed: 36,
    matchesWon: 26,
  },
  {
    id: '6',
    name: 'Emma Moreau',
    ranking: 6,
    points: 1000,
    matchesPlayed: 35,
    matchesWon: 24,
  },
];

export let mockMatches: Match[] = [
  {
    id: '1',
    date: '2025-08-23',
    time: '18:30',
    player1: mockPlayers[0],
    player2: mockPlayers[1],
    player3: mockPlayers[2],
    player4: mockPlayers[3],
    team1Score: 6,
    team2Score: 3,
    sets: [
      { team1: 6, team2: 4 },
      { team1: 3, team2: 6 },
      { team1: 7, team2: 5 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  {
    id: '2',
    date: '2025-08-23',
    time: '20:00',
    player1: mockPlayers[4],
    player2: mockPlayers[5],
    player3: mockPlayers[0],
    player4: mockPlayers[2],
    team1Score: 0,
    team2Score: 0,
    sets: [],
    status: 'scheduled',
    court: 'Court 2',
  },
  {
    id: '3',
    date: '2025-08-24',
    time: '19:00',
    player1: mockPlayers[1],
    player2: mockPlayers[3],
    player3: mockPlayers[4],
    player4: mockPlayers[5],
    team1Score: 2,
    team2Score: 4,
    sets: [
      { team1: 6, team2: 2 },
      { team1: 4, team2: 6 },
      { team1: 5, team2: 7 },
      { team1: 3, team2: 6 }
    ],
    status: 'ongoing',
    court: 'Court 1',
  },
];

export const addMatch = (matchData: any) => {
  const { player1, player2, player3, player4, sets } = matchData;
  
  // Calculer les scores des équipes
  const team1Score = sets.reduce((acc: number, set: any) => {
    return acc + (set.team1 > set.team2 ? 1 : 0);
  }, 0);
  
  const team2Score = sets.reduce((acc: number, set: any) => {
    return acc + (set.team2 > set.team1 ? 1 : 0);
  }, 0);

  const newMatch: Match = {
    id: (mockMatches.length + 1).toString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    player1,
    player2,
    player3,
    player4,
    team1Score,
    team2Score,
    sets,
    status: 'completed',
    court: 'Court 1',
  };

  mockMatches.unshift(newMatch);
  return newMatch;
};

export const mockStats: Stats = {
  totalMatches: 32,
  wins: 24,
  losses: 8,
  winRate: 75,
  currentStreak: 5,
  bestStreak: 8,
  points: 1180,
  ranking: 2,
};
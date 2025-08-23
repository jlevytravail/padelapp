import { Player, Match, Stats } from '../types';
import { EloCalculator } from '../services/EloCalculator';

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Pierre Dubois',
    ranking: 1,
    points: 1250,
    elo: 10.00, // Le meilleur joueur
    matchesPlayed: 45,
    matchesWon: 38,
  },
  {
    id: '2', 
    name: 'Marie Laurent',
    ranking: 2,
    points: 1180,
    elo: 7.52, // EloCalculator.pointsToElo(1180)
    matchesPlayed: 42,
    matchesWon: 34,
  },
  {
    id: '3',
    name: 'Antoine Martin',
    ranking: 3,
    points: 1120,
    elo: 5.33, // EloCalculator.pointsToElo(1120)
    matchesPlayed: 40,
    matchesWon: 30,
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    ranking: 4,
    points: 1080,
    elo: 3.89, // EloCalculator.pointsToElo(1080)
    matchesPlayed: 38,
    matchesWon: 28,
  },
  {
    id: '5',
    name: 'Lucas Petit',
    ranking: 5,
    points: 1040,
    elo: 2.44, // EloCalculator.pointsToElo(1040)
    matchesPlayed: 36,
    matchesWon: 26,
  },
  {
    id: '6',
    name: 'Emma Moreau',
    ranking: 6,
    points: 1000,
    elo: 1.00, // EloCalculator.pointsToElo(1000)
    matchesPlayed: 35,
    matchesWon: 24,
  },
];

export let mockMatches: Match[] = [
  // Matchs récents (3 derniers jours)
  {
    id: '1',
    date: '2025-08-23',
    time: '18:30',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[0], // Pierre
    player3: mockPlayers[2], // Antoine 
    player4: mockPlayers[3], // Sophie
    team1Score: 2,
    team2Score: 1,
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
    player1: mockPlayers[4], // Lucas
    player2: mockPlayers[5], // Emma
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[2], // Antoine
    team1Score: 1,
    team2Score: 2,
    sets: [
      { team1: 4, team2: 6 },
      { team1: 6, team2: 3 },
      { team1: 5, team2: 7 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '3',
    date: '2025-08-22',
    time: '19:00',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[3], // Sophie
    player3: mockPlayers[4], // Lucas
    player4: mockPlayers[5], // Emma
    team1Score: 2,
    team2Score: 0,
    sets: [
      { team1: 6, team2: 2 },
      { team1: 6, team2: 4 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  // Semaine précédente
  {
    id: '4',
    date: '2025-08-21',
    time: '18:00',
    player1: mockPlayers[0], // Pierre
    player2: mockPlayers[2], // Antoine
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[4], // Lucas
    team1Score: 2,
    team2Score: 1,
    sets: [
      { team1: 6, team2: 4 },
      { team1: 4, team2: 6 },
      { team1: 6, team2: 3 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '5',
    date: '2025-08-20',
    time: '19:30',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[5], // Emma
    player3: mockPlayers[0], // Pierre
    player4: mockPlayers[3], // Sophie
    team1Score: 0,
    team2Score: 2,
    sets: [
      { team1: 3, team2: 6 },
      { team1: 4, team2: 6 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  {
    id: '6',
    date: '2025-08-19',
    time: '18:30',
    player1: mockPlayers[2], // Antoine
    player2: mockPlayers[4], // Lucas
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[5], // Emma
    team1Score: 1,
    team2Score: 2,
    sets: [
      { team1: 6, team2: 4 },
      { team1: 2, team2: 6 },
      { team1: 5, team2: 7 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '7',
    date: '2025-08-18',
    time: '17:00',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[0], // Pierre
    player3: mockPlayers[3], // Sophie
    player4: mockPlayers[4], // Lucas
    team1Score: 2,
    team2Score: 0,
    sets: [
      { team1: 6, team2: 3 },
      { team1: 6, team2: 4 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  // Il y a 2 semaines
  {
    id: '8',
    date: '2025-08-16',
    time: '19:00',
    player1: mockPlayers[3], // Sophie
    player2: mockPlayers[5], // Emma
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[0], // Pierre
    team1Score: 0,
    team2Score: 2,
    sets: [
      { team1: 2, team2: 6 },
      { team1: 4, team2: 6 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '9',
    date: '2025-08-15',
    time: '18:15',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[4], // Lucas
    player3: mockPlayers[2], // Antoine
    player4: mockPlayers[5], // Emma
    team1Score: 2,
    team2Score: 1,
    sets: [
      { team1: 4, team2: 6 },
      { team1: 6, team2: 3 },
      { team1: 6, team2: 4 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  {
    id: '10',
    date: '2025-08-14',
    time: '20:00',
    player1: mockPlayers[0], // Pierre
    player2: mockPlayers[3], // Sophie
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[2], // Antoine
    team1Score: 2,
    team2Score: 0,
    sets: [
      { team1: 6, team2: 4 },
      { team1: 6, team2: 2 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  // Matchs plus anciens (3-4 semaines)
  {
    id: '11',
    date: '2025-08-12',
    time: '19:30',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[2], // Antoine
    player3: mockPlayers[4], // Lucas
    player4: mockPlayers[0], // Pierre
    team1Score: 1,
    team2Score: 2,
    sets: [
      { team1: 6, team2: 4 },
      { team1: 3, team2: 6 },
      { team1: 4, team2: 6 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  {
    id: '12',
    date: '2025-08-10',
    time: '18:00',
    player1: mockPlayers[5], // Emma
    player2: mockPlayers[3], // Sophie
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[4], // Lucas
    team1Score: 0,
    team2Score: 2,
    sets: [
      { team1: 4, team2: 6 },
      { team1: 3, team2: 6 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '13',
    date: '2025-08-08',
    time: '17:30',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[0], // Pierre
    player3: mockPlayers[5], // Emma
    player4: mockPlayers[2], // Antoine
    team1Score: 2,
    team2Score: 1,
    sets: [
      { team1: 3, team2: 6 },
      { team1: 6, team2: 4 },
      { team1: 6, team2: 2 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  {
    id: '14',
    date: '2025-08-06',
    time: '19:00',
    player1: mockPlayers[3], // Sophie
    player2: mockPlayers[4], // Lucas
    player3: mockPlayers[1], // Marie (nous)
    player4: mockPlayers[5], // Emma
    team1Score: 1,
    team2Score: 2,
    sets: [
      { team1: 6, team2: 3 },
      { team1: 4, team2: 6 },
      { team1: 5, team2: 7 }
    ],
    status: 'completed',
    court: 'Court 2',
  },
  {
    id: '15',
    date: '2025-08-04',
    time: '18:45',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[3], // Sophie
    player3: mockPlayers[0], // Pierre
    player4: mockPlayers[4], // Lucas
    team1Score: 0,
    team2Score: 2,
    sets: [
      { team1: 4, team2: 6 },
      { team1: 2, team2: 6 }
    ],
    status: 'completed',
    court: 'Court 1',
  },
  // Match à venir (programmé)
  {
    id: '16',
    date: '2025-08-24',
    time: '19:00',
    player1: mockPlayers[1], // Marie (nous)
    player2: mockPlayers[2], // Antoine
    player3: mockPlayers[0], // Pierre
    player4: mockPlayers[5], // Emma
    team1Score: 0,
    team2Score: 0,
    sets: [],
    status: 'scheduled',
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

// Calculer les vraies stats de Marie sur les matchs
const getMarieStats = () => {
  // Marie est toujours mockPlayers[1] dans nos matchs
  const marieId = mockPlayers[1].id;
  const completedMatches = mockMatches.filter(m => m.status === 'completed');
  
  let wins = 0;
  let totalMatches = 0;
  
  completedMatches.forEach(match => {
    // Vérifier si Marie joue dans ce match
    const isTeam1 = match.player1.id === marieId || match.player2.id === marieId;
    const isTeam2 = match.player3.id === marieId || match.player4.id === marieId;
    
    if (isTeam1 || isTeam2) {
      totalMatches++;
      // Victoire si l'équipe de Marie a gagné
      if ((isTeam1 && match.team1Score > match.team2Score) ||
          (isTeam2 && match.team2Score > match.team1Score)) {
        wins++;
      }
    }
  });
  
  return { totalMatches, wins, losses: totalMatches - wins, winRate: Math.round((wins / totalMatches) * 100) };
};

const marieRealStats = getMarieStats();

export const mockStats: Stats = {
  totalMatches: marieRealStats.totalMatches,
  wins: marieRealStats.wins,
  losses: marieRealStats.losses,
  winRate: marieRealStats.winRate,
  currentStreak: 3, // Série actuelle sur les derniers matchs
  bestStreak: 4,    // Meilleure série de la saison
  points: 1180,
  elo: 7.52, // Elo actuel de Marie Laurent
  eloHistory: EloCalculator.generateEloHistory(7.52, 15), // Historique étendu à 15 matchs
  ranking: 2,
};
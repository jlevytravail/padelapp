export interface Player {
  id: string;
  name: string;
  ranking: number;
  points: number; // Ancien système, gardé pour compatibilité
  elo: number; // Nouveau système Elo (1.00 - 10.00)
  matchesPlayed: number;
  matchesWon: number;
  avatar?: string;
  position?: 'left' | 'right';
}

export interface Set {
  team1: number;
  team2: number;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  player1: Player;
  player2: Player;
  player3: Player;
  player4: Player;
  team1Score: number;
  team2Score: number;
  sets: Set[];
  status: 'scheduled' | 'ongoing' | 'completed';
  court: string;
}

export interface NewMatch {
  player1: Player | null;
  player2: Player | null;
  player3: Player | null;
  player4: Player | null;
  sets: Set[];
}

export interface Stats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  points: number;
  elo: number; // Elo actuel
  eloHistory: number[]; // Historique des 10 derniers Elos
  ranking: number;
}

export interface EloChange {
  playerId: string;
  oldElo: number;
  newElo: number;
  change: number; // Différence (+/-)
  reason: 'win' | 'loss';
}

export interface MatchResult {
  match: Match;
  eloChanges: EloChange[];
  team1Expected: number; // Probabilité de victoire prévue (0-1)
  team2Expected: number;
  upset?: boolean; // True si l'outsider a gagné
}
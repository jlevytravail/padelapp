export interface Player {
  id: string;
  name: string;
  ranking: number;
  points: number;
  matchesPlayed: number;
  matchesWon: number;
  avatar?: string;
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
  status: 'scheduled' | 'ongoing' | 'completed';
  court: string;
}

export interface Stats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  points: number;
  ranking: number;
}
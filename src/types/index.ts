export interface Player {
  id: string;
  name: string;
  ranking: number;
  points: number;
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
  ranking: number;
}
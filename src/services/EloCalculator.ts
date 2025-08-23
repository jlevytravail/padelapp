import { Player, EloChange, MatchResult, Match, Set } from '../types';

export class EloCalculator {
  private static readonly MIN_ELO = 1.00;
  private static readonly MAX_ELO = 10.00;
  private static readonly BASE_K_FACTOR = 0.3;

  /**
   * Convertit les anciens points (1000-1250) en Elo (1.00-10.00)
   */
  static pointsToElo(points: number): number {
    // Mapping linéaire: 1000pts = 1.00, 1250pts = 10.00
    const minPoints = 1000;
    const maxPoints = 1250;
    const elo = this.MIN_ELO + ((points - minPoints) / (maxPoints - minPoints)) * (this.MAX_ELO - this.MIN_ELO);
    return this.clampElo(elo);
  }

  /**
   * Calcule l'Elo moyen d'une équipe
   */
  static getTeamElo(player1: Player, player2: Player): number {
    return (player1.elo + player2.elo) / 2;
  }

  /**
   * Calcule la probabilité de victoire d'une équipe (formule Elo classique adaptée)
   */
  static getExpectedScore(teamElo: number, opponentElo: number): number {
    const eloDiff = opponentElo - teamElo;
    // Diviseur réduit (4 au lieu de 400) pour système borné 1-10
    return 1 / (1 + Math.pow(10, eloDiff / 4));
  }

  /**
   * Calcule le K-factor adaptatif basé sur la différence d'Elo
   */
  static getKFactor(eloDifference: number): number {
    const absDiff = Math.abs(eloDifference);
    
    if (absDiff < 1.0) return 0.2;  // Match équilibré
    if (absDiff < 2.0) return 0.3;  // Léger favori
    return 0.4;                     // Gros écart
  }

  /**
   * Détermine le résultat d'un match basé sur les sets
   */
  static getMatchWinner(sets: Set[]): 'team1' | 'team2' | 'draw' {
    const team1Wins = sets.reduce((acc, set) => acc + (set.team1 > set.team2 ? 1 : 0), 0);
    const team2Wins = sets.reduce((acc, set) => acc + (set.team2 > set.team1 ? 1 : 0), 0);
    
    if (team1Wins > team2Wins) return 'team1';
    if (team2Wins > team1Wins) return 'team2';
    return 'draw';
  }

  /**
   * Calcule les changements d'Elo pour un match
   */
  static calculateEloChanges(
    player1: Player, 
    player2: Player, 
    player3: Player, 
    player4: Player, 
    sets: Set[]
  ): EloChange[] {
    const team1Elo = this.getTeamElo(player1, player2);
    const team2Elo = this.getTeamElo(player3, player4);
    
    const team1Expected = this.getExpectedScore(team1Elo, team2Elo);
    const team2Expected = 1 - team1Expected;
    
    const matchResult = this.getMatchWinner(sets);
    
    // Résultat réel (1 = victoire, 0 = défaite, 0.5 = égalité)
    let team1Score: number;
    let team2Score: number;
    
    if (matchResult === 'team1') {
      team1Score = 1;
      team2Score = 0;
    } else if (matchResult === 'team2') {
      team1Score = 0;
      team2Score = 1;
    } else {
      team1Score = 0.5;
      team2Score = 0.5;
    }
    
    const eloDiff = Math.abs(team1Elo - team2Elo);
    const kFactor = this.getKFactor(eloDiff);
    
    // Calcul des changements d'Elo
    const team1Change = kFactor * (team1Score - team1Expected);
    const team2Change = kFactor * (team2Score - team2Expected);
    
    // Application aux joueurs individuels
    const changes: EloChange[] = [
      {
        playerId: player1.id,
        oldElo: player1.elo,
        newElo: this.clampElo(player1.elo + team1Change),
        change: team1Change,
        reason: team1Score > 0.5 ? 'win' : 'loss'
      },
      {
        playerId: player2.id,
        oldElo: player2.elo,
        newElo: this.clampElo(player2.elo + team1Change),
        change: team1Change,
        reason: team1Score > 0.5 ? 'win' : 'loss'
      },
      {
        playerId: player3.id,
        oldElo: player3.elo,
        newElo: this.clampElo(player3.elo + team2Change),
        change: team2Change,
        reason: team2Score > 0.5 ? 'win' : 'loss'
      },
      {
        playerId: player4.id,
        oldElo: player4.elo,
        newElo: this.clampElo(player4.elo + team2Change),
        change: team2Change,
        reason: team2Score > 0.5 ? 'win' : 'loss'
      }
    ];

    // Ajuster les changements finaux
    return changes.map(change => ({
      ...change,
      change: change.newElo - change.oldElo
    }));
  }

  /**
   * Crée un résultat de match complet avec analyse
   */
  static createMatchResult(
    player1: Player,
    player2: Player, 
    player3: Player,
    player4: Player,
    sets: Set[],
    match: Match
  ): MatchResult {
    const team1Elo = this.getTeamElo(player1, player2);
    const team2Elo = this.getTeamElo(player3, player4);
    
    const team1Expected = this.getExpectedScore(team1Elo, team2Elo);
    const team2Expected = 1 - team1Expected;
    
    const eloChanges = this.calculateEloChanges(player1, player2, player3, player4, sets);
    const matchWinner = this.getMatchWinner(sets);
    
    // Détection d'upset (outsider gagne)
    const isUpset = (matchWinner === 'team1' && team2Elo > team1Elo + 1.0) ||
                    (matchWinner === 'team2' && team1Elo > team2Elo + 1.0);
    
    return {
      match,
      eloChanges,
      team1Expected,
      team2Expected,
      upset: isUpset
    };
  }

  /**
   * Applique les changements d'Elo aux joueurs (mutation)
   */
  static applyEloChanges(players: Player[], eloChanges: EloChange[]): void {
    eloChanges.forEach(change => {
      const player = players.find(p => p.id === change.playerId);
      if (player) {
        player.elo = change.newElo;
        
        // Mise à jour du classement basé sur Elo
        player.points = Math.round((change.newElo - this.MIN_ELO) / (this.MAX_ELO - this.MIN_ELO) * 250 + 1000);
      }
    });
    
    // Recalcul du ranking
    this.updateRankings(players);
  }

  /**
   * Met à jour les rankings basés sur l'Elo
   */
  static updateRankings(players: Player[]): void {
    players.sort((a, b) => b.elo - a.elo);
    players.forEach((player, index) => {
      player.ranking = index + 1;
    });
  }

  /**
   * Simule un match sans l'appliquer
   */
  static simulateMatch(
    player1: Player,
    player2: Player,
    player3: Player, 
    player4: Player,
    sets: Set[]
  ): EloChange[] {
    return this.calculateEloChanges(player1, player2, player3, player4, sets);
  }

  /**
   * Formate un changement d'Elo pour l'affichage
   */
  static formatEloChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  }

  /**
   * Détermine la couleur d'un changement d'Elo
   */
  static getEloChangeColor(change: number): string {
    if (change > 0.2) return '#4CAF50';  // Vert pour gros gain
    if (change > 0) return '#8BC34A';    // Vert clair pour petit gain  
    if (change > -0.2) return '#FF9800'; // Orange pour petite perte
    return '#F44336';                    // Rouge pour grosse perte
  }

  /**
   * Borne l'Elo entre MIN_ELO et MAX_ELO
   */
  private static clampElo(elo: number): number {
    return Math.max(this.MIN_ELO, Math.min(this.MAX_ELO, elo));
  }

  /**
   * Génère un historique d'Elo fictif pour un joueur
   */
  static generateEloHistory(currentElo: number, matchCount: number = 10): number[] {
    const history = [];
    let elo = currentElo;
    
    for (let i = matchCount - 1; i >= 0; i--) {
      // Variation aléatoire mais cohérente
      const variation = (Math.random() - 0.5) * 0.6; // ±0.3 max
      elo = this.clampElo(elo - variation);
      history.unshift(elo);
    }
    
    return history;
  }
}
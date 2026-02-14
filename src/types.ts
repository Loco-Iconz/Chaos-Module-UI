/**
 * Type definitions for Chaos Module
 */

export interface Game {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  chaosScore: number;
  collapseRisk: number;
}

export interface ChaosData {
  games: Game[];
}

export interface LiveEvent {
  id: string;
  league: 'ESPN' | 'NFL' | 'NBA' | 'NCAA';
  title: string;
  timestamp: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

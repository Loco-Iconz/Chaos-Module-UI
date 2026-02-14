/**
 * Type definitions for Chaos Module
 */

// =========================
// TEAM PROFILE
// =========================
export interface TeamProfile {
  teamId: string;
  teamName: string;

  // Archetypes
  isOma: boolean;        // One Man Army
  isScrubs: boolean;     // Can't hold leads
  isStepperz: boolean;   // Blowout + over-smash
  isHeadaches: boolean;  // Slowdown + fake comebacks
  isBricksquad: boolean; // Poor shooting floor
  isHitterz: boolean;    // Good shooting floor
  isFortified: boolean;  // Comeback from +15

  // Home/Away performance
  homeRating: number;    // 0–100
  awayRating: number;    // 0–100

  // Recent form
  last3Grade: "elite" | "mid" | "trash";

  // Quarter grades
  q1Grade: "elite" | "mid" | "trash";
  q2Grade: "elite" | "mid" | "trash";
  q3Grade: "elite" | "mid" | "trash";
  q4Grade: "elite" | "mid" | "trash";

  // Risk factors
  foulRate: number;      // fouls per 100 possessions
  turnoverRate: number;  // turnovers per 100 possessions
}

// =========================
// GAME TYPE
// =========================
export interface Game {
  gameId: string;

  homeTeam: string;
  awayTeam: string;

  homeScore: number;
  awayScore: number;

  chaosScore: number;       // 0–100
  collapseRisk: number;     // 0–100

  pace: number;             // possessions per 48
  momentum: number;         // -100 to +100
  quarter: number;          // 1–4
  timeRemaining: string;    // "5:32", "0:45", etc.

  // Optional: live feed events
  events?: string[];

  // Optional: team profiles
  homeProfile?: TeamProfile;
  awayProfile?: TeamProfile;
}

// =========================
// CHAOS TICKET REQUEST
// =========================
export interface ChaosTicketRequest {
  gameId: number;
  houseTotal: number;
  houseSpread: number;
  pickSide: "home" | "away";
  pickType: "spread" | "ml" | "total";
}

// =========================
// CHAOS TICKET RESPONSE
// =========================
export interface TotalBand {
  low: [number, number];
  mid: [number, number];
  high: [number, number];
  insane: [number, number];
}

export interface SpreadBand {
  min: number;
  max: number;
}

export interface ChaosTicketResponse {
  success: boolean;

  chaosScore: number;
  collapseRisk: number;
  flopRisk: number;

  totalBand: TotalBand;
  spreadBand: SpreadBand;

  tags: string[];
  notes: string[];
}

// =========================
// AUXILIARY TYPES
// =========================
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

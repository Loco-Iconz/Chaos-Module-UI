/**
 * Chaos Engine Math
 * Real computational formulas for chaos scores, collapse risk, and betting bands
 */

import type { TeamProfile, TotalBand, SpreadBand, ChaosTicketResponse, Game } from '../types';

/**
 * Compute Flop Meter - Late-game meltdown predictor
 * 
 * Measures the risk of a team falling apart or flopping in crucial moments
 * based on fatigue, pace, bench strength, and momentum.
 */
export function computeFlopMeter(
  home: TeamProfile,
  away: TeamProfile,
  game: Game
): number {
  let risk = 0;

  // Pace collapse - slower pace = more tired, more prone to mistakes
  if (game.pace < 92) risk += 10;

  // Star fatigue (OMA teams) - one man army wears down
  if (home.isOma) risk += 8;
  if (away.isOma) risk += 8;

  // Bench scoring drop (Headaches) - can't maintain lead when bench goes cold
  if (home.isHeadaches) risk += 12;
  if (away.isHeadaches) risk += 12;

  // Turnover spike - fatigue causes loose handles
  risk += (home.turnoverRate + away.turnoverRate) / 4;

  // Foul trouble - tired players foul more
  risk += (home.foulRate + away.foulRate) / 4;

  // Momentum swing - large momentum shifts predict collapses
  if (Math.abs(game.momentum) > 40) risk += 10;

  return Math.min(100, Math.max(0, risk));
}

// =========================
// CHAOS ENGINE MATH
// =========================

export function computeChaosScore(home: TeamProfile, away: TeamProfile): number {
  let score = 0;

  // Volatility archetypes
  if (home.isStepperz) score += 15;
  if (away.isStepperz) score += 15;

  if (home.isOma) score += 10;
  if (away.isOma) score += 10;

  if (home.isHeadaches) score += 12;
  if (away.isHeadaches) score += 12;

  // Shooting volatility
  if (home.isBricksquad) score += 8;
  if (away.isBricksquad) score += 8;

  if (home.isHitterz) score -= 5;
  if (away.isHitterz) score -= 5;

  // Recent form
  const gradeMap = { elite: -5, mid: 0, trash: 10 };
  score += gradeMap[home.last3Grade];
  score += gradeMap[away.last3Grade];

  // Quarter volatility
  const qMap = { elite: -3, mid: 0, trash: 5 };
  score += qMap[home.q4Grade];
  score += qMap[away.q4Grade];

  // Risk factors
  score += (home.turnoverRate + away.turnoverRate) / 4;
  score += (home.foulRate + away.foulRate) / 4;

  return Math.min(100, Math.max(0, score));
}

export function computeCollapseRisk(home: TeamProfile, away: TeamProfile): number {
  let risk = 0;

  if (home.isScrubs) risk += 20;
  if (away.isScrubs) risk += 20;

  if (home.isHeadaches) risk += 15;
  if (away.isHeadaches) risk += 15;

  if (away.isFortified) risk += 10; // comeback threat
  if (home.isFortified) risk += 10;

  risk += (home.turnoverRate + away.turnoverRate) / 5;

  return Math.min(100, Math.max(0, risk));
}

export function computeTotalBand(houseTotal: number, chaosScore: number): TotalBand {
  const chaosFactor = chaosScore / 10;

  return {
    low: [houseTotal - (8 + chaosFactor), houseTotal - (4 + chaosFactor)],
    mid: [houseTotal - 3, houseTotal + 3],
    high: [houseTotal + (4 + chaosFactor), houseTotal + (10 + chaosFactor)],
    insane: [houseTotal + (11 + chaosFactor), houseTotal + (22 + chaosFactor)]
  };
}

export function computeSpreadBand(houseSpread: number, home: TeamProfile, away: TeamProfile): SpreadBand {
  let min = houseSpread;
  let max = houseSpread;

  if (home.isScrubs) max += 6;
  if (away.isScrubs) min -= 6;

  if (home.isStepperz) min -= 4;
  if (away.isStepperz) max += 4;

  if (home.isFortified) min -= 3;
  if (away.isFortified) max += 3;

  return { min, max };
}

// =========================
// FULL HOUSE-BAIT ENDPOINT
// =========================

/**
 * Compute House-Bait chaos ticket response
 * 
 * This is the full client-side Chaos Engine function that mirrors the backend.
 * Can be used for testing/demo or offloading computation from backend.
 */
export function computeHouseBait(
  game: Game,
  home: TeamProfile,
  away: TeamProfile,
  payload: {
    houseTotal: number;
    houseSpread: number;
    pickSide: string;
    pickType: "spread" | "ml" | "total";
  }
): ChaosTicketResponse {

  const chaosScore = computeChaosScore(home, away);
  const collapseRisk = computeCollapseRisk(home, away);
  const flopRisk = computeFlopMeter(home, away, game);

  const totalBand = computeTotalBand(payload.houseTotal, chaosScore);
  const spreadBand = computeSpreadBand(payload.houseSpread, home, away);

  // Extract home team archetypes as tags
  const tags = [
    home.isStepperz && "Stepperz",
    home.isScrubs && "Scrubs",
    home.isHeadaches && "Headaches",
    home.isFortified && "Fortified",
    home.isOma && "OMA",
    home.isBricksquad && "Bricksquad",
    home.isHitterz && "Hitterz-Ballerz"
  ].filter(Boolean) as string[];

  // Map tags to human-readable notes
  const notes = tags.map(tag => {
    switch (tag) {
      case "Stepperz": return "Stepperz team: blowout + over-smash risk";
      case "Scrubs": return "Scrubs team: cannot hold leads, fake safety risk";
      case "Headaches": return "Headaches team: slowdown + fake comebacks";
      case "Fortified": return "Fortified: comeback equity from +15";
      case "OMA": return "One Man Army: high volatility when star sits";
      case "Bricksquad": return "Bricksquad: low shooting floor, drought risk";
      case "Hitterz-Ballerz": return "Hitterz-Ballerz: stable shooting floor";
      default: return "";
    }
  }).filter(Boolean);

  return {
    success: true,
    chaosScore,
    collapseRisk,
    flopRisk,
    totalBand,
    spreadBand,
    tags,
    notes
  };
}

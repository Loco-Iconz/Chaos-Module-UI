"""
Chaos Engine Math Module
Real computational formulas for chaos scores, collapse risk, and betting bands.
This is the production Chaos Engine used by the /chaos-ticket endpoint.
"""

from typing import Tuple, Dict, Any
from pydantic import BaseModel


# =========================
# CHAOS ENGINE MATH
# =========================

def compute_chaos_score(home: Dict[str, Any], away: Dict[str, Any]) -> float:
    """
    Compute chaos score based on team archetypes, form, and risk factors.
    
    Args:
        home: Home team profile dict
        away: Away team profile dict
    
    Returns:
        Chaos score 0-100
    """
    score = 0.0

    # Volatility archetypes
    if home.get("isStepperz", False):
        score += 15
    if away.get("isStepperz", False):
        score += 15

    if home.get("isOma", False):
        score += 10
    if away.get("isOma", False):
        score += 10

    if home.get("isHeadaches", False):
        score += 12
    if away.get("isHeadaches", False):
        score += 12

    # Shooting volatility
    if home.get("isBricksquad", False):
        score += 8
    if away.get("isBricksquad", False):
        score += 8

    if home.get("isHitterz", False):
        score -= 5
    if away.get("isHitterz", False):
        score -= 5

    # Recent form
    grade_map = {"elite": -5, "mid": 0, "trash": 10}
    home_last3 = home.get("last3Grade", "mid")
    away_last3 = away.get("last3Grade", "mid")
    score += grade_map.get(home_last3, 0)
    score += grade_map.get(away_last3, 0)

    # Quarter volatility
    q_map = {"elite": -3, "mid": 0, "trash": 5}
    home_q4 = home.get("q4Grade", "mid")
    away_q4 = away.get("q4Grade", "mid")
    score += q_map.get(home_q4, 0)
    score += q_map.get(away_q4, 0)

    # Risk factors
    home_turnovers = home.get("turnoverRate", 0)
    away_turnovers = away.get("turnoverRate", 0)
    home_fouls = home.get("foulRate", 0)
    away_fouls = away.get("foulRate", 0)
    
    score += (home_turnovers + away_turnovers) / 4
    score += (home_fouls + away_fouls) / 4

    return min(100, max(0, score))


def compute_collapse_risk(home: Dict[str, Any], away: Dict[str, Any]) -> float:
    """
    Compute collapse risk based on team volatility and comebacks.
    
    Args:
        home: Home team profile dict
        away: Away team profile dict
    
    Returns:
        Collapse risk 0-100
    """
    risk = 0.0

    if home.get("isScrubs", False):
        risk += 20
    if away.get("isScrubs", False):
        risk += 20

    if home.get("isHeadaches", False):
        risk += 15
    if away.get("isHeadaches", False):
        risk += 15

    if away.get("isFortified", False):
        risk += 10  # comeback threat
    if home.get("isFortified", False):
        risk += 10

    home_turnovers = home.get("turnoverRate", 0)
    away_turnovers = away.get("turnoverRate", 0)
    risk += (home_turnovers + away_turnovers) / 5

    return min(100, max(0, risk))


def compute_flop_meter(home: Dict[str, Any], away: Dict[str, Any], game: Dict[str, Any]) -> float:
    """
    Compute late-game meltdown risk based on pace, fatigue, turnovers, fouls, and momentum.
    
    Args:
        home: Home team profile dict
        away: Away team profile dict
        game: Game state dict with pace, momentum, quarter, timeRemaining
    
    Returns:
        Flop risk 0-100 (late-game meltdown predictor)
    """
    risk = 0.0

    # Pace collapse detection
    pace = game.get("pace", 96)
    if pace < 92:
        risk += 15

    # Star fatigue for OMA teams
    if home.get("isOma", False) or away.get("isOma", False):
        risk += 8

    # Bench scoring drop for Headaches teams
    if home.get("isHeadaches", False) or away.get("isHeadaches", False):
        risk += 12

    # Turnover spike indicates fatigue-driven issues
    home_turnovers = home.get("turnoverRate", 0)
    away_turnovers = away.get("turnoverRate", 0)
    risk += (home_turnovers + away_turnovers) / 4

    # Foul trouble in final quarter
    home_fouls = home.get("foulRate", 0)
    away_fouls = away.get("foulRate", 0)
    risk += (home_fouls + away_fouls) / 4

    # Momentum swing detection
    momentum = game.get("momentum", 0)
    if abs(momentum) > 40:
        risk += 10

    return min(100, max(0, risk))


def compute_total_band(house_total: float, chaos_score: float) -> Dict[str, Tuple[float, float]]:
    """
    Compute total band ranges based on house total and chaos score.
    Higher chaos = wider bands.
    
    Args:
        house_total: House-Bait Total value
        chaos_score: Computed chaos score 0-100
    
    Returns:
        Dict with low, mid, high, insane band ranges as tuples
    """
    chaos_factor = chaos_score / 10

    return {
        "low": (house_total - (8 + chaos_factor), house_total - (4 + chaos_factor)),
        "mid": (house_total - 3, house_total + 3),
        "high": (house_total + (4 + chaos_factor), house_total + (10 + chaos_factor)),
        "insane": (house_total + (11 + chaos_factor), house_total + (22 + chaos_factor))
    }


def compute_spread_band(house_spread: float, home: Dict[str, Any], away: Dict[str, Any]) -> Dict[str, float]:
    """
    Compute spread band ranges based on team archetypes.
    Scrubs widen the spread, Stepperz tighten towards their side, etc.
    
    Args:
        house_spread: House-Bait Spread value
        home: Home team profile dict
        away: Away team profile dict
    
    Returns:
        Dict with min and max spread values
    """
    min_val = house_spread
    max_val = house_spread

    if home.get("isScrubs", False):
        max_val += 6
    if away.get("isScrubs", False):
        min_val -= 6

    if home.get("isStepperz", False):
        min_val -= 4
    if away.get("isStepperz", False):
        max_val += 4

    if home.get("isFortified", False):
        min_val -= 3
    if away.get("isFortified", False):
        max_val += 3

    return {"min": min_val, "max": max_val}


def generate_tags(home: Dict[str, Any], away: Dict[str, Any], chaos_score: float, collapse_risk: float) -> list[str]:
    """
    Generate archetype tags based on team profiles and computed metrics.
    
    Args:
        home: Home team profile dict
        away: Away team profile dict
        chaos_score: Computed chaos score
        collapse_risk: Computed collapse risk
    
    Returns:
        List of archetype tags
    """
    tags = []

    # Check both teams for archetypes
    for team in [home, away]:
        if team.get("isStepperz", False) and "Stepperz" not in tags:
            tags.append("Stepperz")
        if team.get("isScrubs", False) and "Scrubs" not in tags:
            tags.append("Scrubs")
        if team.get("isHeadaches", False) and "Headaches" not in tags:
            tags.append("Headaches")
        if team.get("isFortified", False) and "Fortified" not in tags:
            tags.append("Fortified")
        if team.get("isOma", False) and "OMA" not in tags:
            tags.append("OMA")
        if team.get("isBricksquad", False) and "Bricksquad" not in tags:
            tags.append("Bricksquad")
        if team.get("isHitterz", False) and "Hitterz-Ballerz" not in tags:
            tags.append("Hitterz-Ballerz")

    return tags


def generate_notes(tags: list[str]) -> list[str]:
    """
    Generate human-readable edge notes from archetype tags.
    
    Args:
        tags: List of archetype tags
    
    Returns:
        List of human-readable notes
    """
    note_map = {
        "Stepperz": "Stepperz team detected: blowout + over-smash risk",
        "Scrubs": "Scrubs team: cannot hold leads, fake safety risk",
        "Headaches": "Headaches team: slows down when up, allows fake comebacks",
        "Fortified": "Fortified team: real comeback equity from +15",
        "OMA": "One Man Army: high volatility when star sits",
        "Bricksquad": "Bricksquad: low shooting floor, drought risk",
        "Hitterz-Ballerz": "Hitterz-Ballerz: stable shooting floor"
    }
    
    return [note_map[tag] for tag in tags if tag in note_map]

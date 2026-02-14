from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Tuple, Optional, Dict, Any
from chaos_engine import (
    compute_chaos_score,
    compute_collapse_risk,
    compute_flop_meter,
    compute_total_band,
    compute_spread_band,
    generate_tags,
    generate_notes
)

app = FastAPI(title="Chaos Module Backend")


class TeamProfile(BaseModel):
    teamId: str
    teamName: str
    
    isOma: bool = False
    isScrubs: bool = False
    isStepperz: bool = False
    isHeadaches: bool = False
    isBricksquad: bool = False
    isHitterz: bool = False
    isFortified: bool = False
    
    homeRating: float = 50
    awayRating: float = 50
    
    last3Grade: str = "mid"  # elite | mid | trash
    
    q1Grade: str = "mid"
    q2Grade: str = "mid"
    q3Grade: str = "mid"
    q4Grade: str = "mid"
    
    foulRate: float = 15
    turnoverRate: float = 14


class ChaosTicket(BaseModel):
    gameId: int
    houseTotal: float
    houseSpread: float
    pickSide: str  # home/away
    pickType: str  # spread/ml/total
    
    # Optional: team profiles for real Chaos Engine computation
    homeTeam: Optional[TeamProfile] = None
    awayTeam: Optional[TeamProfile] = None


class TotalBand(BaseModel):
    low: Tuple[float, float]
    mid: Tuple[float, float]
    high: Tuple[float, float]
    insane: Tuple[float, float]


class SpreadBand(BaseModel):
    min: float
    max: float


class ChaosTicketResponse(BaseModel):
    success: bool
    chaosScore: float
    collapseRisk: float
    flopRisk: float
    totalBand: TotalBand
    spreadBand: SpreadBand
    tags: list[str]
    notes: list[str]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/health")
def health():
    """Simple health check endpoint"""
    return {"status": "ok"}


@app.get("/chaos")
def chaos():
    """Get chaos module data with mock game data"""
    return [
        {
            "gameId": 1,
            "homeTeam": "Team A",
            "awayTeam": "Team B",
            "homeScore": 72,
            "awayScore": 68,
            "chaosScore": 54.3,
            "collapseRisk": 22.1
        },
        {
            "gameId": 2,
            "homeTeam": "Team C",
            "awayTeam": "Team D",
            "homeScore": 81,
            "awayScore": 79,
            "chaosScore": 71.8,
            "collapseRisk": 44.9
        }
    ]


@app.get("/api/health")
async def health_check():
    """Health check endpoint to test backend connection"""
    return {
        "status": "healthy",
        "message": "FastAPI backend is running!"
    }


@app.get("/api/chaos")
async def get_chaos_data():
    """Get chaos module data"""
    return {
        "chaos_id": "CM-001",
        "name": "Chaos Module",
        "status": "active",
        "timestamp": "2026-02-14T20:37:00Z"
    }


@app.post("/api/chaos/test")
async def test_chaos(test_data: dict):
    """Test chaos module with provided data"""
    return {
        "test_id": "TEST-001",
        "input": test_data,
        "result": "Test executed successfully",
        "timestamp": "2026-02-14T20:37:00Z"
    }


@app.post("/chaos-ticket")
async def create_chaos_ticket(ticket: ChaosTicket) -> ChaosTicketResponse:
    """
    FULL CHAOS ENGINE ENDPOINT: /chaos-ticket
    
    Computes real chaos scores, collapse risk, and betting bands using Chaos Engine math.
    
    Parameters:
    - gameId: The ID of the game
    - houseTotal: The House-Bait Total value
    - houseSpread: The House-Bait Spread value
    - pickSide: The picked side (home/away)
    - pickType: The pick type (spread/ml/total)
    - homeTeam (optional): Home team profile for Chaos Engine computation
    - awayTeam (optional): Away team profile for Chaos Engine computation
    
    Returns: ChaosTicketResponse with real chaos metrics and betting bands
    """
    
    # Use provided team profiles or create defaults
    if ticket.homeTeam and ticket.awayTeam:
        home_profile = ticket.homeTeam.dict()
        away_profile = ticket.awayTeam.dict()
    else:
        # Default profiles for demo/testing
        home_profile = {
            "teamId": f"home_{ticket.gameId}",
            "teamName": "Home Team",
            "isOma": False,
            "isScrubs": False,
            "isStepperz": False,
            "isHeadaches": False,
            "isBricksquad": False,
            "isHitterz": True,
            "isFortified": False,
            "homeRating": 65,
            "awayRating": 45,
            "last3Grade": "mid",
            "q1Grade": "mid",
            "q2Grade": "mid",
            "q3Grade": "elite",
            "q4Grade": "mid",
            "foulRate": 14.0,
            "turnoverRate": 12.0
        }
        away_profile = {
            "teamId": f"away_{ticket.gameId}",
            "teamName": "Away Team",
            "isOma": False,
            "isScrubs": False,
            "isStepperz": False,
            "isHeadaches": False,
            "isBricksquad": False,
            "isHitterz": False,
            "isFortified": False,
            "homeRating": 40,
            "awayRating": 60,
            "last3Grade": "mid",
            "q1Grade": "mid",
            "q2Grade": "mid",
            "q3Grade": "mid",
            "q4Grade": "trash",
            "foulRate": 16.0,
            "turnoverRate": 15.0
        }
    
    # --- COMPUTE CHAOS SCORE & COLLAPSE RISK ---
    chaos_score = compute_chaos_score(home_profile, away_profile)
    collapse_risk = compute_collapse_risk(home_profile, away_profile)
    
    # --- CREATE GAME STATE FOR FLOP METER ---
    game_state = {
        "pace": 96,  # Default pace value
        "momentum": 0,  # Default momentum
        "quarter": 4,
        "timeRemaining": 0
    }
    flop_risk = compute_flop_meter(home_profile, away_profile, game_state)
    
    # --- COMPUTE BETTING BANDS ---
    total_band_dict = compute_total_band(ticket.houseTotal, chaos_score)
    spread_band_dict = compute_spread_band(ticket.houseSpread, home_profile, away_profile)
    
    # --- GENERATE TAGS (from home team archetypes) ---
    tags = [
        "Stepperz" if home_profile.get("isStepperz") else None,
        "Scrubs" if home_profile.get("isScrubs") else None,
        "Headaches" if home_profile.get("isHeadaches") else None,
        "Fortified" if home_profile.get("isFortified") else None,
        "OMA" if home_profile.get("isOma") else None,
        "Bricksquad" if home_profile.get("isBricksquad") else None,
        "Hitterz-Ballerz" if home_profile.get("isHitterz") else None,
    ]
    tags = [tag for tag in tags if tag is not None]
    
    # --- GENERATE NOTES (mapped from tags) ---
    note_map = {
        "Stepperz": "Stepperz team: blowout + over-smash risk",
        "Scrubs": "Scrubs team: cannot hold leads, fake safety risk",
        "Headaches": "Headaches team: slowdown + fake comebacks",
        "Fortified": "Fortified: comeback equity from +15",
        "OMA": "One Man Army: high volatility when star sits",
        "Bricksquad": "Bricksquad: low shooting floor, drought risk",
        "Hitterz-Ballerz": "Hitterz-Ballerz: stable shooting floor"
    }
    notes = [note_map[tag] for tag in tags if tag in note_map]
    
    # --- BUILD RESPONSE ---
    total_band = TotalBand(
        low=total_band_dict["low"],
        mid=total_band_dict["mid"],
        high=total_band_dict["high"],
        insane=total_band_dict["insane"]
    )
    
    spread_band = SpreadBand(
        min=spread_band_dict["min"],
        max=spread_band_dict["max"]
    )
    
    return ChaosTicketResponse(
        success=True,
        chaosScore=chaos_score,
        collapseRisk=collapse_risk,
        flopRisk=flop_risk,
        totalBand=total_band,
        spreadBand=spread_band,
        tags=tags,
        notes=notes
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

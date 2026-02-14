from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chaos Module Backend")

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

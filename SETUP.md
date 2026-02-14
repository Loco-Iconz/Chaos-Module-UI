# Chaos Module UI - Setup Guide

This project contains a TypeScript/Vite frontend that communicates with a FastAPI backend.

## Project Structure

```
├── src/                    # Frontend source code (TypeScript)
│   ├── main.ts            # Main UI entry point
│   ├── api.ts             # API client for backend communication
│   ├── counter.ts         # Counter component
│   └── style.css          # Styles
├── backend/
│   ├── main.py            # FastAPI backend with CORS enabled
│   └── requirements.txt    # Python dependencies
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## Setup

### 1. Frontend Setup (Vite + TypeScript)

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The UI will be available at `http://localhost:5173`

### 2. Backend Setup (FastAPI)

Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
# or
python -m pip install -r requirements.txt
```

Start the FastAPI server:
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

You can view the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing the Connection

1. **Start both servers** (in separate terminals):
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend && python main.py
   ```

2. **Test in the UI**:
   - Open `http://localhost:5173` in your browser
   - Click **"Test Backend Connection"** to verify the backend is running
   - Click **"Fetch Chaos Data"** to retrieve data from the backend
   - Click **"Run Chaos Test"** to execute a test on the backend

## CORS Configuration

The FastAPI backend includes CORS middleware configured in `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This allows the frontend (running on a different port) to communicate with the backend.

### Production CORS Settings

For production, update the `allow_origins` setting:

```python
allow_origins=[
    "https://yourdomain.com",
    "https://app.yourdomain.com",
]
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/chaos` - Get chaos module data
- `POST /api/chaos/test` - Run a test on the chaos module

## Development

### Build for Production

```bash
npm run build
```

This will create an optimized build in the `dist/` directory.

### Backend Development

The FastAPI backend uses:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- Built-in CORS middleware for cross-origin requests

## Troubleshooting

### "Failed to fetch from backend"
- Ensure the backend is running on `http://localhost:8000`
- Check that CORS is properly configured in `backend/main.py`
- Open browser DevTools (F12) to see network errors

### CORS Error in Console
- Verify the backend CORS middleware is configured
- Make sure both frontend and backend are running
- Check that the API URLs match between frontend and backend

### Port Already in Use
- Frontend (5173): `npm run dev -- --port 3000` to use a different port
- Backend (8000): `python main.py` and update the port in `src/api.ts`

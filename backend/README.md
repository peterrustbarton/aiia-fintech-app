
# AiiA FastAPI Backend

## Overview
FastAPI backend for **AiiA - Artificially Intelligent Investment Assistant** providing RESTful API endpoints for the fintech application.

## Features
- **SQLAlchemy ORM**: Database models matching PostgreSQL schema
- **Pydantic Validation**: Request/response data validation  
- **CORS Support**: Frontend integration ready
- **Mock Data**: Automatic score generation for missing data
- **Basic Error Handling**: HTTP status codes and error messages

## Project Structure
```
backend/
├── app/
│   ├── models/           # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── security.py
│   │   ├── score.py
│   │   ├── watchlist.py
│   │   └── watchlist_item.py
│   ├── schemas/          # Pydantic validation schemas
│   │   ├── user.py
│   │   ├── security.py
│   │   ├── score.py
│   │   ├── watchlist.py
│   │   └── watchlist_item.py
│   ├── api/             # API route handlers
│   │   ├── securities.py
│   │   └── watchlists.py
│   ├── database.py      # Database connection setup
│   └── main.py          # FastAPI application
├── requirements.txt     # Python dependencies
├── .env                # Environment variables
└── README.md           # This file
```

## API Endpoints

### Securities
- `GET /api/securities` - List all securities with scores
- `GET /api/securities/{symbol}` - Get single security with latest score

### Watchlists  
- `GET /api/users/{user_id}/watchlists` - Get user's watchlists
- `POST /api/users/{user_id}/watchlists` - Create new watchlist
- `POST /api/watchlists/{watchlist_id}/items` - Add security to watchlist
- `DELETE /api/watchlists/{watchlist_id}/items/{symbol}` - Remove from watchlist

### System
- `GET /` - API information
- `GET /health` - Health check

## Installation & Setup

### 1. Install Dependencies
```bash
cd /home/ubuntu/aiia_mvp/backend
pip install -r requirements.txt
```

### 2. Environment Setup
The `.env` file is already configured with the PostgreSQL connection.

### 3. Run the Server
```bash
cd /home/ubuntu/aiia_mvp/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing Endpoints

### Get All Securities
```bash
curl http://localhost:8000/api/securities
```

### Get Single Security
```bash
curl http://localhost:8000/api/securities/AAPL
```

### Get User Watchlists
```bash
curl http://localhost:8000/api/users/1/watchlists
```

### Create Watchlist
```bash
curl -X POST http://localhost:8000/api/users/1/watchlists \
  -H "Content-Type: application/json" \
  -d '{"name": "My Portfolio"}'
```

### Add to Watchlist
```bash
curl -X POST http://localhost:8000/api/watchlists/1/items \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL"}'
```

## Mock Data Features
- Securities without scores automatically get mock scores (60-95 range)
- Mock factor breakdowns with realistic explanations
- Consistent score generation based on symbol hash

## Database Integration
- Uses same PostgreSQL database as Next.js frontend
- SQLAlchemy models match existing Prisma schema
- Connection pooling and error handling included

## CORS Configuration
Configured to allow requests from:
- http://localhost:3000 (Next.js dev server)
- http://localhost:3001 (Alternative port)

## Error Handling
- 404: Resource not found
- 400: Bad request (duplicate items, validation errors)
- 500: Internal server errors

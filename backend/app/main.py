"""
AiiA FastAPI Main Application
Entry point for the API server
"""

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import test_connection
from .api import securities_router, watchlists_router
from .services.market_data import cleanup_market_data_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\U0001f680 Starting AiiA FastAPI Backend...")
    if test_connection():
        print("\u2705 Database connection successful")
    else:
        print("\u274c Database connection failed")
    
    print("\u2705 Market data service initialized")
    yield
    
    # Cleanup
    await cleanup_market_data_service()
    print("\U0001f6d1 Shutting down AiiA FastAPI Backend...")

app = FastAPI(
    title="AiiA API",
    description="Artificially Intelligent Investment Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "https://aiia-fintech-app.vercel.app",
    "https://aiia-fintech-k9zu90qa3-peters-projects-a9a53cba.vercel.app",
    "https://aiia-fintech-c3e98di6f-peters-projects-a9a53cba.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(securities_router, prefix="/api")
app.include_router(watchlists_router, prefix="/api")

@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str):
    return Response(status_code=200)

@app.get("/")
async def root():
    return {
        "message": "AiiA FastAPI Backend is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
async def api_health_check():
    db_status = test_connection()
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected",
        "service": "AiiA FastAPI Backend"
    }

@app.get("/api/debug/quote/{symbol}")
async def debug_quote(symbol: str):
    try:
        from .services.market_data import get_market_data_service
        from dataclasses import asdict
        
        svc = await get_market_data_service()
        quote = await svc.get_enriched_quote(symbol)

        # Handle serialization depending on type of object
        if hasattr(quote, "model_dump"):   # Pydantic v2
            return quote.model_dump()
        elif hasattr(quote, "dict"):       # Pydantic v1
            return quote.dict()
        elif hasattr(quote, "__dataclass_fields__"):  # dataclass
            return asdict(quote)
        else:  # fallback: build manually
            return quote.__dict__
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

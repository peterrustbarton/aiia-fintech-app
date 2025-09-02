"""
AiiA FastAPI Main Application
Entry point for the API server
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import test_connection
from .api import securities_router, watchlists_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\U0001f680 Starting AiiA FastAPI Backend...")
    if test_connection():
        print("\u2705 Database connection successful")
    else:
        print("\u274c Database connection failed")
    yield
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

app.include_router(securities_router, prefix="/dumbsecurity")
app.include_router(watchlists_router, prefix="/dumbwatch")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

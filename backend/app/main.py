
"""
AiiA FastAPI Main Application
Entry point for the API server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import test_connection, engine
from .api import securities_router, watchlists_router

# Test database connection on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting AiiA FastAPI Backend...")
    
    # Test database connection
    if test_connection():
        print("✅ Database connection successful")
    else:
        print("❌ Database connection failed")
    
    # Tables already exist in the database
    
    yield
    
    # Shutdown
    print("🛑 Shutting down AiiA FastAPI Backend...")

# Create FastAPI app
app = FastAPI(
    title="AiiA API",
    description="Artificially Intelligent Investment Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(securities_router, prefix="/api")
app.include_router(watchlists_router, prefix="/api")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AiiA FastAPI Backend is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    db_status = test_connection()
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected",
        "service": "AiiA FastAPI Backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

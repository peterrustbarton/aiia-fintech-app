from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://aiia-fintech-c3e98di6f-peters-projects-a9a53cba.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str):
    # Explicitly handle OPTIONS for any path to avoid 400 errors
    return {}

# Dummy securities endpoint for testing
@app.get("/api/securities")
async def get_securities(active_only: bool = True):
    return [{"symbol": "AAPL", "active_only": active_only}]

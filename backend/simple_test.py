from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AiiA Test API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AiiA FastAPI Test Server Running!"}

@app.get("/health")
def health():
    try:
        # Test database connection
        DATABASE_URL = os.getenv("DATABASE_URL")
        print(f"DATABASE_URL: {DATABASE_URL}")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e), "url": DATABASE_URL}

@app.get("/api/securities")
def get_securities():
    try:
        DATABASE_URL = os.getenv("DATABASE_URL")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT symbol, company_name, sector, market_cap FROM securities LIMIT 10")
        results = cur.fetchall()
        cur.close()
        conn.close()
        
        securities = []
        for row in results:
            securities.append({
                "symbol": row[0],
                "company_name": row[1],
                "sector": row[2],
                "market_cap": str(row[3]) if row[3] else None
            })
        
        return securities
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

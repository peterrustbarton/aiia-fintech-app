
"""
AiiA - Database Connection Setup
SQLAlchemy-based PostgreSQL connection for the fintech application
"""

import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Text, DateTime, Boolean, DECIMAL, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Security(Base):
    __tablename__ = "securities"
    
    symbol = Column(String(10), primary_key=True)
    company_name = Column(String(255), nullable=False, index=True)
    sector = Column(String(100), index=True)
    market_cap = Column(BigInteger, index=True)
    is_active = Column(Boolean, default=True, index=True)

class Score(Base):
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), nullable=False, index=True)
    score_value = Column(DECIMAL(5,2), nullable=False, index=True)
    calculated_at = Column(DateTime, default=datetime.utcnow, index=True)
    factor_breakdown_json = Column(JSONB)

class Watchlist(Base):
    __tablename__ = "watchlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    watchlist_id = Column(Integer, nullable=False, index=True)
    symbol = Column(String(10), nullable=False, index=True)
    added_at = Column(DateTime, default=datetime.utcnow, index=True)

# Database utility functions
def get_db():
    """
    Dependency function to get database session.
    Use this in your FastAPI or other framework endpoints.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """Drop all tables from the database (use with caution!)"""
    Base.metadata.drop_all(bind=engine)

# Connection test function
def test_connection():
    """Test database connection"""
    try:
        connection = engine.connect()
        result = connection.execute("SELECT 1")
        connection.close()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    # Test connection when script is run directly
    test_connection()
    print(f"Database URL: {DATABASE_URL}")

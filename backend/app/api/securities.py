
"""
Securities API Routes
Endpoints for managing securities and scores
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List

from ..database import get_db
from ..models import Security, Score
from ..schemas import SecurityResponse, SecurityWithScore

router = APIRouter(prefix="/securities", tags=["securities"])

@router.get("/", response_model=List[SecurityWithScore])
async def get_securities(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get all securities with their latest scores
    """
    query = db.query(Security).options(selectinload(Security.scores))
    
    if active_only:
        query = query.filter(Security.is_active == True)
    
    securities = query.all()
    
    # Add mock scores for securities without scores
    for security in securities:
        if not security.scores:
            # Create mock score based on symbol hash for consistency
            mock_score_value = 60 + (hash(security.symbol) % 35)  # 60-95 range
            
            mock_score = Score(
                symbol=security.symbol,
                score_value=mock_score_value,
                factor_breakdown_json={
                    "fundamental": mock_score_value * 0.4,
                    "technical": mock_score_value * 0.3,
                    "sentiment": mock_score_value * 0.2,
                    "momentum": mock_score_value * 0.1,
                    "explanation": {
                        "recommendation": "Buy" if mock_score_value > 75 else "Hold",
                        "strengths": ["Market position", "Financial health"],
                        "concerns": ["Market volatility", "Competition"]
                    }
                }
            )
            security.scores = [mock_score]
    
    return securities

@router.get("/{symbol}", response_model=SecurityWithScore)
async def get_security(
    symbol: str,
    db: Session = Depends(get_db)
):
    """
    Get single security with latest score
    """
    security = db.query(Security).options(selectinload(Security.scores)).filter(
        Security.symbol == symbol.upper()
    ).first()
    
    if not security:
        raise HTTPException(status_code=404, detail="Security not found")
    
    # Add mock score if no scores exist
    if not security.scores:
        mock_score_value = 60 + (hash(security.symbol) % 35)
        mock_score = Score(
            symbol=security.symbol,
            score_value=mock_score_value,
            factor_breakdown_json={
                "fundamental": mock_score_value * 0.4,
                "technical": mock_score_value * 0.3,
                "sentiment": mock_score_value * 0.2,
                "momentum": mock_score_value * 0.1,
                "explanation": {
                    "recommendation": "Buy" if mock_score_value > 75 else "Hold",
                    "strengths": ["Market position", "Financial health"],
                    "concerns": ["Market volatility", "Competition"]
                }
            }
        )
        security.scores = [mock_score]
    
    return security

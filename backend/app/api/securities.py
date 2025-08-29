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

router = APIRouter(prefix="/securities", tags=["securities"], redirect_slashes=False)

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
    
    # Securities without scores will show None for latest_score - handled by frontend
    
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
    
    # Securities without scores will show None for latest_score - handled by frontend
    
    return security

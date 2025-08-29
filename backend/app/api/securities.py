"""
Securities API Routes
Endpoints for managing securities and scores
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List

from ..database import get_db
from ..models import Security
from ..schemas import SecurityWithScore

router = APIRouter(prefix="/securities", tags=["securities"], redirect_slashes=False)

@router.get("/", response_model=List[SecurityWithScore])
async def get_securities(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Security).options(selectinload(Security.scores))
    if active_only:
        query = query.filter(Security.is_active == True)
    securities = query.all()
    return securities

@router.get("/{symbol}", response_model=SecurityWithScore)
async def get_security(
    symbol: str,
    db: Session = Depends(get_db)
):
    security = db.query(Security).options(selectinload(Security.scores)).filter(
        Security.symbol == symbol.upper()
    ).first()
    if not security:
        raise HTTPException(status_code=404, detail="Security not found")
    return security

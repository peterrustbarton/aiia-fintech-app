
"""
Watchlists API Routes
Endpoints for managing user watchlists and items
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from typing import List

from ..database import get_db
from ..models import User, Watchlist, WatchlistItem, Security
from ..schemas import (
    WatchlistResponse, 
    WatchlistCreate,
    WatchlistItemResponse,
    WatchlistItemCreate
)

router = APIRouter(prefix="/users", tags=["watchlists"])

@router.get("/{user_id}/watchlists", response_model=List[WatchlistResponse])
async def get_user_watchlists(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all watchlists for a user
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    watchlists = db.query(Watchlist).options(
        selectinload(Watchlist.items).selectinload(WatchlistItem.security)
    ).filter(Watchlist.user_id == user_id).all()
    
    return watchlists

@router.post("/{user_id}/watchlists", response_model=WatchlistResponse)
async def create_watchlist(
    user_id: int,
    watchlist: WatchlistCreate,
    db: Session = Depends(get_db)
):
    """
    Create new watchlist for user
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create new watchlist
    db_watchlist = Watchlist(
        user_id=user_id,
        name=watchlist.name
    )
    
    db.add(db_watchlist)
    db.commit()
    db.refresh(db_watchlist)
    
    return db_watchlist

@router.post("/watchlists/{watchlist_id}/items", response_model=WatchlistItemResponse)
async def add_watchlist_item(
    watchlist_id: int,
    item: WatchlistItemCreate,
    db: Session = Depends(get_db)
):
    """
    Add security to watchlist
    """
    # Check if watchlist exists
    watchlist = db.query(Watchlist).filter(Watchlist.id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    
    # Check if security exists
    security = db.query(Security).filter(Security.symbol == item.symbol.upper()).first()
    if not security:
        raise HTTPException(status_code=404, detail="Security not found")
    
    # Check if item already exists
    existing_item = db.query(WatchlistItem).filter(
        WatchlistItem.watchlist_id == watchlist_id,
        WatchlistItem.symbol == item.symbol.upper()
    ).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail="Security already in watchlist")
    
    # Create new watchlist item
    db_item = WatchlistItem(
        watchlist_id=watchlist_id,
        symbol=item.symbol.upper()
    )
    
    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        # Load the security relationship
        db_item = db.query(WatchlistItem).options(
            selectinload(WatchlistItem.security)
        ).filter(WatchlistItem.id == db_item.id).first()
        
        return db_item
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Security already in watchlist")

@router.delete("/watchlists/{watchlist_id}/items/{symbol}")
async def remove_watchlist_item(
    watchlist_id: int,
    symbol: str,
    db: Session = Depends(get_db)
):
    """
    Remove security from watchlist
    """
    # Check if watchlist exists
    watchlist = db.query(Watchlist).filter(Watchlist.id == watchlist_id).first()
    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    
    # Find and delete the item
    item = db.query(WatchlistItem).filter(
        WatchlistItem.watchlist_id == watchlist_id,
        WatchlistItem.symbol == symbol.upper()
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in watchlist")
    
    db.delete(item)
    db.commit()
    
    return {"message": f"Removed {symbol.upper()} from watchlist"}

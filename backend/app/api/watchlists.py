
"""
Watchlists API Routes
Endpoints for managing user watchlists and items with live market data
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from typing import List
import logging

from ..database import get_db
from ..models import User, Watchlist, WatchlistItem, Security
from ..schemas import (
    WatchlistResponse, 
    WatchlistCreate,
    WatchlistItemResponse,
    WatchlistItemCreate
)
from ..services.market_data import get_market_data_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["watchlists"])

@router.get("/{user_id}/watchlists", response_model=List[WatchlistResponse])
async def get_user_watchlists(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all watchlists for a user with live market data
    """
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    watchlists = db.query(Watchlist).options(
        selectinload(Watchlist.items).selectinload(WatchlistItem.security)
    ).filter(Watchlist.user_id == user_id).all()
    
    # Enrich securities with live market data
    try:
        market_service = await get_market_data_service()
        
        # Collect all unique symbols from all watchlists
        all_symbols = set()
        for watchlist in watchlists:
            for item in watchlist.items:
                if item.security:
                    all_symbols.add(item.security.symbol)
        
        if all_symbols:
            # Fetch live data for all symbols concurrently
            live_quotes = await market_service.get_multiple_quotes(list(all_symbols))
            
            # Enrich each security with live data
            for watchlist in watchlists:
                for item in watchlist.items:
                    if item.security and item.security.symbol in live_quotes:
                        security = item.security
                        quote = live_quotes[security.symbol]
                        
                        # Add live data to security object
                        security.live_price = quote.price
                        security.price_change_percent = quote.change_percent
                        security.last_updated = quote.timestamp
                        security.data_source = quote.source
                        
                        # Update sector if available from live data and not in DB
                        if quote.sector and not security.sector:
                            security.sector = quote.sector
                        
                        # Update market cap if available from live data
                        if quote.market_cap is not None:
                            security.live_market_cap = quote.market_cap
            
            logger.info(f"Enriched {len(all_symbols)} securities in watchlists with live market data")
            
    except Exception as e:
        logger.error(f"Error enriching watchlist securities with live data: {e}")
        # Continue without live data - graceful degradation
    
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

"""
Securities API Routes
Endpoints for managing securities and scores with live market data
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List
import logging

from ..database import get_db
from ..models import Security
from ..schemas import SecurityWithScore
from ..services.market_data import get_market_data_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/securities", tags=["securities"], redirect_slashes=False)
@router.get("", response_model=List[SecurityWithScore])
async def get_securities_no_slash(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    return await get_securities(active_only, db)
    
@router.get("/", response_model=List[SecurityWithScore])
async def get_securities(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    # Get securities from database
    query = db.query(Security).options(selectinload(Security.scores))
    if active_only:
        query = query.filter(Security.is_active == True)
    securities = query.all()
    
    # Enrich with live market data
    try:
        market_service = await get_market_data_service()
        symbols = [security.symbol for security in securities]
        
        # Fetch live data for all symbols concurrently
        live_quotes = await market_service.get_multiple_quotes(symbols)
        
        # Enrich securities with live data
        for security in securities:
            if security.symbol in live_quotes:
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
        
        logger.info(f"Enriched {len(securities)} securities with live market data")
        
    except Exception as e:
        logger.error(f"Error enriching securities with live data: {e}")
        # Continue without live data - graceful degradation
    
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
    
    # Enrich with live market data
    try:
        market_service = await get_market_data_service()
        quote = await market_service.get_enriched_quote(security.symbol)
        
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
        
        logger.info(f"Enriched security {security.symbol} with live market data from {quote.source}")
        
    except Exception as e:
        logger.error(f"Error enriching security {security.symbol} with live data: {e}")
        # Continue without live data - graceful degradation
    
    return security

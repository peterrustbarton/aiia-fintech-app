
"""
Security Pydantic Schemas
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .score import ScoreResponse

class SecurityBase(BaseModel):
    symbol: str
    company_name: str
    sector: Optional[str] = None
    market_cap: Optional[int] = None
    is_active: bool = True

class SecurityResponse(SecurityBase):
    market_cap_formatted: str

    class Config:
        from_attributes = True

class SecurityWithScore(SecurityResponse):
    latest_score: Optional[ScoreResponse] = None
    
    # Live market data fields
    live_price: Optional[float] = None
    price_change_percent: Optional[float] = None
    live_market_cap: Optional[float] = None
    last_updated: Optional[datetime] = None
    data_source: Optional[str] = None

    class Config:
        from_attributes = True

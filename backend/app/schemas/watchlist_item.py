
"""
WatchlistItem Pydantic Schemas  
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .security import SecurityResponse

class WatchlistItemBase(BaseModel):
    symbol: str

class WatchlistItemCreate(WatchlistItemBase):
    pass

class WatchlistItemResponse(WatchlistItemBase):
    id: int
    watchlist_id: int
    added_at: datetime
    security: Optional[SecurityResponse] = None

    class Config:
        from_attributes = True

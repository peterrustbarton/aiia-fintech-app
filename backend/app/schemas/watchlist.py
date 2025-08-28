
"""
Watchlist Pydantic Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from .watchlist_item import WatchlistItemResponse

class WatchlistBase(BaseModel):
    name: str

class WatchlistCreate(WatchlistBase):
    pass

class WatchlistResponse(WatchlistBase):
    id: int
    user_id: int
    created_at: datetime
    item_count: int
    symbols: List[str]
    items: Optional[List[WatchlistItemResponse]] = None

    class Config:
        from_attributes = True

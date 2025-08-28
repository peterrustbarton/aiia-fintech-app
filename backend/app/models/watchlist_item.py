
"""
WatchlistItem SQLAlchemy Model
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    watchlist_id = Column(Integer, ForeignKey("watchlists.id", ondelete="CASCADE"), nullable=False, index=True)
    symbol = Column(String(10), ForeignKey("securities.symbol", ondelete="CASCADE"), nullable=False, index=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    watchlist = relationship("Watchlist", back_populates="items")
    security = relationship("Security", back_populates="watchlist_items")

    # Unique constraint
    __table_args__ = (UniqueConstraint('watchlist_id', 'symbol', name='unique_watchlist_symbol'),)

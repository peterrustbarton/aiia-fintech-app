
"""
Security SQLAlchemy Model
"""

from sqlalchemy import Column, String, BigInteger, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class Security(Base):
    __tablename__ = "securities"

    symbol = Column(String(10), primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    sector = Column(String(100), index=True)
    market_cap = Column(BigInteger)
    is_active = Column(Boolean, default=True, index=True)

    # Relationships
    scores = relationship("Score", back_populates="security", cascade="all, delete-orphan")
    watchlist_items = relationship("WatchlistItem", back_populates="security", cascade="all, delete-orphan")

    @property
    def latest_score(self):
        """Get the most recent score for this security"""
        if self.scores:
            return max(self.scores, key=lambda s: s.calculated_at)
        return None

    @property
    def market_cap_formatted(self):
        """Format market cap in billions/trillions"""
        if not self.market_cap:
            return "N/A"
        
        if self.market_cap >= 1_000_000_000_000:
            return f"${self.market_cap / 1_000_000_000_000:.1f}T"
        elif self.market_cap >= 1_000_000_000:
            return f"${self.market_cap / 1_000_000_000:.1f}B"
        else:
            return f"${self.market_cap / 1_000_000:.1f}M"

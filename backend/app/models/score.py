
"""
Score SQLAlchemy Model
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from ..database import Base

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), ForeignKey("securities.symbol", ondelete="CASCADE"), nullable=False, index=True)
    score_value = Column(Numeric(5, 2), nullable=False, index=True)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    factor_breakdown_json = Column(JSON)

    # Relationships
    security = relationship("Security", back_populates="scores")

    @property
    def score_grade(self):
        """Convert numeric score to letter grade"""
        if self.score_value >= 90:
            return "A+"
        elif self.score_value >= 85:
            return "A"
        elif self.score_value >= 80:
            return "A-"
        elif self.score_value >= 75:
            return "B+"
        elif self.score_value >= 70:
            return "B"
        elif self.score_value >= 65:
            return "B-"
        elif self.score_value >= 60:
            return "C"
        else:
            return "D"

    @property
    def recommendation(self):
        """Get recommendation from factor breakdown or generate based on score"""
        if self.factor_breakdown_json and isinstance(self.factor_breakdown_json, dict):
            explanation = self.factor_breakdown_json.get("explanation", {})
            if "recommendation" in explanation:
                return explanation["recommendation"]
        
        # Generate recommendation based on score
        if self.score_value >= 80:
            return "Strong Buy"
        elif self.score_value >= 70:
            return "Buy"
        elif self.score_value >= 60:
            return "Hold"
        else:
            return "Sell"

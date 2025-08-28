
"""
AiiA FastAPI Routes
API endpoint handlers
"""

from .securities import router as securities_router
from .watchlists import router as watchlists_router

__all__ = ["securities_router", "watchlists_router"]


"""
User Pydantic Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    full_name: str

    class Config:
        from_attributes = True

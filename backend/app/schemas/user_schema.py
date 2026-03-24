from pydantic import BaseModel, EmailStr
from typing import Optional
class UserCreate(BaseModel):
    name: str
    email: EmailStr
class UserResponse(BaseModel):
    id: str
    user_code: str
    name: str
    email: EmailStr
    class Config:
        from_attributes = True
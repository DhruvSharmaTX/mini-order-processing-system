from pydantic import BaseModel
from typing import List
from datetime import datetime
class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItemCreate]
class OrderItemResponse(BaseModel):
    product_id: str
    quantity: int
    class Config:
        from_attributes = True
class OrderResponse(BaseModel):
    id: str
    order_code: str
    user_id: str
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

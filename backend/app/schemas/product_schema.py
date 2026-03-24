from typing import Optional
from pydantic import BaseModel
class ProductCreate(BaseModel):
    name: str
    price: float
    stock_quantity: int
class ProductResponse(BaseModel):
    id: str
    product_code: str
    name: str
    price: float
    stock_quantity: int
    class Config:
        from_attributes = True
class ProductUpdate(BaseModel):
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
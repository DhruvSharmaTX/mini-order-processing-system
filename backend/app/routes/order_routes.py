from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.order_schema import OrderCreate, OrderResponse
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, order)
@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return order_service.get_orders(db)
@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(order_id: str, db: Session = Depends(get_db)):
    return order_service.get_order_by_id(db, order_id)
@router.put("/{order_id}/status")
def update_order_status(order_id: str, status: str, db: Session = Depends(get_db)):
    return order_service.update_order_status(db, order_id, status)
@router.put("/{order_id}/cancel")
def cancel_order(order_id: str, db: Session = Depends(get_db)):
    return order_service.cancel_order(db, order_id)

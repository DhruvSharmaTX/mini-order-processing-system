from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import User
from app.models.order_model import Order  
from app.schemas.user_schema import UserCreate
from app.utils.id_generator import generate_id

def create_user(db: Session, user: UserCreate):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        name=user.name,
        email=user.email,
        user_code=generate_id("USR")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def delete_user(db: Session, user_id: str):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    has_orders = db.query(Order.id).filter(Order.user_id == user_id).first()
    if has_orders:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete because user has orders"
        )
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
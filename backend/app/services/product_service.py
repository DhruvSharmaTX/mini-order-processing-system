from sqlalchemy.orm import Session
from app.models.product_model import Product
from app.schemas.product_schema import ProductCreate
from app.utils.id_generator import generate_id
from fastapi import HTTPException

def create_product(db: Session, product: ProductCreate):
    new_product = Product(
        name=product.name, price=product.price, stock_quantity=product.stock_quantity, product_code=generate_id("PRD")
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

def get_products(db: Session):
    return db.query(Product).all()

def update_product(db: Session, product_id: str, product_data):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

def get_product_by_id(db: Session, product_id: str):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
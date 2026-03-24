from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base
import uuid
class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"))
    product_id = Column(String(36), ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    order = relationship("Order", back_populates="items")
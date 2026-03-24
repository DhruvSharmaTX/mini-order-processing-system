from sqlalchemy import Column, String
from app.database.connection import Base
import uuid
class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_code = Column(String(20), unique=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
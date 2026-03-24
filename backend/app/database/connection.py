import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

def running_in_docker():
    return os.path.exists("/.dockerenv")


if running_in_docker():
    print("Running inside Docker → loading .env.docker")
    load_dotenv(".env.docker")
else:
    print("Running locally → loading .env.local")
    load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL")
engine = None

for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        conn.close()
        print("Database connected")
        break
    except Exception:
        print(f"DB not ready... retrying ({i+1}/10)")
        time.sleep(3)

if engine is None:
    raise Exception("Could not connect to database")

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.models import user_model, product_model, order_model, order_item_model
from app.routes import user_routes, product_routes, order_routes

app = FastAPI(title="Mini Order Processing System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/", tags=["Home"])
def home():
    return {"message": "API is running."}

app.include_router(user_routes.router)
app.include_router(product_routes.router)
app.include_router(order_routes.router)
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.product_model import Product
from app.models.user_model import User
from app.schemas.order_schema import OrderCreate
from app.utils.id_generator import generate_id


# ================= CREATE ORDER =================
def create_order(db: Session, order_data: OrderCreate):
    try:
        # ✅ CHECK USER
        user = db.query(User).filter(User.id == order_data.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # ✅ CHECK ITEMS
        if not order_data.items:
            raise HTTPException(
                status_code=400,
                detail="Order must contain at least one item"
            )

        total_amount = 0
        order_items = []

        # ✅ MERGE SAME PRODUCTS
        product_quantity_map = {}
        for item in order_data.items:
            product_quantity_map[item.product_id] = (
                product_quantity_map.get(item.product_id, 0) + item.quantity
            )

        # ✅ VALIDATE + UPDATE STOCK
        for product_id, quantity in product_quantity_map.items():
            product = db.query(Product).filter(Product.id == product_id).first()

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product not found"
                )

            if product.stock_quantity < quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}"
                )

            # 🔥 REDUCE STOCK
            product.stock_quantity -= quantity

            total_amount += product.price * quantity

            order_items.append({
                "product_id": product.id,
                "quantity": quantity
            })

        # ✅ CREATE ORDER
        new_order = Order(
            user_id=order_data.user_id,
            total_amount=total_amount,
            order_code=generate_id("ORD"),
            status="pending"
        )

        db.add(new_order)
        db.flush()  # get ID

        # ✅ CREATE ORDER ITEMS
        for item in order_items:
            db_item = OrderItem(
                order_id=new_order.id,
                product_id=item["product_id"],
                quantity=item["quantity"],
            )
            db.add(db_item)

        db.commit()
        db.refresh(new_order)

        return new_order

    except HTTPException:
        db.rollback()
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Something went wrong")


# ================= CANCEL ORDER =================
def cancel_order(db: Session, order_id: str):
    try:
        order = (
            db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.id == order_id)
            .first()
        )

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.status == "cancelled":
            raise HTTPException(status_code=400, detail="Order already cancelled")

        if order.status == "delivered":
            raise HTTPException(
                status_code=400,
                detail="Delivered order cannot be cancelled"
            )

        # 🔥 RESTORE STOCK
        for item in order.items:
            product = db.query(Product).filter(
                Product.id == item.product_id
            ).first()

            if product:
                product.stock_quantity += item.quantity

        order.status = "cancelled"

        db.commit()
        db.refresh(order)

        return {"message": "Order cancelled successfully"}

    except HTTPException:
        db.rollback()
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Something went wrong")


# ================= GET ORDERS =================
def get_orders(db: Session):
    return db.query(Order).options(joinedload(Order.items)).all()


def get_order_by_id(db: Session, order_id: str):
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


# ================= UPDATE STATUS =================
def update_order_status(db: Session, order_id: str, status: str):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.status == "cancelled":
            raise HTTPException(
                status_code=400,
                detail="Cancelled order cannot be updated"
            )

        if order.status == "delivered":
            raise HTTPException(
                status_code=400,
                detail="Order already delivered"
            )

        if status not in ["pending", "delivered"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid status"
            )

        # 🔥 ONLY ALLOW pending → delivered
        if order.status == "pending" and status == "delivered":
            order.status = "delivered"
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid status transition"
            )

        db.commit()
        db.refresh(order)

        return order

    except HTTPException:
        db.rollback()
        raise

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Something went wrong")
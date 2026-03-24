import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className={`sidebar ${open ? "open" : ""}`}>
                <h2 className="logo">🛒 Mini Order</h2>
                <nav>
                    <NavLink to="/" end onClick={() => setOpen(false)}>
                        📊 <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/users" onClick={() => setOpen(false)}>
                        👤 <span>Users</span>
                    </NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>
                        📦 <span>Products</span>
                    </NavLink>
                    <NavLink to="/orders" onClick={() => setOpen(false)}>
                        🧾 <span>Orders</span>
                    </NavLink>
                </nav>
            </div>
        </>
    );
}
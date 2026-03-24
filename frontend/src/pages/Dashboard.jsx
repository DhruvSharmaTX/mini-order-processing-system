import { useEffect, useState } from "react";
import { getUsers, getProducts, getOrders } from "../api/api";

export default function Dashboard() {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0,
    });
    const load = async () => {
        const [u, p, o] = await Promise.all([
            getUsers(),
            getProducts(),
            getOrders(),
        ]);
        const orders = o.data;
        const revenue = orders
            .filter((ord) => ord.status === "delivered")
            .reduce((sum, ord) => sum + ord.total_amount, 0);
        setStats({
            users: u.data.length,
            products: p.data.length,
            orders: orders.length,
            revenue,
        });
    };
    useEffect(() => {
        load();
    }, []);
    return (
        <div>
            <h2>🛒 Mini Order Processing System</h2>
            <div className="cards">
                <div className="card">
                    <h3>👤 Users</h3>
                    <p>{stats.users}</p>
                </div>
                <div className="card">
                    <h3>📦 Products</h3>
                    <p>{stats.products}</p>
                </div>
                <div className="card">
                    <h3>🧾 Orders</h3>
                    <p>{stats.orders}</p>
                </div>
                <div className="card revenue">
                    <h3>💰 Revenue</h3>
                    <p>₹{stats.revenue}</p>
                </div>
            </div>
        </div>
    );
}
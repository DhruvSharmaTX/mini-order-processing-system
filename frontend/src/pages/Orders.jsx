import { useEffect, useState } from "react";
import {getOrders,getUsers,getProducts,createOrder,updateOrderStatus,cancelOrder,} from "../api/api";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [viewAll, setViewAll] = useState(false);
    const [itemsModal, setItemsModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [confirmCode, setConfirmCode] = useState("");
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
    const load = async () => {
        const [o, u, p] = await Promise.all([
            getOrders(),
            getUsers(),
            getProducts(),
        ]);
        setOrders(o.data);
        setUsers(u.data);
        setProducts(p.data);
    };
    useEffect(() => {load();}, []);
    const getUserName = (id) =>
        users.find((u) => u.id === id)?.name || "Unknown";
    const addItem = () => {
        setItems([...items, { product_id: "", quantity: 1 }]);
    };
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };
    const removeItem = (index) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };
    const handleCreateOrder = async () => {
        await createOrder({
            user_id: selectedUser,
            items: items.map((i) => ({
                product_id: i.product_id,
                quantity: Number(i.quantity),
            })),
        });
        setCreateModal(false);
        setItems([{ product_id: "", quantity: 1 }]);
        setSelectedUser("");
        load();
    };
    const openItems = (order) => {
        setSelectedOrder(order);
        setItemsModal(true);
    };
    const openStatus = (order) => {
        setSelectedOrder(order);
        setConfirmCode("");
        setMessage("");
        setStatusModal(true);
    };
    const handleStatusUpdate = async () => {
        if (confirmCode !== selectedOrder.order_code) {
            setMessage("❌ Order code does not match");
            return;
        }
        try {
            await updateOrderStatus(selectedOrder.id, "delivered");
            setMessage("✅ Order delivered");
            setTimeout(() => {
                setStatusModal(false);
                setViewAll(false);
                load();
            }, 800);
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error");
        }
    };
    const openCancel = (order) => {
        setSelectedOrder(order);
        setConfirmCode("");
        setMessage("");
        setCancelModal(true);
    };
    const handleCancel = async () => {
        if (confirmCode !== selectedOrder.order_code) {
            setMessage("❌ Order code does not match");
            return;
        }
        try {
            await cancelOrder(selectedOrder.id);
            setMessage("✅ Order cancelled");
            setTimeout(() => {
                setCancelModal(false);
                setViewAll(false);
                load();
            }, 800);
        } catch (err) {
            setMessage(err.response?.data?.detail || "Error");
        }
    };
    return (
        <div>
            <h2>🧾 Orders</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button onClick={() => setCreateModal(true)}>
                    + Create Order
                </button>
                {!viewAll ? (
                    <button onClick={() => setViewAll(true)}>
                        👁 View All Orders
                    </button>
                ) : (
                    <button onClick={() => setViewAll(false)}>
                        ⬅ Back
                    </button>
                )}
            </div>
            {!viewAll ? (
                <Table
                    columns={[
                        {
                            header: "User",
                            render: (o) => getUserName(o.user_id),
                        },
                        {
                            header: "Total",
                            render: (o) => `₹${o.total_amount}`,
                        },
                        {
                            header: "Status",
                            accessor: "status",
                        },
                    ]}
                    data={orders}
                />
            ) : (
                <Table
                    columns={[
                        { header: "Order Code", accessor: "order_code" },
                        {
                            header: "User",
                            render: (o) => getUserName(o.user_id),
                        },
                        {
                            header: "Total",
                            render: (o) => `₹${o.total_amount}`,
                        },
                        {
                            header: "Status",
                            accessor: "status",
                        },
                    ]}
                    data={orders}
                    renderActions={(o) => (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => openItems(o)}>
                                View Items
                            </button>
                            {o.status === "pending" && (
                                <>
                                    <button onClick={() => openStatus(o)}>
                                        Deliver
                                    </button>
                                    <button onClick={() => openCancel(o)}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                />
            )}
            <Modal
                isOpen={createModal}
                onClose={() => setCreateModal(false)}
                title="Create Order"
            >
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">Select User</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
                {items.map((item, i) => (
                    <div key={i}>
                        <select
                            value={item.product_id}
                            onChange={(e) =>
                                updateItem(i, "product_id", e.target.value)
                            }
                        >
                            <option value="">Product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                                updateItem(i, "quantity", e.target.value)
                            }
                        />

                        {items.length > 1 && (
                            <button onClick={() => removeItem(i)}>❌</button>
                        )}
                    </div>
                ))}
                <button onClick={addItem}>+ Add Product</button>
                <button onClick={handleCreateOrder}>Create</button>
            </Modal>
            <Modal
                isOpen={itemsModal}
                onClose={() => setItemsModal(false)}
                title="Order Items"
            >
                {selectedOrder?.items.map((item, i) => {
                    const product = products.find(
                        (p) => p.id === item.product_id
                    );

                    return (
                        <p key={i}>
                            {product?.name} × {item.quantity}
                        </p>
                    );
                })}
            </Modal>
            <Modal
                isOpen={statusModal}
                onClose={() => setStatusModal(false)}
                title="Confirm Delivery"
            >
                <p>Enter Order Code to confirm delivery:</p>

                <input
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                />
                <button onClick={handleStatusUpdate}>
                    Confirm Deliver
                </button>
                {message && <p>{message}</p>}
            </Modal>
            <Modal
                isOpen={cancelModal}
                onClose={() => setCancelModal(false)}
                title="Cancel Order"
            >
                <p>Enter Order Code to cancel:</p>
                <input
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                />
                <button onClick={handleCancel}>
                    Confirm Cancel
                </button>
                {message && <p>{message}</p>}
            </Modal>
        </div>
    );
}
import { useEffect, useState } from "react";
import {getProducts,createProduct,updateProduct,} from "../api/api";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmCode, setConfirmCode] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({name: "",price: "",stock_quantity: "",});
    const load = async () => {
        const res = await getProducts();
        setProducts(res.data);
    };
    useEffect(() => {load();}, []);

    const handleEdit = (product) => {
        setEditId(product.id);
        setSelectedProduct(product);
        setForm(product);
        setConfirmCode("");
        setMessage("");
        setOpen(true);
    };
    const handleSubmit = async () => {
        if (editId) {
            if (confirmCode !== selectedProduct.product_code) {
                setMessage("❌ Product code does not match");
                return;
            }
            try {
                await updateProduct(editId, {
                    price: Number(form.price),
                    stock_quantity: Number(form.stock_quantity),
                });
                setMessage("✅ Product updated");
                setTimeout(() => {
                    setOpen(false);
                    setEditId(null);
                    setViewAll(false);
                    resetForm();
                    load();
                }, 800);
            } catch {
                setMessage("❌ Update failed");
            }
            return;
        }
        await createProduct({
            name: form.name,
            price: Number(form.price),
            stock_quantity: Number(form.stock_quantity),
        });
        setOpen(false);
        setViewAll(false);
        resetForm();
        load();
    };
    const resetForm = () => {
        setForm({ name: "", price: "", stock_quantity: "" });
        setConfirmCode("");
        setMessage("");
        setSelectedProduct(null);
    };
    return (
        <div>
            <h2>📦 Products</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button onClick={() => setOpen(true)}>
                    + Add Product
                </button>
                {!viewAll ? (
                    <button onClick={() => setViewAll(true)}>
                        👁 View All Products
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
                        { header: "Name", accessor: "name" },
                        { header: "Price", accessor: "price" },
                        { header: "Stock", accessor: "stock_quantity" },
                    ]}
                    data={products}
                />
            ) : (
                <Table
                    columns={[
                        { header: "Product Code", accessor: "product_code" },
                        { header: "Name", accessor: "name" },
                        { header: "Price", accessor: "price" },
                        { header: "Stock", accessor: "stock_quantity" },
                    ]}
                    data={products}
                    renderActions={(p) => (
                        <button onClick={() => handleEdit(p)}>
                            Edit
                        </button>
                    )}
                />
            )}
            <Modal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setEditId(null);
                    resetForm();
                }}
                title={editId ? "Edit Product" : "Create Product"}
            >
                <input
                    placeholder="Name"
                    value={form.name}
                    disabled={editId}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
                <input
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />
                <input
                    placeholder="Stock"
                    value={form.stock_quantity}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            stock_quantity: e.target.value,
                        })
                    }
                />
                {editId && (
                    <>
                        <p style={{ marginTop: "10px" }}>
                            Enter Product Code to confirm:
                        </p>
                        <input
                            placeholder="Product Code"
                            value={confirmCode}
                            onChange={(e) =>
                                setConfirmCode(e.target.value)
                            }
                        />
                    </>
                )}
                <button onClick={handleSubmit}>
                    {editId ? "Update" : "Create"}
                </button>
                {message && (
                    <p style={{ marginTop: "10px" }}>
                        {message}
                    </p>
                )}
            </Modal>
        </div>
    );
}
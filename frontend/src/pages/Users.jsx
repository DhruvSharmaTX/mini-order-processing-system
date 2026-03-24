import { useEffect, useState } from "react";
import {getUsers,createUser,deleteUser,} from "../api/api";
import Table from "../components/Table";
import Modal from "../components/Modal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmCode, setConfirmCode] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({ name: "", email: "" });
    const [error, setError] = useState("");
    const load = async () => {
        const res = await getUsers();
        setUsers(res.data);
    };
    useEffect(() => {
        load();
    }, []);
    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const handleCreate = async () => {
        try {
            setError("");
            if (!form.name || !form.email) {
                setError("❌ All fields are required");
                return;
            }
            if (!isValidEmail(form.email)) {
                setError("❌ Invalid email format");
                return;
            }
            await createUser(form);
            setOpen(false);
            setForm({ name: "", email: "" });
            setViewAll(false);
            load();
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                "❌ Something went wrong";
            setError(msg);
        }
    };
    const openDelete = (user) => {
        setSelectedUser(user);
        setDeleteModal(true);
        setConfirmCode("");
        setMessage("");
    };
    const handleDelete = async () => {
        if (confirmCode !== selectedUser.user_code) {
            setMessage("❌ User code does not match");
            return;
        }
        try {
            await deleteUser(selectedUser.id); 
            setMessage("✅ User deleted");
            setTimeout(() => {
                setDeleteModal(false);
                setViewAll(false);
                load();
            }, 800);
        } catch (err) {
            setMessage("❌ Cannot delete (user has orders)");
        }
    };
    return (
        <div>
            <h2>👤 Users</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button onClick={() => setOpen(true)}>
                    + Create User
                </button>
                {!viewAll ? (
                    <button onClick={() => setViewAll(true)}>
                        👁 View All Users
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
                        { header: "Email", accessor: "email" },
                    ]}
                    data={users}
                />
            ) : (
                <Table
                    columns={[
                        { header: "User Code", accessor: "user_code" },
                        { header: "Name", accessor: "name" },
                        { header: "Email", accessor: "email" },
                    ]}
                    data={users}
                    renderActions={(u) => (
                        <button onClick={() => openDelete(u)}>
                            Delete
                        </button>
                    )}
                />
            )}
            <Modal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setError("");
                }}
                title="Create User"
            >
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
                <button onClick={handleCreate}>Create</button>
                {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                        {error}
                    </p>
                )}
            </Modal>
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Confirm Delete"
            >
                <p>Enter User Code to confirm:</p>
                <input
                    placeholder="User Code"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                />
                <button onClick={handleDelete}>
                    Confirm Delete
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
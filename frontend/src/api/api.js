import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000",
});

// 🔥 GLOBAL ERROR HANDLER
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error?.response?.data?.detail ||
            "Something went wrong";

        return Promise.reject(message);
    }
);

// USERS
export const getUsers = () => API.get("/users/");
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post("/users/", data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// PRODUCTS
export const getProducts = () => API.get("/products/");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products/", data);
export const updateProduct = (id, data) =>
    API.patch(`/products/${id}`, data);

// ORDERS
export const getOrders = () => API.get("/orders/");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post("/orders/", data);
export const updateOrderStatus = (id, status) =>
    API.put(`/orders/${id}/status?status=${status}`);
export const cancelOrder = (id) =>
    API.put(`/orders/${id}/cancel`);

export default API;
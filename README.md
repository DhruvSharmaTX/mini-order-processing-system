# 🛒 Mini Order Processing System

A full-stack order processing application built with a **FastAPI** backend and **React** frontend, containerized with Docker for seamless deployment.

---

## 📁 Project Structure

```
mini-order-processing-system/
├── backend/
│   ├── app/
│   │   ├── database/       # Database connection & session management
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── routes/         # API route handlers
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Utility/helper functions
│   ├── main.py             # FastAPI app entry point
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile
│   ├── .env.docker
│   └── .env.local
├── frontend/
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page-level components
│   │   └── styles/         # CSS stylesheets
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React + Vite            |
| Backend    | Python + FastAPI        |
| Database   | PostgreSQL / SQLite      |
| ORM        | SQLAlchemy              |
| Validation | Pydantic                |
| Container  | Docker + Docker Compose |

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js ≥ 18 (for local frontend dev)
- Python ≥ 3.10 (for local backend dev)

---

### 🐳 Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/DhruvSharmaTX/mini-order-processing-system.git
cd mini-order-processing-system

# Start all services
docker-compose up --build
```

- **Frontend**: http://localhost:5173  
- **Backend API**: http://localhost:8000  
- **API Docs (Swagger)**: http://localhost:8000/docs  

---

### 🖥️ Run Locally (Without Docker)

#### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.local .env

# Start the server
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env .env.local

# Start the dev server
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/`               | Health check             |
| GET    | `/orders`         | List all orders          |
| POST   | `/orders`         | Create a new order       |
| GET    | `/orders/{id}`    | Get order by ID          |
| PUT    | `/orders/{id}`    | Update an order          |
| DELETE | `/orders/{id}`    | Delete an order          |

> Full interactive documentation available at `/docs` (Swagger UI) and `/redoc`.

---

## 🔐 Environment Variables

### Backend (`.env.local` / `.env.docker`)

```env
DATABASE_URL=sqlite:///./orders.db   # or your PostgreSQL URL
SECRET_KEY=your_secret_key
DEBUG=True
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧪 Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

---

## 📦 Docker Services

Defined in `docker-compose.yml`:

| Service    | Port  | Description          |
|------------|-------|----------------------|
| `backend`  | 8000  | FastAPI REST API     |
| `frontend` | 5173  | React + Vite dev server |
| `db`       | 5432  | PostgreSQL (if used) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Dhruv Sharma**  

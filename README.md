# 🍽️ Zodetron Dining by Hardik

> *Where Code Meets Cuisine. Powered by Taste. Driven by Tech.*

A full-stack, production-quality **Online Food Ordering System** built with **ASP.NET Core 8** and **React 18**. Features JWT authentication, a complete admin panel, real-time cart updates, and JSON file-based storage — no database setup required.

---

## 📸 Pages at a Glance

| Page | Description |
|------|-------------|
| Home | Hero section, cuisine categories, feature highlights |
| Menu | Browse all items, search, filter by category |
| Cart | Dynamic cart with quantity controls, live total |
| Checkout | Delivery address, payment method, order notes |
| My Orders | Full order history with status tracking |
| Admin Dashboard | Stats overview, recent orders |
| Admin Products | Add / edit / delete food items |
| Admin Categories | Manage cuisine categories |
| Admin Orders | View all orders, update status in real time |

---
## UI UX Screenshots
<img width="500" height="450" alt="Screenshot 2026-04-09 002854" src="https://github.com/user-attachments/assets/0f7fce0a-6e15-4216-8d06-b5e332a18299" />
<img width="500" height="450" alt="Screenshot 2026-04-09 002928" src="https://github.com/user-attachments/assets/2326b951-273f-4b6e-ab27-2384844f2131" />
<img width="500" height="450" alt="Screenshot 2026-04-09 003015" src="https://github.com/user-attachments/assets/fb28976a-5a1a-4fdf-8fe8-4f79300cc8ad" />
<img width="500" height="450" alt="Screenshot 2026-04-09 003035" src="https://github.com/user-attachments/assets/63d30c0f-4a6f-47b9-976e-a8199e203182" />
<img width="500" height="450" alt="Screenshot 2026-04-09 003053" src="https://github.com/user-attachments/assets/b947ec12-1f95-47e2-a4a6-9ef8d0692c78" />
<img width="500" height="450" alt="Screenshot 2026-04-09 003228" src="https://github.com/user-attachments/assets/9eaa0f85-874e-46e9-b469-7d5b4ed86fcd" />


## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| ASP.NET Core 8 Web API | REST API server |
| JWT Bearer Authentication | Secure token-based auth |
| BCrypt.Net | Password hashing |
| System.Text.Json | JSON file storage (no SQL) |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| Vite | Build tool & dev server |

---

## 📁 Project Structure

```
FoodOrderingSystem/
│
├── backend/                          # ASP.NET Core 8 Web API
│   ├── Controllers/
│   │   ├── AuthController.cs         # Register & login endpoints
│   │   ├── ProductsController.cs     # CRUD for food items
│   │   ├── CategoriesController.cs   # CRUD for categories
│   │   ├── OrdersController.cs       # Place & manage orders
│   │   └── AdminController.cs        # Dashboard stats
│   │
│   ├── Services/
│   │   ├── UserService.cs            # Auth logic + JWT generation
│   │   ├── ProductService.cs         # Product business logic
│   │   ├── CategoryService.cs        # Category business logic
│   │   └── OrderService.cs           # Order placement & status
│   │
│   ├── Models/
│   │   ├── User.cs                   # User + auth request/response models
│   │   ├── Product.cs                # Product model
│   │   ├── Category.cs               # Category model
│   │   └── Order.cs                  # Order + cart item models
│   │
│   ├── Data/
│   │   ├── JsonDataStore.cs          # Generic JSON file read/write
│   │   ├── DataSeeder.cs             # Seeds default data on first run
│   │   └── json/                     # Auto-created at runtime
│   │       ├── users.json
│   │       ├── products.json
│   │       ├── categories.json
│   │       └── orders.json
│   │
│   ├── Program.cs                    # App entry, DI, middleware config
│   ├── appsettings.json              # JWT config, logging
│   └── FoodOrderingSystem.csproj
│
└── frontend/                         # React + Vite app
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── MenuPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminCategories.jsx
    │   │       └── AdminOrders.jsx
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── OrderStatusBadge.jsx
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx        # Global auth state + JWT storage
    │   │   └── CartContext.jsx        # Global cart state
    │   │
    │   ├── services/
    │   │   └── api.js                 # Axios instance + all API calls
    │   │
    │   ├── App.jsx                    # Route definitions + guards
    │   ├── main.jsx                   # React entry point
    │   └── index.css                  # Tailwind + custom component classes
    │
    ├── index.html
    ├── vite.config.js                 # Dev proxy → backend :5000
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node)

---

### 1. Run the Backend

```bash
cd FoodOrderingSystem/backend
dotnet run
```

The API starts at **http://localhost:5000**

On first run, `DataSeeder` automatically creates:
- 7 food categories
- 16 menu items across all categories
- 1 default admin account

---

### 2. Run the Frontend

```bash
cd FoodOrderingSystem/frontend
npm install
npm run dev
```

The app starts at **http://localhost:3000**

Vite proxies all `/api` requests to the backend, so no CORS issues in development.

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodorder.com | admin123 |
| User | Register a new account | — |

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user, returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List all products (supports `?category=` and `?search=`) |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User | Place a new order |
| GET | `/api/orders/my` | User | Get current user's orders |
| GET | `/api/orders/:id` | User/Admin | Get single order |
| GET | `/api/orders` | Admin | Get all orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats (totals, revenue, recent orders) |

---

## 🔑 Authentication Flow

1. User registers or logs in → backend returns a **JWT token**
2. Token is stored in `localStorage`
3. Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request
4. On 401 response, the interceptor clears storage and redirects to `/login`
5. React Router guards (`ProtectedRoute`) block unauthenticated or non-admin access at the UI level

---

## 🗄️ Data Storage

All data is stored as JSON files under `backend/Data/json/`. No database or connection string needed.

```
users.json       → user accounts (passwords BCrypt hashed)
products.json    → food menu items
categories.json  → cuisine categories
orders.json      → all placed orders
```

The `JsonDataStore<T>` class handles all reads and writes generically — deserializes on read, serializes on write, and auto-creates the file if it doesn't exist.

---

## 🛒 Features Breakdown

### User Side
- Register & login with JWT
- Browse menu with category tabs and live search
- Add to cart, adjust quantities, remove items
- Dynamic cart total updates without page reload
- Checkout with delivery address, payment method, notes
- View full order history with status badges

### Admin Panel
- Secure admin-only routes (role-based JWT claims)
- Dashboard with total orders, revenue, pending count, product/user counts
- Full product management — create, edit, delete, toggle availability
- Category management with emoji icons and sort order
- Order management — view all orders, expand for details, update status via dropdown

### Order Statuses
`Pending` → `Preparing` → `Out for Delivery` → `Delivered` / `Cancelled`

---

## 🏗️ Architecture

```
Request
  └── Controller          (validates input, calls service)
        └── Service       (business logic, reads/writes data)
              └── JsonDataStore<T>   (file I/O layer)
```

Clean separation of concerns — controllers never touch files directly, services never know about HTTP.

---

## 🧑‍💻 Built By

**Hardik**
> *Zodetron Dining — Where Code Meets Cuisine. Powered by Taste. Driven by Tech.*

---

## 📄 License

This project is for educational and portfolio purposes.

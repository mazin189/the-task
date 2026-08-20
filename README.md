# Mini POS / Inventory Management System

A full-stack Point of Sale and inventory management app. Manage products, track stock, and process sales with automatic stock deduction.

## Features

- Product CRUD (create, read, update, delete)
- Cashier cart with quantity controls
- Invoice creation with backend price/total calculation
- Automatic stock deduction on successful checkout
- MongoDB transactions for invoice + stock consistency
- Loading, empty, success, and error UI states
- Responsive POS-style dashboard

## Tech Stack

| Layer    | Technologies                          |
|----------|---------------------------------------|
| Backend  | Node.js, Express.js, MongoDB, Mongoose |
| Frontend | React, Vite, React Router, Axios      |

## Project Structure

```
thetask/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Product & invoice logic
│   │   ├── middleware/      # Error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── app.js           # Express app
│   │   └── server.js        # Server entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## MongoDB Setup

### Option A: Local MongoDB

1. Install and start MongoDB.
2. Default URI used by this project:

```
mongodb://127.0.0.1:27017/mini-pos
```

### Option B: MongoDB Atlas

1. Create a cluster and database user.
2. Whitelist your IP.
3. Copy the connection string and set it as `MONGO_URI`.

## Environment Variables

### Backend (`backend/.env`)

Copy the example file:

```bash
cd backend
cp .env.example .env
```

| Variable   | Description                          | Example                                      |
|------------|--------------------------------------|----------------------------------------------|
| `PORT`     | API server port                      | `5000`                                       |
| `MONGO_URI`| MongoDB connection string            | `mongodb://127.0.0.1:27017/mini-pos`         |

### Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

| Variable       | Description              | Example                         |
|----------------|--------------------------|---------------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:5000/api`     |

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed, then:
npm run dev
# or
npm start
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173` (Vite default).

## How to Run the Project

From two terminals:

```bash
# Terminal 1 — API
cd backend
npm install
npm run dev

# Terminal 2 — UI
cd frontend
npm install
npm run dev
```

Then open the frontend URL shown in the terminal (usually `http://localhost:5173`).

### Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Health

| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | `/api/health`  | Health check        |

### Products

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | `/api/products`       | List all products  |
| GET    | `/api/products/:id`   | Get one product    |
| POST   | `/api/products`       | Create product     |
| PUT    | `/api/products/:id`   | Update product     |
| DELETE | `/api/products/:id`   | Delete product     |

### Invoices

| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `/api/invoices`  | Create invoice and deduct stock      |
| GET    | `/api/invoices`  | List invoices (helper/debug endpoint)|

## Example API Requests

### Create a product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Coffee Mug\",\"price\":12.5,\"stockQuantity\":20}"
```

### List products

```bash
curl http://localhost:5000/api/products
```

### Create an invoice

```bash
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"productId\":\"PRODUCT_OBJECT_ID\",\"quantity\":2}]}"
```

Response includes calculated line subtotals and `totalPrice`. Product stock is reduced by the purchased quantities.

## How Stock Deduction Works

1. Client sends only `productId` and `quantity` for each cart line.
2. Backend validates the payload and loads each product from MongoDB.
3. Backend checks that every product exists and that stock is sufficient.
4. Prices, subtotals, and `totalPrice` are calculated on the server (frontend totals are never trusted).
5. Inside a MongoDB transaction/session:
   - Stock is deducted with a conditional update (`stockQuantity >= quantity`) so stock cannot go negative.
   - The invoice document is created with product name snapshots, prices, quantities, and subtotals.
6. If any step fails, the transaction is aborted and no partial stock change or invoice is kept.
7. On success, the created invoice is returned and the cashier UI refreshes product stock.

## License

MIT

# Mini POS / Inventory Management System

A full-stack Point of Sale (POS) and inventory management application built with React, Node.js, Express, and MongoDB.

The application allows users to manage products and inventory, add products to a cashier cart, process sales, create invoices, and automatically deduct sold quantities from product stock.

## Features

* Product CRUD (create, read, update, delete)
* Product inventory management
* Cashier cart with quantity controls
* Product stock validation before checkout
* Invoice creation
* Backend-side price and total calculation
* Automatic stock deduction after a successful sale
* Zod request validation
* Loading, empty, success, and error UI states
* Responsive POS-style interface
* RESTful API
* MongoDB persistence

## Tech Stack

| Layer      | Technologies                           |
| ---------- | -------------------------------------- |
| Backend    | Node.js, Express.js, MongoDB, Mongoose |
| Validation | Zod                                    |
| Frontend   | React, Vite, React Router, Axios       |

## Project Structure

```text
the-task/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── invoiceController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── validate.js
│   ├── models/
│   │   ├── Invoice.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── invoiceRoutes.js
│   │   └── productRoutes.js
│   ├── validators/
│   │   ├── invoiceValidator.js
│   │   └── productValidator.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertMessage.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductForm.jsx
│   │   ├── pages/
│   │   │   ├── CashierPage.jsx
│   │   │   └── ProductsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── invoiceService.js
│   │   │   └── productService.js
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed before running the project:

* Node.js
* npm
* MongoDB

MongoDB should be running locally, or you can use a MongoDB Atlas connection string.

## MongoDB Setup

### Option A: Local MongoDB

Install and start MongoDB locally.

The default connection string used by the project is:

```text
mongodb://127.0.0.1:27017/mini-pos
```

The application uses the `mini-pos` database.

### Option B: MongoDB Atlas

You can also use MongoDB Atlas.

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your IP address in the network access settings.
4. Copy the MongoDB connection string.
5. Set the connection string as `MONGO_URI` in the backend `.env` file.

## Environment Variables

### Backend

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini-pos
```

If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Frontend

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend uses this variable as the base URL for all backend API requests.

> Do not commit real secrets or sensitive environment variables to GitHub.

## Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
npm install
```

Create the `.env` file as described above.

Then start the backend:

```bash
npm run dev
```

If the project does not have a development script, you can start it with:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
npm install
```

Create the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL displayed by Vite in your browser.

## How to Run the Full Stack Project

The frontend and backend should be running at the same time.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure MongoDB is running before starting the backend.

The communication flow is:

```text
React Frontend
      |
      | HTTP / Axios
      ↓
Express Backend
      |
      | Mongoose
      ↓
MongoDB
```

The frontend communicates with the backend through:

```text
http://localhost:5000/api
```

## Application Pages

### Products

The Products page allows the user to:

* View all products
* Add a new product
* Edit an existing product
* Delete a product
* View product prices
* View available stock

### Cashier

The Cashier page allows the user to:

* Browse available products
* Add products to the cart
* Increase or decrease quantities
* Remove products from the cart
* View the cart total
* Confirm a sale

After a successful checkout, the backend creates an invoice and deducts the purchased quantities from the corresponding products.

## API Endpoints

### Products

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/products`     | Get all products     |
| GET    | `/api/products/:id` | Get a product by ID  |
| POST   | `/api/products`     | Create a new product |
| PATCH  | `/api/products/:id` | Update a product     |
| DELETE | `/api/products/:id` | Delete a product     |

### Invoices

| Method | Endpoint        | Description                        |
| ------ | --------------- | ---------------------------------- |
| POST   | `/api/invoices` | Create an invoice and deduct stock |
| GET    | `/api/invoices` | Get all invoices                   |

> There is no `/api/health` endpoint implemented in the current backend.

## Example API Requests

### Create a Product

```json
{
  "name": "Coffee Mug",
  "price": 12.5,
  "stockQuantity": 20
}
```

Send it to:

```text
POST http://localhost:5000/api/products
```

### Get Products

```text
GET http://localhost:5000/api/products
```

### Update a Product

```json
{
  "name": "Large Coffee Mug",
  "price": 15,
  "stockQuantity": 25
}
```

Send it to:

```text
PATCH http://localhost:5000/api/products/PRODUCT_ID
```

### Delete a Product

```text
DELETE http://localhost:5000/api/products/PRODUCT_ID
```

### Create an Invoice

The frontend sends only the product ID and requested quantity:

```json
{
  "items": [
    {
      "productId": "PRODUCT_OBJECT_ID",
      "quantity": 2
    }
  ]
}
```

Send it to:

```text
POST http://localhost:5000/api/invoices
```

The backend loads the products from MongoDB, verifies that the products exist and that enough stock is available, calculates the subtotals and total price, deducts the stock, and creates the invoice.

## How Stock Deduction Works

1. The cashier adds products and quantities to the cart.
2. The frontend sends only `productId` and `quantity` to the backend.
3. The backend validates the invoice payload using Zod.
4. The backend loads each product from MongoDB.
5. The backend checks that every product exists.
6. The backend checks that enough stock is available.
7. The backend calculates each item's subtotal using the product price stored in MongoDB.
8. The backend calculates the invoice `totalPrice`.
9. The purchased quantity is deducted from the product's stock.
10. An invoice is created containing the purchased products, prices, quantities, subtotals, and total price.
11. The created invoice is returned to the frontend.
12. The cashier page refreshes the products so the updated stock is displayed.

The frontend does not send product prices when creating an invoice. Prices are retrieved from the database by the backend.

## Invoice Data

An invoice contains:

* Product ID
* Product name
* Quantity
* Product price
* Item subtotal
* Total invoice price
* Timestamp

Example invoice item:

```json
{
  "product": "PRODUCT_OBJECT_ID",
  "productName": "Coffee Mug",
  "quantity": 2,
  "price": 12.5,
  "subtotal": 25
}
```

## Validation

The backend validates incoming product and invoice data using Zod.

### Product validation

* Product name is required.
* Product price must be greater than zero.
* Stock quantity must be an integer.
* Stock quantity cannot be negative.

### Invoice validation

* An invoice must contain at least one item.
* Each item must contain a product ID.
* Quantity must be a positive integer.

Invalid requests return a `400` response with an error message.

## Error Handling

The API returns appropriate HTTP status codes for common errors, including:

* `400` — Invalid request or insufficient stock
* `404` — Product not found
* `201` — Resource successfully created
* `200` — Successful request

The frontend displays API errors using the application's alert components.

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The backend should still be configured with the appropriate MongoDB connection string and environment variables.

## Important Notes

* MongoDB must be running before starting the backend when using a local MongoDB connection.
* The backend uses port `5000` by default.
* Vite uses port `5173` by default.
* The frontend API URL can be changed through `VITE_API_URL`.
* The backend MongoDB connection can be changed through `MONGO_URI`.
* Product prices used during checkout are retrieved from the backend/database rather than being trusted from the frontend.
* CORS is enabled on the backend so the frontend can communicate with the API during local development.

## License

MIT

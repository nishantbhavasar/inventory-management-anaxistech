# Inventory Management System

A full-stack inventory management application with CRUD operations, search, and pagination. The backend is built with **Node.js**, **Express**, and **MongoDB**. The frontend is a **React** (Vite + TypeScript) SPA.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project structure](#project-structure)
- [Clone and setup](#clone-and-setup)
- [Environment variables](#environment-variables)
- [Run the project](#run-the-project)
- [API reference](#api-reference)
- [Inventory categories](#inventory-categories)
- [Frontend features](#frontend-features)

---

## Tech stack

| Layer    | Technologies |
|----------|----------------|
| Backend  | Node.js, Express 5, MongoDB, Mongoose, Joi |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Hook Form, Zod, TanStack Table, Axios |

---

## Prerequisites

| Requirement | Version / notes |
|-------------|-----------------|
| **Node.js** | **24.15.0+** Check with `node -v`. |
| **npm**     | Comes with Node.js (v11+ recommended). |
| **MongoDB** | Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string. |

Optional:

- **nodemon** — used by the server `dev` script for auto-restart (install globally or as a dev dependency if `npm run dev` fails).

---

## Project structure

```
Inventory-Management-Anaxistech/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/            # API client & inventory service
│   │   ├── components/     # Table, Drawer, Form, Pagination, etc.
│   │   ├── config/         # API path, constants (categories)
│   │   ├── hooks/          # useDebounce
│   │   └── schemas/        # Zod validation schemas
│   └── .env                # VITE_API_PATH
├── server/                 # Express backend
│   ├── src/
│   │   ├── controller/     # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── validators/     # Joi request validation
│   │   └── middleware/     # Validation, errors
│   ├── app.js              # Server entry point
│   └── .env                # PORT, MONGODB_URI
└── README.md
```

---

## Clone and setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Inventory-Management-Anaxistech
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder (copy from `example.env` and extend):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inventory-management
```

Replace `MONGODB_URI` with your MongoDB connection string.

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder (copy from `example.env` and extend):

```env
VITE_API_PATH=http://localhost:5000/api/
```

---

## Environment variables

### Server (`server/.env`)

| Variable       | Required | Description                          | Example |
|----------------|----------|--------------------------------------|---------|
| `PORT`         | No       | HTTP port (default: `5000`)          | `5000` |
| `MONGODB_URI`  | Yes      | MongoDB connection string            | `mongodb://127.0.0.1:27017/inventory-management` |

### Client (`client/.env`)

| Variable         | Required | Description                    | Example |
|------------------|----------|--------------------------------|---------|
| `VITE_API_PATH`  | Yes      | Base URL for all API requests  | `http://localhost:5000/api/` |

---

## Run the project

Run **MongoDB** first, then start the backend and frontend in separate terminals.

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

If `nodemon` is not installed:

```bash
npm install -g nodemon
# or
npm install -D nodemon
```

Alternatively, run without nodemon:

```bash
npm run start
```

Server runs at: **http://localhost:5000**  
Health check: `GET http://localhost:5000/` → `Server Is Running`

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Open the URL shown in the terminal (typically **http://localhost:5173**).

### Production build (frontend)

```bash
cd client
npm run build
npm run preview
```

---

## API reference

**Base URL:** `http://localhost:5000/api`

All successful responses use this shape:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": { }
}
```

Error responses (validation, not found, server error):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "data": null
}
```

---

### 1. Get all inventory items

List items with optional search and pagination.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/items` |
| **Full URL** | `http://localhost:5000/api/items` |

#### Query parameters

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| `search`  | string | No       | —       | Case-insensitive filter on item **name**. Omit if not searching. |
| `page`    | number | No       | `1`     | Page number (1-based). |
| `limit`   | number | No       | `10`    | Items per page. |

#### Example request

```http
GET /api/items?search=mobile&page=1&limit=10
```

```http
GET /api/items?page=1&limit=10
```

#### Success response — `200 OK`

```json
{
  "success": true,
  "message": "Items Fetched Successfully",
  "data": {
    "count": 2,
    "rows": [
      {
        "_id": "6a1a94f177f44ad7f25d1462",
        "name": "Mobile",
        "category": "Electronic",
        "quantity": 50,
        "purchasePrice": 10,
        "sellingPrice": 15,
        "createdAt": "2026-05-30T07:42:41.503Z",
        "updatedAt": "2026-05-30T07:42:41.503Z"
      },
      {
        "_id": "6a1a950977f44ad7f25d1463",
        "name": "Pizza",
        "category": "Food",
        "quantity": 5,
        "purchasePrice": 100,
        "sellingPrice": 150,
        "createdAt": "2026-05-30T07:43:05.874Z",
        "updatedAt": "2026-05-30T07:43:05.874Z"
      }
    ]
  }
}
```

| Field | Description |
|-------|-------------|
| `data.count` | Total number of matching items (used for pagination). |
| `data.rows` | Array of items for the current page. |

---

### 2. Get inventory item by ID

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/items/:id` |
| **Full URL** | `http://localhost:5000/api/items/:id` |

#### Path parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | MongoDB ObjectId of the item. |

#### Example request

```http
GET /api/items/6a1a950977f44ad7f25d1463
```

#### Success response — `200 OK`

```json
{
  "success": true,
  "message": "Item Fetched Successfully",
  "data": {
    "_id": "6a1a950977f44ad7f25d1463",
    "name": "Pizza",
    "category": "Food",
    "quantity": 5,
    "purchasePrice": 100,
    "sellingPrice": 150,
    "createdAt": "2026-05-30T07:43:05.874Z",
    "updatedAt": "2026-05-30T07:43:05.874Z"
  }
}
```

#### Error response — item not found — `400 Bad Request`

```json
{
  "success": false,
  "message": "Item With Given Id Not Exist",
  "data": null
}
```

#### Error response — invalid ID — `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Id format is wrong",
  "data": null
}
```

---

### 3. Create inventory item

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/items` |
| **Full URL** | `http://localhost:5000/api/items` |
| **Content-Type** | `application/json` |

#### Request body

| Field           | Type   | Required | Description |
|-----------------|--------|----------|-------------|
| `name`          | string | Yes      | Item name (trimmed). |
| `category`      | string | Yes      | One of [allowed categories](#inventory-categories). |
| `quantity`      | number | Yes      | Stock quantity. |
| `purchasePrice` | number | Yes      | Purchase price. |
| `sellingPrice`  | number | Yes      | Selling price. |

#### Example request

```http
POST /api/items
Content-Type: application/json
```

```json
{
  "name": "Pizza",
  "category": "Food",
  "quantity": 5,
  "purchasePrice": 100,
  "sellingPrice": 150
}
```

#### Success response — `201 Created`

```json
{
  "success": true,
  "message": "Item Created Successfully",
  "data": {
    "_id": "6a1a950977f44ad7f25d1463",
    "name": "Pizza",
    "category": "Food",
    "quantity": 5,
    "purchasePrice": 100,
    "sellingPrice": 150,
    "isDeleted": false,
    "createdAt": "2026-05-30T07:43:05.874Z",
    "updatedAt": "2026-05-30T07:43:05.874Z"
  }
}
```

#### Error response — validation — `400 Bad Request`

```json
{
  "success": false,
  "statusCode": 400,
  "message": "\"name\" is required",
  "data": null
}
```

---

### 4. Update inventory item

| | |
|---|---|
| **Method** | `PUT` |
| **Path** | `/items/:id` |
| **Full URL** | `http://localhost:5000/api/items/:id` |
| **Content-Type** | `application/json` |

#### Path parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | MongoDB ObjectId of the item. |

#### Request body

All fields are validated when sent. The frontend sends all fields as required.

| Field           | Type   | Required (API) | Description |
|-----------------|--------|----------------|-------------|
| `name`          | string | Optional*      | Item name. |
| `category`      | string | Optional*      | Allowed category value. |
| `quantity`      | number | Optional*      | Stock quantity. |
| `purchasePrice` | number | Optional*      | Purchase price. |
| `sellingPrice`  | number | Optional*      | Selling price. |

\*Backend Joi schema allows partial updates; the React app always sends the full payload.

#### Example request

```http
PUT /api/items/6a1a94f177f44ad7f25d1462
Content-Type: application/json
```

```json
{
  "name": "Mobile Phone",
  "category": "Electronic",
  "quantity": 5,
  "purchasePrice": 10,
  "sellingPrice": 15
}
```

#### Success response — `201 Created`

```json
{
  "success": true,
  "message": "Item Updated Successfully",
  "data": {
    "updated": true
  }
}
```

#### Error response — item not found — `400 Bad Request`

```json
{
  "success": false,
  "message": "Item With Given Id not Exists",
  "data": null
}
```

---

### 5. Delete inventory item

Soft-deletes the item (`isDeleted: true`).

| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/items/:id` |
| **Full URL** | `http://localhost:5000/api/items/:id` |

#### Path parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | MongoDB ObjectId of the item. |

#### Example request

```http
DELETE /api/items/6a1a950977f44ad7f25d1463
```

#### Success response — `200 OK`

```json
{
  "success": true,
  "message": "Item Deleted Successfully",
  "data": {}
}
```

#### Error response — item not found — `400 Bad Request`

```json
{
  "success": false,
  "message": "Item Not Exists With Given ID",
  "data": null
}
```

---

### 404 — Route not found

```json
{
  "statusCode": 404,
  "message": "Route Not Found",
  "success": false,
  "data": null
}
```

---

## Inventory categories

Allowed values for `category` (backend enum and frontend dropdown):

- `Electronic`
- `Food`
- `Drink`
- `Accessories`
- `Home`
- `Medicine`

---

## Frontend features

The React app (`client/`) provides:

| Feature | Description |
|---------|-------------|
| **Inventory table** | Columns: Name, Category, Quantity, Purchase price, Selling price, Created at, Actions. |
| **Search** | Debounced search (500ms) by item name; resets to page 1 on change. |
| **Pagination** | 10 items per page; driven by API `count` and `page` query. |
| **View** | Eye icon → side drawer loads item via `GET /items/:id`. |
| **Create** | “Create item” button → drawer with validated form (`POST /items`). |
| **Edit** | Pencil icon → drawer fetches item, pre-fills form (`PUT /items/:id`). |
| **Delete** | Trash icon → confirmation dialog → `DELETE /items/:id`. |

**Form validation (client):** Zod schema + React Hook Form (`@hookform/resolvers/zod`).

**Shared UI components:** `Table`, `Pagination`, `Button`, `Input`, `Select`, `Drawer`.

---

## Quick API summary

| # | Method   | Endpoint        | Description |
|---|----------|-----------------|-------------|
| 1 | `GET`    | `/api/items`    | List items (search, pagination) |
| 2 | `GET`    | `/api/items/:id`| Get one item |
| 3 | `POST`   | `/api/items`    | Create item |
| 4 | `PUT`    | `/api/items/:id`| Update item |
| 5 | `DELETE` | `/api/items/:id`| Delete item (soft delete) |

---

## Author

nishant

## License

ISC

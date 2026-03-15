## Food Delivery App – Full Stack

A full-stack food delivery web application with **React + Tailwind**, **Node.js/Express**, **MongoDB Atlas**, **JWT auth (access + refresh)**, **Socket.io**, **Razorpay integration hooks**, **Cloudinary-ready models**, and **admin analytics with Recharts**.

### 1. Project structure

- **server** – Node/Express API, MongoDB models, auth, orders, payments, sockets, recommendations, admin stats.
- **client** – Vite + React + Tailwind single-page app with role-based routing and dashboards.

### 2. Backend setup (`server`)

1. Install deps:

```bash
cd server
npm install
```

2. Create `.env` in `server`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=your-mongodb-atlas-uri

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

3. Seed sample data:

```bash
npm run seed
```

4. Run backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### 3. Frontend setup (`client`)

1. Install deps:

```bash
cd client
npm install
```

2. Create `.env` in `client`:

```env
VITE_API_URL=http://localhost:5000
```

3. Run dev server:

```bash
npm run dev
```

The app will run on `http://localhost:5173`.

### 4. Implemented features (high level)

- **Auth**: signup/login, JWT access + refresh (refresh in httpOnly cookie), rate-limited login, logout.
- **Roles**: `customer`, `owner`, `agent`, `admin` with protected routes and role checks.
- **Restaurants & Menu**: paginated listing, filters, search, menu CRUD for owners, open/closed logic based on `openingHours`.
- **Orders**: cart in `localStorage`, checkout with delivery fee, order history, live tracking via Socket.io.
- **Payments**: Razorpay order creation + signature verification on backend (frontend wired for simple demo; can be extended to open Razorpay widget).
- **Reviews**: create/view restaurant reviews.
- **Recommendations**: `/api/recommendations/:userId` with scoring  
  `score = (orderCount × 3) + (avgRating × 2) + timeBonus`.
- **Admin dashboard**: orders per day, weekly revenue, top 5 dishes, user/restaurant/order stats (Recharts), user approvals, orders list.

### 5. Notes

- Cloudinary + Razorpay secrets must be your own; never commit real keys.
- Socket.io rooms:
  - Restaurant owners join restaurant ID for `order:placed`.
  - Customers join user ID for `order:statusUpdate` and `order:confirmed`.
  - Agents join user ID for `agent:assigned`.
- **Live map tracking** uses OpenStreetMap (free, no API key required). The agent must allow browser GPS permission to share location; the customer must allow browser location access on the order tracking page.

- This project is intentionally minimal but structured so you can iterate with more complex UI and validations.




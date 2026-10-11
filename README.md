# PricePilot — Smart Shopping Intelligence

PricePilot helps users make informed online shopping decisions by detecting product details, saving products, comparing available offers, tracking historical prices, and notifying users when prices reach their target.

## Project Architecture (Monorepo)

- `apps/extension`: Chrome/Edge Browser Extension (React + Vite + MV3)
- `apps/dashboard`: Web Dashboard (React + Vite + Recharts)
- `apps/backend`: Node.js/Express Backend with SQLite (Sequelize)
- `packages/shared`: Shared types and utilities

## Deployment & Setup

### Prerequisites
- Node.js (v18+)

### Environment Variables
Copy `.env.example` to `.env` inside `apps/backend` and set the variables:
```bash
PORT=3000
NODE_ENV=production
JWT_SECRET=your_secure_random_string
CLIENT_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:3000/api/v1
```

### Installation and Running locally
1. From the root directory, run `npm install` to install all workspace dependencies.
2. To run the backend and dashboard in development mode: `npm run dev`
3. Backend will be available at `http://localhost:3000`
4. Dashboard will be available at `http://localhost:5173`

### Extension Installation (Chrome)
1. Navigate to `apps/extension` and run `npm run build`.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked** and select the `PricePilot/apps/extension/dist` folder.

### Testing
Run `npm run test` from the root directory, or specifically in `apps/backend` using `vitest`.

## API Documentation

| Endpoint | Method | Protected | Description |
|---|---|---|---|
| `/api/v1/health` | GET | No | Check API status |
| `/api/v1/auth/register` | POST | No | Register new user |
| `/api/v1/auth/login` | POST | No | Login user and get JWT |
| `/api/v1/auth/me` | GET | Yes | Get current user profile |
| `/api/v1/products/resolve` | POST | No | Identify product & insert price observation |
| `/api/v1/products/:id/history` | GET | Yes | Fetch historical price observations |
| `/api/v1/watchlist` | GET | Yes | Get user's watchlist |
| `/api/v1/watchlist` | POST | Yes | Add product to watchlist |
| `/api/v1/alerts` | POST | Yes | Create a target price alert |
| `/api/v1/alerts` | GET | Yes | List active user alerts |

## Security Hardening
- **Authentication**: JWT is used for stateless authentication.
- **Passwords**: Hashed with `bcrypt` before storage.
- **CORS**: Restricted via `helmet` and explicit `CLIENT_ORIGIN` allowlists in production.
- **NoSQL Injection**: Express validation middleware (e.g. Zod) is recommended for all production payload verifications.


# PricePilot Deployment Guide

## 🚀 1. Extension Distribution
Your Chrome extension is completely built and packaged into a zip file located at:
`PricePilot-Extension.zip` (in the root folder).
You can send this zip file to anyone. They just need to extract it and load the folder into `chrome://extensions/` (Developer Mode).

## 🌍 2. Deploying the Backend & Frontend Online

To make PricePilot work online, you need to deploy the Backend API and the Frontend Dashboard.

### Step 1: Database (SQLite / Embedded)
PricePilot utilizes an embedded SQLite database (`database.sqlite`) managed via Sequelize with automatic schema sync (`alter: true`).
- **No external database cluster (like MongoDB Atlas) is required!**
- For persistent production deployments (e.g., Render, Railway, Fly.io, or VPS), attach a persistent disk volume to retain data between redeploys, or run directly.

### Step 2: Deploy Backend (Render, Railway, or VPS)
We recommend deploying the Node.js backend on **Render.com** or **Railway.app** (Free / low-cost tiers available).
1. Push your PricePilot code to GitHub.
2. On Render/Railway, create a new "Web Service" and connect your GitHub repo.
3. **Root Directory:** `apps/backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Environment Variables:**
   - `JWT_SECRET`: A secure random string (e.g., `supersecretjwtkey`)
   - `PORT`: `3000`
   - `CLIENT_ORIGIN`: Your deployed dashboard URL (e.g., `https://pricepilot.vercel.app`)
   - `NODE_ENV`: `production`

### Step 3: Deploy Frontend Dashboard (Vercel)
Vercel is perfect for deploying Vite React apps.
1. Go to [Vercel](https://vercel.com) and import your GitHub repo.
2. **Root Directory:** `apps/dashboard`
3. Vercel will automatically detect Vite and run `npm run build`.
4. You will get a live URL (e.g., `pricepilot.vercel.app`).

### Step 4: Update Extension Connection
Once your backend is live (e.g., `https://pricepilot-api.onrender.com`), you need to update the extension to point to it:
1. In `apps/extension/src/App.jsx`, change `http://localhost:3000` to your new live backend URL.
2. Run `npm run build` inside `apps/extension`.
3. Create a new `PricePilot-Extension.zip` for distribution.

# PricePilot Deployment Guide

## 🚀 1. Extension Distribution
Your Chrome extension is completely built and packaged into a zip file located at:
`PricePilot-Extension.zip` (in the root folder).
You can send this zip file to anyone. They just need to extract it and load the folder into `chrome://extensions/` (Developer Mode).

## 🌍 2. Deploying the Backend & Frontend Online

To make PricePilot work online, you need to deploy the Backend API and the Frontend Dashboard.

### Step 1: Database (MongoDB Atlas)
Currently, PricePilot uses MongoDB. The easiest way to host this for free is **MongoDB Atlas**.
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Get your Connection String (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/pricepilot`).
3. You will set this as your `MONGO_URI` environment variable when deploying the backend.

### Step 2: Deploy Backend (Render or Railway)
We recommend deploying the Node.js backend on **Render.com** (Free tier available).
1. Push your PricePilot code to GitHub.
2. On Render, create a new "Web Service" and connect your GitHub repo.
3. **Root Directory:** `apps/backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Environment Variables:**
   - `MONGO_URI`: Your Atlas connection string
   - `JWT_SECRET`: A secure random string (e.g., `supersecretjwtkey`)
   - `PORT`: `3000`

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

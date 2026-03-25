# 🚀 Deployment Guide - Vercel & Render

Follow these steps to deploy your **Coding Classes** platform to production.

---

## 1. 🖥️ Frontend (Vercel)

The frontend is built with React + Vite and should be deployed on **Vercel**.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"New Project"**.
2. Connect your GitHub repository.
3. In the project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://coding-teacher-backend.onrender.com/api`)
5. Click **"Deploy"**.

---

## 2. 🛡️ Backend (Render)

The backend is built with Node.js & Express and should be deployed on **Render**.

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New"** -> **"Web Service"**.
2. Connect your GitHub repository.
3. In the project settings:
   - **Name:** `coding-teacher-backend`
   - **Runtime:** `Node`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
   - `JWT_SECRET`: A long random string for authentication security
   - `PORT`: `5003` (Render will handle this, but setting it explicitly doesn't hurt)
   - `NODE_ENV`: `production`
5. Click **"Create Web Service"**.

---

## 3. ⚙️ Final Configuration Check

### CORS Policy
The backend already supports Vercel domains via regex in `server.js`. If you use a custom domain later, update the `allowedOrigins` array in `backend/server.js`.

### MongoDB Network Access
If you use **MongoDB Atlas**, make sure to **Allow Access from Anywhere** (IP address `0.0.0.0/0`) or find the specific IP range for your Render instance (Render IPs change, so `0.0.0.0/0` is usually recommended for free tier).

---

## ✅ Deployment Checklist

- [ ] Frontend URL is added to `backend/server.js` (handled by `.vercel.app` regex)
- [ ] `VITE_API_URL` is set to the backend URL in Vercel
- [ ] `MONGO_URI` and `JWT_SECRET` are set in Render
- [ ] Users can login and access courses on the live site

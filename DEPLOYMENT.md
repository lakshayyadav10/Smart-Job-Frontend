# Deployment Guide

## 1. MongoDB Atlas

Create a MongoDB Atlas database and copy the connection string.

Use it as:

```env
MONGODB_URI=mongodb+srv://...
```

## 2. Backend Deployment

Deploy the `server/` folder to Render or Railway.

Recommended settings:

```txt
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Backend environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173,https://your-frontend.vercel.app
JWT_SECRET=use_a_long_random_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

After deployment, test:

```txt
https://your-backend-url/api/health
```

## 3. Frontend Deployment

Deploy the `client/` folder to Vercel.

Recommended settings:

```txt
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

Frontend environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```

After changing this variable, redeploy the frontend.

## 4. Final Test Flow

1. Register a user.
2. Save profile/resume.
3. Track a job.
4. Update status, notes, and follow-up date.
5. Generate match analysis.
6. Generate interview prep.
7. Check AI History.

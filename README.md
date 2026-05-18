# Smart Job Tracker AI SaaS

A full-stack AI-powered job application tracker for discovering roles, managing an application pipeline, tracking follow-ups, and generating AI resume-match and interview-prep insights.

## Tech Stack

- React, Vite, Tailwind CSS
- Node.js, Express.js
- MongoDB, Mongoose
- JWT authentication
- OpenAI API

## Local Setup

1. Install frontend dependencies:

```bash
cd client
npm install
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

4. Start backend:

```bash
cd server
npm run dev
```

5. Start frontend:

```bash
cd client
npm run dev
```

## Features

- User authentication with protected routes
- Job discovery with search, filters, and details
- Application tracker with statuses, notes, and follow-up dates
- Pipeline view and activity drawer
- Profile and resume storage
- AI resume-job match analysis
- AI interview prep generation
- AI history page
- Demo AI fallback for quota-limited development

## Deployment Notes

- Deploy `client/` to Vercel with build command `npm run build` and output directory `dist`.
- Deploy `server/` to a Node hosting provider such as Render or Railway.
- Use MongoDB Atlas for production database.
- Set `VITE_API_URL` in Vercel to your deployed backend URL plus `/api`.
- See `DEPLOYMENT.md` for the full deployment checklist.

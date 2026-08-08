# Task Manager — MERN Stack

A full-stack personal task management app built with **MongoDB, Express, React, and Node.js** with JWT authentication.

## Features

- **Sign up / Log in** with JWT-based authentication
- Each user sees only their own tasks
- **CRUD** — create, view, update, and delete tasks
- Task fields: title, description, status, priority, due date
- Filter tasks by status and priority
- Responsive, accessible UI with loading and error states

---

## Project Structure

```
task manager/
├── backend/         # Node.js + Express API
│   ├── models/      # Mongoose schemas (User, Task)
│   ├── routes/      # auth.js, tasks.js
│   ├── middleware/  # auth.js (JWT protect)
│   └── server.js
└── frontend/        # React app
    └── src/
        ├── components/  # Navbar, TaskCard, TaskModal
        ├── context/     # AuthContext
        ├── hooks/       # useTasks
        ├── pages/       # Login, Signup, Dashboard
        └── utils/       # api.js (axios instance)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy `.env.example`):

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

API will run at `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (copy `src/.env.example`):

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:

```bash
npm start
```

App will run at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Get profile |
| GET | /api/tasks | ✓ | Get all tasks (supports ?status= ?priority=) |
| POST | /api/tasks | ✓ | Create task |
| GET | /api/tasks/:id | ✓ | Get single task |
| PUT | /api/tasks/:id | ✓ | Update task |
| DELETE | /api/tasks/:id | ✓ | Delete task |

---

## Deployment

### Backend — [Render](https://render.com)

1. Push code to GitHub
2. Create a new **Web Service** on Render
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_ORIGIN=<your-vercel-url>`

### Frontend — [Vercel](https://vercel.com)

1. Push code to GitHub
2. Import the repo in Vercel, set root directory to `frontend`
3. Set environment variable: `REACT_APP_API_URL=https://<your-render-service>.onrender.com/api`
4. Deploy

---

## Tech Stack

- **MongoDB** + **Mongoose** — database and ODM
- **Express.js** — REST API framework
- **React** — UI with functional components + hooks (useState, useEffect, useCallback, useContext)
- **Node.js** — runtime
- **JWT** + **bcryptjs** — authentication and password hashing
- **Axios** — HTTP client
- **React Router v6** — client-side routing

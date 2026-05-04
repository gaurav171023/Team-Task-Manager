# TaskFlow — Team Task Manager

A full-stack team task management application with role-based access control.

## Tech Stack
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT Auth
- **Frontend**: React.js (Vite), Tailwind CSS, Axios

## Features
- JWT Authentication (Signup/Login with ADMIN/MEMBER roles)
- Project management (create, view, delete)
- Task management (create, assign, status tracking: TODO/IN_PROGRESS/DONE)
- Priority levels (LOW/MEDIUM/HIGH) with overdue detection
- Dashboard with stats (total, my tasks, overdue, by status)
- Role-based access (Admins can create tasks/projects; Members can view)
- Kanban-style project detail view

## Setup & Run Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/projects | Yes | List projects |
| POST | /api/projects | Yes | Create project |
| GET | /api/projects/:id | Yes | Project details + tasks |
| PUT | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Delete project |
| POST | /api/projects/:id/members | Yes | Add member |
| DELETE | /api/projects/:id/members/:userId | Yes | Remove member |
| GET | /api/tasks | Yes | List tasks (filterable) |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks/dashboard | Yes | Dashboard stats |
| GET | /api/tasks/:id | Yes | Task details |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |
| GET | /api/users | Yes | List all users |

## Deployment (Railway)
1. Push to GitHub
2. Create Railway project → Add service from repo (backend folder)
3. Add Railway PostgreSQL plugin → DATABASE_URL auto-set
4. Set JWT_SECRET in Railway environment variables
5. Deploy frontend as second Railway service or on Vercel
6. Set VITE_API_URL in frontend env to backend Railway URL

## Live URL
[https://your-app.railway.app](https://your-app.railway.app)

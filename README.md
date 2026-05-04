# TaskFlow — Team Task Manager

A full-stack team task management application with role-based access control.

## Tech Stack
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite (dev) / PostgreSQL (prod), JWT Auth
- **Frontend**: React.js (Vite), Tailwind CSS, Axios
- **Authentication**: JWT with 7-day expiry, bcryptjs password hashing

## Features
✅ JWT Authentication (Signup/Login with ADMIN/MEMBER roles)
✅ Project management (create, view, delete)
✅ Team member management (add/remove members to projects)
✅ Task management (create, assign, status tracking: TODO/IN_PROGRESS/DONE)
✅ Priority levels (LOW/MEDIUM/HIGH) with overdue detection
✅ Dashboard with stats (total tasks, my tasks, overdue count, breakdown by status)
✅ Role-based access control:
   - **ADMIN**: Can create projects, create/delete tasks, manage team members
   - **MEMBER**: Can view projects, move tasks, view team members
✅ Kanban-style project detail view with drag functionality
✅ Task filtering by status and project
✅ Overdue task detection and highlighting
✅ Password hashing with bcryptjs
✅ Responsive design with Tailwind CSS

## Setup & Run Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Already configured with SQLite for development
npx prisma migrate dev --name init
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Environment Variables

**Backend (.env):**
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_jwt_key_here_change_me_in_production"
PORT=5000
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:5000/api
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
| DELETE | /api/projects/:id/members/:memberId | Yes | Remove member |
| GET | /api/tasks | Yes | List tasks (filterable) |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks/dashboard | Yes | Dashboard stats |
| GET | /api/tasks/:id | Yes | Task details |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |
| GET | /api/users | Yes | List all users |

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app & middleware config
│   │   ├── server.js                 # Server entry point (port 5000)
│   │   ├── controllers/              # Business logic (Auth, Projects, Tasks, Users)
│   │   ├── middleware/               # JWT auth, role-based authorization
│   │   └── routes/                   # API routes
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── migrations/               # Database version history
│   ├── dev.db                        # SQLite database (development)
│   ├── .env.example                  # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── components/               # Navbar, ProtectedRoute
│   │   ├── context/                  # AuthContext for global state
│   │   ├── pages/                    # Login, Signup, Dashboard, Projects, Tasks, ProjectDetail
│   │   └── api/                      # Axios instance with JWT auto-injection
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## How to Use the App

### 1. Create an Account
- Go to http://localhost:5173
- Click "Sign up"
- Fill in: Name, Email, Password, Role (ADMIN/MEMBER)
- Click "Create Account"

### 2. Create a Project (ADMIN only)
- Click "Projects" in navbar
- Click "+ New Project"
- Enter project name and description
- Click "Create"

### 3. Add Team Members (ADMIN only)
- Open a project
- Scroll to "Add Team Member" form
- Select a user from dropdown
- Click "Add Member"

### 4. Create Tasks (ADMIN only)
- In project detail page, click "+ Add Task"
- Fill in: Title, Description, Priority, Due Date, Assignee
- Click "Create Task"

### 5. Manage Tasks (All users)
- View tasks in Kanban columns: TODO, IN_PROGRESS, DONE
- Click status buttons to move tasks between columns
- ADMIN can delete tasks

### 6. View Dashboard
- Click "Dashboard" to see statistics
- Shows: Total tasks, My tasks, Overdue count, Breakdown by status, Recent tasks

## Deployment (Railway)

### Backend
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: complete team task manager"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Select this repository
   - Select `backend` folder as root

3. **Add PostgreSQL Plugin**
   - In Railway, click "Add Service"
   - Select "PostgreSQL"
   - Railway auto-sets `DATABASE_URL` environment variable

4. **Set Environment Variables**
   - In Railway, go to "Variables"
   - Add `JWT_SECRET=your_super_secret_key_here`
   - Set `NODE_ENV=production`

5. **Configure Start Command**
   - Set: `npx prisma migrate deploy && node src/server.js`

### Frontend

**Option 1: Deploy on Vercel (Recommended)**
- Create new Vercel project from GitHub
- Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
- Deploy

**Option 2: Deploy on Railway as second service**
- Add Node.js service in same Railway project
- Set start command: `npm run build && npm run preview`
- Set environment: `VITE_API_URL=https://your-backend.railway.app/api`

## Live Example

Once deployed:
- **Backend API**: `https://your-app.railway.app/api`
- **Frontend**: `https://your-app.vercel.app`

## Security Notes

⚠️ **Before Production:**
- Change `JWT_SECRET` to a strong random string
- Enable HTTPS
- Set `CORS_ORIGIN` to frontend domain only
- Use PostgreSQL instead of SQLite
- Add rate limiting
- Enable request validation and sanitization
- Keep dependencies updated

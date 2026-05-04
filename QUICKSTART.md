# Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Option 1: Using Docker (Recommended for First-Time Setup)

```bash
# 1. Start PostgreSQL with Docker
docker-compose up -d

# 2. Navigate to backend
cd backend

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. Start backend development server
npm run dev

# 5. In a new terminal, start frontend
cd frontend
npm run dev

# 6. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
```

### Option 2: Using Existing PostgreSQL

```bash
# 1. Make sure PostgreSQL is running on localhost:5432
# Default credentials (update in backend/.env if different):
# - User: postgres
# - Password: postgres
# - Database: taskmanager

# 2. Navigate to backend
cd backend

# 3. Update .env with your database credentials if needed
# vi .env  (or edit manually)

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Start backend development server
npm run dev

# 6. In a new terminal, start frontend
cd frontend
npm run dev

# 7. Open http://localhost:5173
```

## 🔐 First Login / Signup

### Create Your First Account

1. Open http://localhost:5173
2. Click "Sign up"
3. Fill in:
   - **Full Name**: Your name
   - **Email**: any email (e.g., admin@example.com)
   - **Password**: any password
   - **Role**: Select "ADMIN" for full access
4. Click "Create Account"

### Create a Project

1. Click "Projects" in the navbar
2. Click "+ New Project"
3. Enter:
   - **Project name**: "My First Project"
   - **Description**: Optional
4. Click "Create"

### Create a Task

1. Click on your project
2. Click "+ Add Task"
3. Fill in:
   - **Task title**: "My First Task"
   - **Description**: Optional
   - **Status**: "TODO"
   - **Priority**: "MEDIUM"
   - **Due Date**: Optional
   - **Assigned To**: Leave blank for now
4. Click "Create Task"

### Update Task Status

1. On the project detail page, you'll see a Kanban board
2. Click the "→ Start" button on a TODO task to move it to IN_PROGRESS
3. Click "→ Done" to mark it as complete

## 📊 Dashboard

The Dashboard shows:
- **Total Tasks**: All tasks in the system
- **My Tasks**: Tasks assigned to you
- **Overdue**: Tasks past their due date
- **Todo**: Tasks in TODO status
- **In Progress**: Tasks being worked on
- **Done**: Completed tasks
- **Recent Tasks**: Last 5 tasks created

## 🔄 Multi-User Setup

### Create Second User

1. Go to http://localhost:5173/signup
2. Sign up with different email (e.g., member@example.com)
3. Choose "MEMBER" role
4. Click "Create Account"

### Add User to Project

1. Go to Projects
2. Click on a project
3. Scroll to "Team Members" section
4. To add member: API only (see Advanced section)

## 🔧 Advanced Usage

### Manage Projects as Admin

**Admin can:**
- Create projects
- Delete projects
- Create tasks in projects
- Update task status
- Assign tasks to users

**Member can:**
- View projects (if member)
- View tasks
- See assigned tasks
- Update own assigned tasks

### Filter Tasks

1. Go to "Tasks" page
2. Use dropdowns to filter by:
   - **Status**: TODO, IN_PROGRESS, DONE
   - **Project**: Select specific project

### Overdue Tasks

- Tasks with due date in the past are marked as "OVERDUE"
- Displayed in red on Tasks page
- Shown in dashboard count

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
# Using Docker:
docker-compose ps

# Should show postgres container as running
# If not: docker-compose up -d
```

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### "Frontend won't load"
```bash
# Check if Vite dev server is running on port 5173
# In frontend terminal, you should see:
# Local: http://localhost:5173/
```

### JWT Error / Login fails
```bash
# Clear browser localStorage and try again
# Open DevTools (F12) > Console:
localStorage.clear()
# Then refresh and login again
```

### Database migration fails
```bash
# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset

# Or use Prisma Studio to debug
npx prisma studio
# Opens GUI at http://localhost:5555
```

## 📱 Using Prisma Studio (Database GUI)

```bash
cd backend
npx prisma studio
```

Opens interactive database browser at http://localhost:5555

You can:
- View all tables and records
- Create new records
- Edit existing records
- Delete records
- Filter and search

## 🚀 Next Steps

### For Development
- Explore the [code structure](./IMPLEMENTATION_NOTES.md)
- Run the [full setup guide](./SETUP.md)
- Check [API documentation](./README.md)

### For Deployment
- Deploy backend to [Railway](https://railway.app)
- Deploy frontend to [Vercel](https://vercel.com) or Railway
- See [README.md](./README.md#deployment-railway) for detailed steps

### For Customization
- Edit components in `frontend/src/components/`
- Edit pages in `frontend/src/pages/`
- Edit API calls in `frontend/src/api/`
- Edit backend logic in `backend/src/controllers/`
- Modify database schema in `backend/prisma/schema.prisma`

## 📚 Documentation

- [README.md](./README.md) - Project overview and API reference
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) - Architecture and technical details
- [docker-compose.yml](./docker-compose.yml) - PostgreSQL setup

## 💡 Tips

1. **Always start backend first**: Frontend needs backend API to function
2. **Use Prisma Studio**: Great way to inspect database during development
3. **Check browser console**: Frontend errors appear here
4. **Check terminal output**: Backend errors appear in terminal
5. **Use admin role**: Makes testing easier (no permission restrictions)

## 🎓 Example Workflows

### Creating a Team Project

```
1. Admin creates account
2. Admin creates project
3. Admin signs up second user
4. (Add user to project via API or backend)
5. Both users can now see and edit project tasks
```

### Task Workflow

```
1. Create task in TODO status
2. Click → Start to move to IN_PROGRESS
3. Set due date and assign to team member
4. Team member can see it in their tasks
5. Update status to DONE when complete
6. Task appears in Done count on dashboard
```

## 🆘 Get Help

1. Check terminal for error messages
2. Check browser console (F12)
3. Review [SETUP.md](./SETUP.md) for common issues
4. Check [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) for architecture questions
5. Review API endpoints in [README.md](./README.md)

---

**Happy task managing! 🎯**

Start with `docker-compose up -d` and `npm run dev` in both backend and frontend folders.

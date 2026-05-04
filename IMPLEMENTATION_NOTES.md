# Implementation Notes

## Project Structure Overview

```
team-task-manager/
├── backend/                          # Express.js Backend
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── src/
│   │   ├── controllers/             # Business logic for each domain
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/              # Authentication & authorization
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── routes/                  # API endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── app.js                   # Express app configuration
│   │   └── server.js                # Entry point
│   ├── .env                         # Environment variables (local)
│   ├── .env.example                 # Template for .env
│   ├── package.json
│   ├── railway.toml                 # Railway deployment config
│   └── node_modules/
├── frontend/                        # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js    # Axios API client with JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   └── ProtectedRoute.jsx  # Private route wrapper
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Sign up page
│   │   │   ├── Dashboard.jsx       # Dashboard with stats
│   │   │   ├── Projects.jsx        # Projects list
│   │   │   ├── ProjectDetail.jsx   # Kanban board for project
│   │   │   └── Tasks.jsx           # All tasks with filters
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind CSS
│   ├── index.html                  # HTML template
│   ├── postcss.config.js           # PostCSS config for Tailwind
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── vite.config.js              # Vite bundler config
│   ├── package.json
│   └── node_modules/
├── docker-compose.yml              # PostgreSQL via Docker
├── .gitignore                       # Git ignore rules
├── README.md                        # Project overview
├── SETUP.md                         # Setup instructions
├── setup.bat                        # Windows setup script
└── setup.sh                         # Unix setup script
```

## Key Technologies

### Backend Stack
- **Express.js**: Web framework
- **Prisma**: ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT for authentication
- **cors**: Cross-origin resource sharing
- **nodemon**: Auto-reload in development

### Frontend Stack
- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS
- **PostCSS & Autoprefixer**: CSS processing

## Architecture Decisions

### 1. Database Schema
- **User**: Stores user info with role (ADMIN/MEMBER)
- **Project**: Projects with optional descriptions
- **ProjectMember**: Many-to-many relation between User and Project with role
- **Task**: Tasks with status (TODO/IN_PROGRESS/DONE) and priority (LOW/MEDIUM/HIGH)

### 2. Authentication Flow
```
Client                          Server
  |                               |
  |-- POST /api/auth/signup ------>|
  |                            (hash password)
  |<-- JWT Token + User Info ------|
  |                        (store in localStorage)
  |
  |-- GET /api/projects ---------->|
  |  (Header: Authorization: Bearer <JWT>)
  |                            (verify JWT)
  |<-- Projects Array -------------|
```

### 3. State Management
- **AuthContext**: Global auth state (user, login, signup, logout, loading)
- **Component State**: Local state for forms and UI
- **API Calls**: Via axios instance with automatic JWT injection

### 4. Authorization Model
- **ADMIN**: Can create/delete projects, create/update tasks, manage members
- **MEMBER**: Can view projects, view/update tasks assigned to them

### 5. Error Handling
- Try-catch blocks in all controllers
- HTTP status codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- Frontend shows error messages from backend

## API Endpoints Summary

### Authentication (No Auth Required)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Auth Required)

### Projects (Auth Required)
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project with tasks
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks (Auth Required)
- `GET /api/tasks` - List tasks (filterable)
- `POST /api/tasks` - Create task
- `GET /api/tasks/dashboard` - Dashboard statistics
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users (Auth Required)
- `GET /api/users` - List all users

## Data Flow Examples

### Creating a Task
1. User fills task form on ProjectDetail page
2. Form submits to `POST /api/tasks` with title, description, status, priority, dueDate, assignedToId, projectId
3. Backend validates all required fields
4. Prisma creates task in database
5. Task is returned with populated assignedTo and createdBy relations
6. Frontend updates project state and re-renders

### Updating Task Status
1. User clicks "→ Start" or "→ Done" button on Kanban card
2. Button triggers `updateTaskStatus(taskId, newStatus)`
3. Calls `PUT /api/tasks/:id` with new status
4. Backend updates task status
5. Frontend fetches updated project and re-renders

### Dashboard Stats
1. User navigates to Dashboard
2. useEffect calls `GET /api/tasks/dashboard`
3. Backend counts:
   - Total tasks
   - Tasks assigned to current user
   - Overdue tasks
   - Tasks by status (TODO, IN_PROGRESS, DONE)
4. Returns 5 most recent tasks
5. Frontend renders statistics cards

## Security Considerations

### Authentication
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with 7-day expiry
- JWT_SECRET must be strong (change in production!)

### Authorization
- JWT verification on all protected routes
- Role-based access control (ADMIN/MEMBER)
- Users can only see projects they're members of (non-ADMIN)
- CORS enabled for specified origins

### Data Validation
- Input validation on all endpoints
- Type checking via Prisma schema
- SQL injection prevention via Prisma

## Performance Optimizations

1. **Database Relations**: Prisma includes related data in queries to avoid N+1 problems
2. **Pagination**: Can be added to task/project listings
3. **Caching**: JWT tokens cached in localStorage
4. **Bundling**: Vite optimizes frontend bundle size
5. **Lazy Loading**: React Router enables code splitting

## Deployment Checklist

### Before Deploying to Production

Backend:
- [ ] Set strong JWT_SECRET
- [ ] Update DATABASE_URL to production database
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Add error logging (e.g., Sentry)

Frontend:
- [ ] Update VITE_API_URL to production backend URL
- [ ] Enable production mode
- [ ] Optimize bundle size
- [ ] Add analytics
- [ ] Configure error tracking

### Railway Deployment

Backend Service:
1. Connect GitHub repository
2. Select backend folder as root
3. Add PostgreSQL plugin (auto-sets DATABASE_URL)
4. Set JWT_SECRET in environment variables
5. Deploy

Frontend Service:
1. Connect GitHub repository
2. Select frontend folder as root
3. Build command: `npm run build`
4. Start command: `npm run preview`
5. Set VITE_API_URL to backend Railway URL

## Future Enhancements

1. **Notifications**: WebSocket for real-time updates
2. **File Uploads**: Attach documents to tasks
3. **Comments**: Add discussion threads to tasks
4. **Time Tracking**: Track time spent on tasks
5. **Reporting**: Generate project reports
6. **Search**: Full-text search for tasks/projects
7. **Mobile App**: React Native version
8. **Dark Mode**: Theme toggle
9. **Integrations**: Slack, GitHub, Calendar
10. **Audit Logs**: Track all user actions

## Testing

### Backend (Not included, but recommended)
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test files in __tests__/ directory
# Run: npm test
```

### Frontend (Not included, but recommended)
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Create .test.jsx files
# Run: npm test
```

## Debugging Tips

1. **Backend Debugging**:
   - Check logs: `npm run dev` output
   - Use Prisma Studio: `npx prisma studio`
   - Test endpoints: Postman or curl

2. **Frontend Debugging**:
   - Browser DevTools (F12)
   - React DevTools extension
   - Network tab to inspect API calls
   - Console for errors

3. **Common Issues**:
   - CORS errors: Check backend CORS config
   - Database connection: Verify DATABASE_URL
   - JWT errors: Check token expiry and signature
   - Port conflicts: Check if ports 5000/5173 are free

## Code Style

- **Backend**: Common Express.js patterns
- **Frontend**: React Hooks, functional components
- **Naming**: camelCase for variables, PascalCase for components/classes
- **Formatting**: 2-space indentation (Node.js convention)

## Documentation

- See README.md for overview
- See SETUP.md for installation steps
- See this file for architecture details
- API documented inline in route definitions

## Contributing

1. Create feature branch from main
2. Make changes with descriptive commits
3. Test locally before pushing
4. Create Pull Request with description
5. Code review before merging

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready

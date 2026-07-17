# Team Task Manager Walkthrough

This document explains the project from the ground up in plain language. The goal is not just to describe what the code does, but why the code is organized this way and how the pieces work together.

## 1. What This App Is

Team Task Manager is a full-stack task tracking app with:

- A Node.js and Express backend
- Prisma as the database layer
- SQLite in the current schema
- JWT-based authentication
- A React frontend built with Vite
- Protected pages that require a valid login
- Deployment wiring for Railway on the backend and Vercel on the frontend

The app lets users sign up, log in, create projects, add members, create tasks, update task status, and view dashboard statistics.

## 2. Folder Structure

### Root Folder

The root contains project-level documentation and deployment helpers. These files are there so someone can understand, run, and deploy the app without digging into the source first.

- `README.md` gives a shorter overview of the project.
- `DEPLOYMENT.md` explains deployment options in more detail.
- `QUICKSTART.md`, `SETUP.md`, and the setup scripts are there to help someone get the project running quickly.
- `docker-compose.yml` is for local PostgreSQL support if someone wants to use Docker for infrastructure.

### Backend Folder

The backend folder is the API server.

- `backend/package.json` defines backend dependencies and scripts.
- `backend/prisma/schema.prisma` defines the data model.
- `backend/prisma/migrations/` stores the migration history.
- `backend/src/app.js` configures Express middleware and routes.
- `backend/src/server.js` starts the server.
- `backend/src/controllers/` contains the business logic.
- `backend/src/middleware/` contains authentication helpers.
- `backend/src/routes/` maps HTTP endpoints to controller functions.

### Frontend Folder

The frontend folder is the React app.

- `frontend/package.json` defines frontend dependencies and scripts.
- `frontend/src/main.jsx` mounts React into the DOM.
- `frontend/src/App.jsx` defines the route map.
- `frontend/src/api/axiosInstance.js` creates the shared API client.
- `frontend/src/context/AuthContext.jsx` manages login state.
- `frontend/src/components/` contains reusable UI pieces.
- `frontend/src/pages/` contains the screens users actually visit.
- `frontend/src/index.css` loads the Tailwind base styles.

## 3. The Best Mental Model For The Build Order

The code is organized as if it was built in this order:

1. Define the database schema first.
2. Build the backend auth and data endpoints.
3. Add route protection and authorization checks.
4. Build the frontend API client and login state.
5. Add pages for dashboard, projects, and tasks.
6. Wire deployment settings last.

That order makes sense because every later layer depends on the layer below it. The frontend cannot call useful endpoints until the backend exists. The backend cannot query tables until the schema exists. Authentication must be solved early because it affects almost every route and page.

## 4. Backend Walkthrough

### 4.1 Prisma Schema

File: `backend/prisma/schema.prisma`

This file defines the data model the whole app is built around.

- `generator client` tells Prisma to generate a JavaScript client that the app can import.
- `datasource db` points Prisma at the database using `DATABASE_URL`.
- `provider = "sqlite"` means the current schema is configured for SQLite.

#### User model

The `User` model stores people who can log in.

- `id` is the primary key.
- `name`, `email`, and `password` hold the user profile and login secret.
- `role` distinguishes `ADMIN` from `MEMBER`.
- `createdAt` records when the user was created.

The relations below the fields matter because a user can belong to many projects, be assigned to many tasks, and create many tasks.

#### Project model

The `Project` model stores a shared workspace for a team.

- `name` and `description` describe the project.
- `createdAt` and `updatedAt` make it easy to sort and display record age.
- `members` connects the project to its team members.
- `tasks` connects the project to its tasks.

#### ProjectMember model

This is a join table. It exists because projects and users have a many-to-many relationship.

- `userId` and `projectId` say which user belongs to which project.
- `role` stores the member's role inside the project.
- `@@unique([userId, projectId])` prevents the same user from being added to the same project twice.

#### Task model

The `Task` model stores work items.

- `title` is required.
- `description` adds context.
- `status` tracks progress with `TODO`, `IN_PROGRESS`, or `DONE`.
- `priority` adds urgency.
- `dueDate` lets the UI detect overdue tasks.
- `projectId` connects the task to a project.
- `assignedToId` optionally connects the task to a user.
- `createdById` records who created the task.

The relations at the bottom make Prisma load related records in a structured way.

### 4.2 Express App Setup

File: `backend/src/app.js`

This file creates the Express application and registers middleware.

- `express()` creates the app instance.
- `cors()` allows the frontend to call the backend from a different origin.
- `express.json()` lets the server read JSON bodies from API requests.
- `app.use('/api/auth', authRoutes)` and the other `app.use(...)` lines attach route groups.
- `app.get('/')` is a simple health check that returns a status message.

Why this file exists: it keeps server configuration separate from the code that actually starts the port listener.

### 4.3 Server Entry Point

File: `backend/src/server.js`

This file is tiny on purpose.

- It imports the configured app from `app.js`.
- It reads `PORT` from the environment and falls back to `5000`.
- It calls `app.listen(...)` to start the HTTP server.

Why this file exists: deployment platforms usually want one clean startup file.

### 4.4 Authentication Middleware

File: `backend/src/middleware/auth.middleware.js`

This middleware protects routes that require login.

- It looks for an `Authorization` header.
- It expects the header in the format `Bearer <token>`.
- It verifies the token with `JWT_SECRET`.
- If the token is valid, it stores the decoded payload on `req.user`.
- If the token is missing or invalid, it returns `401`.

Why this exists: the backend needs a trusted way to know which user is making the request.

### 4.5 Route Files

Files:

- `backend/src/routes/auth.routes.js`
- `backend/src/routes/project.routes.js`
- `backend/src/routes/task.routes.js`
- `backend/src/routes/user.routes.js`

Routes are the map between a URL and a controller function.

#### Auth routes

- `POST /api/auth/signup` creates a new user.
- `POST /api/auth/login` signs in a user.
- `GET /api/auth/me` returns the current user after token verification.

#### Project routes

- `router.use(auth)` protects every project route.
- `POST /api/projects` creates a project.
- `GET /api/projects` lists the projects the current user can see.
- `GET /api/projects/:id` loads one project with members and tasks.
- `PUT /api/projects/:id` updates a project.
- `DELETE /api/projects/:id` removes a project.
- `POST /api/projects/:id/members` adds a team member.
- `DELETE /api/projects/:id/members/:userId` removes a team member.

#### Task routes

- `router.use(auth)` protects every task route.
- `GET /api/tasks/dashboard` returns dashboard stats.
- `POST /api/tasks` creates a task.
- `GET /api/tasks` lists tasks with optional filters.
- `GET /api/tasks/:id` returns one task.
- `PUT /api/tasks/:id` updates a task.
- `DELETE /api/tasks/:id` removes a task.

#### User routes

- `router.use(auth)` protects the route.
- `GET /api/users` returns all users so the frontend can populate assignee and member dropdowns.

### 4.7 Auth Controller

File: `backend/src/controllers/auth.controller.js`

This file handles signup, login, and profile lookup.

#### `signup`

What it does:

- Reads `name`, `email`, `password`, and `role` from the request body.
- Rejects the request if required fields are missing.
- Checks whether the email already exists.
- Hashes the password with bcrypt before saving it.
- Stores the new user in the database.
- Creates a JWT containing the user's id, email, and role.
- Returns both the token and a safe user object without the password.

Why each step exists:

- Validation prevents bad data.
- The duplicate email check prevents account collisions.
- Password hashing prevents plaintext password storage.
- The JWT lets the frontend stay logged in without server-side sessions.

#### `login`

What it does:

- Looks up the user by email.
- Rejects invalid emails.
- Compares the submitted password with the stored hash.
- Signs a new JWT if the password is correct.
- Returns the token and user profile.

Why this exists: login should never reveal whether the email or password was wrong in a way that helps attackers.

#### `me`

What it does:

- Uses `req.user.id` from the JWT middleware.
- Fetches the current user from the database.
- Returns only safe profile fields.

Why this exists: the frontend needs a way to recover the logged-in user after a page refresh.

### 4.8 Project Controller

File: `backend/src/controllers/project.controller.js`

This file contains the logic for project management.

#### `createProject`

- Requires a project name.
- Creates the project.
- Automatically creates a `ProjectMember` row linking the creator to the project as `ADMIN`.

That automatic membership is important because the creator should immediately have access to the project they just made.

#### `getAllProjects`

- If the user is an admin, it loads every project.
- If the user is not an admin, it first looks up the projects they belong to.
- It includes member data and task counts so the frontend can render summary cards.

This is a classic example of server-side authorization: different users see different datasets.

#### `getProjectById`

- Loads one project by id.
- Includes members and tasks.
- Includes assigned user and creator info for task display.

The frontend uses this to render the project detail screen.

#### `updateProject`

- Updates the project name and description.

#### `deleteProject`

- Deletes tasks first.
- Deletes project memberships second.
- Deletes the project last.

The order matters because related records must be cleaned up before the parent is removed.

#### `addMember` and `removeMember`

- `addMember` inserts a new project membership row.
- `removeMember` deletes the matching membership row.

These endpoints support team management inside a project.

### 4.9 Task Controller

File: `backend/src/controllers/task.controller.js`

This file handles creation, editing, deletion, listing, and dashboard summaries for tasks.

#### `createTask`

- Requires a title and project id.
- Applies defaults for `status` and `priority` if the client does not supply them.
- Converts `dueDate` into a real `Date` object when present.
- Converts `assignedToId` and `projectId` into integers.
- Stores `createdById` from the logged-in user.
- Returns the created task with related user data included.

Why this exists: the backend should normalize input before writing to the database.

#### `getAllTasks`

- Builds a `where` object from query parameters.
- Supports filtering by project, status, and assignee.
- Sorts tasks by newest first.
- Includes the related project and users so the frontend does not need extra requests.

This keeps the task list page fast and simple.

#### `getTaskById`

- Fetches one task by id.
- Includes the related project, assignee, and creator.

#### `updateTask`

- Accepts partial updates.
- Converts the due date when present.
- Clears the assignee when no assignee id is provided.

#### `deleteTask`

- Deletes one task by id.

#### `getDashboardStats`

- Counts total tasks.
- Counts tasks assigned to the current user.
- Counts overdue tasks.
- Counts tasks in each status bucket.
- Loads the five newest tasks.

Why it exists: the dashboard needs summary data, not a giant task list.

### 4.10 User Controller

File: `backend/src/controllers/user.controller.js`

This file only exposes one endpoint right now.

- `getAllUsers` returns a safe list of users with id, name, email, and role.

Why this exists: the UI needs a user list to populate member and assignee dropdowns without exposing passwords.

## 5. Frontend Walkthrough

### 5.1 React Entry Point

File: `frontend/src/main.jsx`

This is the browser entry file.

- It imports React and ReactDOM.
- It imports the main app component.
- It imports the global CSS.
- It mounts the app into the root DOM element.

Why this exists: React needs a single place where the app is attached to the page.

### 5.2 App Routing

File: `frontend/src/App.jsx`

This file defines the visible routes.

- `AuthProvider` wraps the app so every page can read the login state.
- `BrowserRouter` enables client-side routing.
- `/login` and `/signup` are public pages.
- `/dashboard`, `/projects`, `/projects/:id`, and `/tasks` are protected pages.
- `ProtectedRoute` blocks access when the user is not logged in.
- `*` sends unknown routes to the dashboard.

Why this exists: routing is the backbone of the single-page app.

### 5.3 Shared Axios Client

File: `frontend/src/api/axiosInstance.js`

This is the single API client used by the whole frontend.

- `baseURL` points at the backend API.
- It uses `VITE_API_URL` when available.
- It falls back to `http://localhost:5000/api` for local development.
- A request interceptor reads the token from `localStorage`.
- If a token exists, it adds `Authorization: Bearer <token>` to every request.

Why this exists: it avoids repeating token logic in every page.

### 5.4 Auth Context

File: `frontend/src/context/AuthContext.jsx`

This file holds global authentication state.

- `user` stores the current user object.
- `loading` tells the UI whether the app is still checking a stored token.
- On first load, it looks for a token in `localStorage`.
- If a token exists, it calls `/auth/me` to verify it and hydrate the user state.
- If the token is bad, it removes it.

The helper methods do the rest:

- `login` sends credentials to the backend, stores the token, and updates the user state.
- `signup` does the same after account creation.
- `logout` removes the token and clears the user.

Why this exists: auth state should be shared across the whole frontend, not copied into each page.

### 5.5 Protected Route

File: `frontend/src/components/ProtectedRoute.jsx`

This component guards private pages.

- If the app is still loading auth state, it shows a loading screen.
- If a user exists, it renders the protected page.
- Otherwise it sends the visitor to `/login`.

Why this exists: it keeps protected pages from flashing open before auth is checked.

### 5.6 Navbar

File: `frontend/src/components/Navbar.jsx`

This is the shared top navigation bar for authenticated pages.

- It links to dashboard, projects, and tasks.
- It shows the logged-in user's name and role.
- The logout button clears auth state and sends the user back to login.

Why this exists: repeated layout should live in one component.

### 5.7 Login Page

File: `frontend/src/pages/Login.jsx`

This page is a controlled form.

- `useState` tracks email, password, loading, and error text.
- `handleSubmit` prevents the browser refresh.
- It calls the auth context `login` method.
- On success, it navigates to the dashboard.
- On failure, it shows a friendly error message.

Why this exists: login is the entry point to the protected part of the app.

### 5.8 Signup Page

File: `frontend/src/pages/Signup.jsx`

This page is similar to login, but it also collects a name and role.

- It stores the form state in React state.
- It submits the form through the auth context `signup` method.
- It redirects to the dashboard after account creation.

Why this exists: the backend needs enough information to create a user record.

### 5.9 Dashboard Page

File: `frontend/src/pages/Dashboard.jsx`

This page shows the summary of the workspace.

- It requests `/tasks/dashboard` on mount.
- It stores the returned stats in component state.
- It renders small stat cards for totals and task status buckets.
- It renders recent tasks with priority and status badges.

Why this exists: dashboards turn raw data into a quick status overview.

### 5.10 Projects Page

File: `frontend/src/pages/Projects.jsx`

This page lists projects and provides the create-project form.

- It fetches projects on mount.
- It stores the projects in state.
- It shows or hides the create form with `showForm`.
- It posts new project data to `/projects`.
- After creation, it refreshes the list.
- Clicking a project navigates to the project detail page.

Why this exists: projects are the top-level container for collaboration.

### 5.11 Project Detail Page

File: `frontend/src/pages/ProjectDetail.jsx`

This is the busiest frontend file because it combines several workflows.

- It reads the project id from the URL.
- It loads the project details and the list of users.
- It uses the auth context to know whether the current user is an admin.
- It conditionally shows the task creation form.
- It creates new tasks and refreshes the project after submission.
- It allows admins to move task status forward.
- It allows admins to delete tasks.
- It allows admins to add or remove members.
- It groups tasks into status columns so the page feels like a simple Kanban board.

Why this exists: one project page is where the main collaboration work happens.

### 5.12 Tasks Page

File: `frontend/src/pages/Tasks.jsx`

This page is the global task browser.

- It fetches projects for the filter dropdown.
- It builds a query string from the selected filters.
- It loads tasks from `/tasks` using those filters.
- It highlights overdue tasks.
- It shows priority and status badges for quick scanning.

Why this exists: users need one place to see all work across projects.

### 5.13 Global Styles

File: `frontend/src/index.css`

This file loads Tailwind and sets a small global baseline.

- `box-sizing: border-box` makes layout math easier.
- `body { margin: 0; }` removes default browser spacing.
- The font family is set globally so the UI feels consistent.

## 6. How Authentication Works End To End

Here is the complete flow from login form to protected request:

1. The user submits the login form in `Login.jsx`.
2. The form calls `login` from `AuthContext`.
3. `AuthContext` sends the credentials to `POST /api/auth/login`.
4. The backend controller checks the email, verifies the bcrypt password, and signs a JWT.
5. The frontend stores the token in `localStorage`.
6. The frontend stores the returned user object in React state.
7. The Axios interceptor reads the token and adds it to future requests.
8. The backend auth middleware verifies the token on protected routes.
9. The middleware places the decoded user data on `req.user`.
10. Controllers use `req.user` to decide what data to return and what actions are allowed.

The important idea is that the token is the proof of identity, but the server still verifies it on every protected request.

## 7. Deployment Setup

### Backend on Railway

File: `backend/railway.toml`

This file tells Railway how to start the backend.

- `startCommand = "npx prisma migrate deploy && node src/server.js"` runs the database migration step first and then starts the API.
- `healthcheckPath = "/"` lets Railway check whether the service is alive.

Environment variables used by the backend:

- `DATABASE_URL` points Prisma at the database.
- `JWT_SECRET` signs and verifies JWTs.
- `PORT` is used by the server entry file.
- `NODE_ENV=production` is often set in deployment.

### Frontend on Vercel

The frontend is configured to use `VITE_API_URL`.

- In development, it usually points to `http://localhost:5000/api`.
- In production, it should point to the deployed Railway backend URL.

Vercel needs this variable at build time because Vite reads `import.meta.env` during the frontend build.

### Important Deployment Note

The repository docs describe Railway + Vercel deployment, but the Prisma schema is currently configured for SQLite. That means the current codebase should be read as SQLite-first unless the schema and environment are later changed to a hosted database engine.

That distinction matters because deployment settings and database provider settings must agree with each other.

## 8. Common Interview Questions And Short Answers

### 1. Why use JWT instead of sessions?

JWT keeps the backend stateless. The client stores the token and sends it with each request, so the server does not need session storage.

### 2. Why hash passwords with bcrypt?

Passwords should never be stored in plain text. Bcrypt adds a slow hash with a salt, which makes stolen password data much harder to use.

### 3. Why is `ProjectMember` a separate table?

Because users and projects have a many-to-many relationship. A join table is the clean database design for that.

### 4. Why does the app need `AuthContext`?

It lets every component share the same login state without prop drilling.

### 5. Why use an Axios interceptor?

It automatically attaches the JWT to every request, which keeps the code DRY and reduces mistakes.

### 6. How does the frontend know who the current user is after refresh?

It reads the token from `localStorage` and calls `/api/auth/me` to rebuild the user state.

### 7. Why is `ProtectedRoute` needed if the backend already checks auth?

The backend protects the data, but the frontend should also prevent users from seeing private screens they cannot use.

### 8. Why are the project and task endpoints returning related data?

It reduces the number of requests the frontend has to make and keeps the UI simpler.

### 9. Why does the dashboard use counts instead of raw task rows?

Dashboards are about summary and status, not detailed editing.

### 10. What is the purpose of `DATABASE_URL` here?

Prisma uses it to know which database engine and location to connect to.

## 9. What To Practice When Explaining This In An Interview

If you need to explain the project confidently, focus on these three stories:

1. How a user signs up, logs in, and stays authenticated.
2. How projects own tasks and members through Prisma relations.
3. How the frontend and backend work together through protected API routes.

If you can explain those three flows clearly, you understand the core architecture of the app.
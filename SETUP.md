# TaskFlow Setup Guide

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## Installation Steps

### 1. PostgreSQL Setup

#### On Windows:
```bash
# Install PostgreSQL from: https://www.postgresql.org/download/windows/
# During installation, remember the password you set for the postgres user
# Default port: 5432

# Create database via pgAdmin or command line:
createdb -U postgres taskmanager
# You'll be prompted for the postgres password
```

#### On macOS (using Homebrew):
```bash
brew install postgresql
brew services start postgresql
createdb taskmanager
```

#### On Linux (Ubuntu/Debian):
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb taskmanager
```

### 2. Backend Setup

```bash
cd backend

# Create .env file (already created with defaults)
# Update DATABASE_URL if you used different credentials
cat .env

# Generate Prisma Client (already done, but can re-run)
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# This will:
# - Create database tables
# - Generate Prisma Client
# - Optionally seed the database

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## First Time Usage

1. **Sign Up**: Create a new account at http://localhost:5173/signup
2. **Choose Role**: Select "ADMIN" or "MEMBER"
3. **Create Project**: Go to Projects page and create your first project
4. **Add Tasks**: Click on a project and add tasks
5. **Assign Tasks**: Assign tasks to team members

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanager
JWT_SECRET=your_secret_key_here (change this!)
PORT=5000
```

### Frontend (.env.local for local development)
```
VITE_API_URL=http://localhost:5000/api
```

## Common Issues

### Issue: "Connection refused" on database
**Solution**: 
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify postgres user password

### Issue: Port 5000 already in use
**Solution**:
```bash
# Kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue: CORS errors
**Solution**:
- Ensure frontend URL is whitelisted in backend/src/app.js
- Frontend and backend must be running on different ports

### Issue: Prisma migration fails
**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually push schema
npx prisma db push
```

## API Documentation

All API endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

See README.md for complete endpoint list.

## Troubleshooting

### Check Backend Connectivity
```bash
curl http://localhost:5000/
# Should return: {"status":"Team Task Manager API running"}
```

### Check Frontend Build
```bash
cd frontend
npm run build
# Builds production version in dist/
```

### Database Connection
```bash
cd backend
npx prisma studio
# Opens database GUI at http://localhost:5555
```

## Production Deployment

See README.md for Railway deployment instructions.

## Development Tips

- **Auto-restart backend**: Already configured with nodemon
- **Hot reload frontend**: Vite provides instant HMR
- **Database GUI**: Run `npx prisma studio` to browse data
- **Reset database**: `npx prisma migrate reset` (destructive!)

## Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm start              # Start production server
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio     # Open database GUI
npx prisma generate   # Regenerate Prisma client

# Frontend
npm run dev            # Start dev server
npm run build          # Build production bundle
npm run preview        # Preview production build
```

## Support

For issues, check:
1. Terminal output for error messages
2. Backend logs at http://localhost:5000/
3. Browser console for frontend errors
4. Prisma Studio for database state

Happy task managing! 🚀

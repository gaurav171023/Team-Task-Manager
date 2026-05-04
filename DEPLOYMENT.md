# Deployment Guide

This guide covers deploying the Team Task Manager to production environments.

## Railway (Recommended for Beginners)

### Prerequisites
- GitHub account with the project repository
- Railway account (free at https://railway.app)

### Step-by-Step Deployment

#### 1. Prepare Repository

```bash
# Push your code to GitHub
git init
git add .
git commit -m "Initial commit: Team Task Manager"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

#### 2. Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "+ New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access GitHub
5. Select your `team-task-manager` repository

#### 3. Create Backend Service

1. Click "+ Add Service"
2. Select "GitHub Repo"
3. Select the same repository again
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: Leave as-is (auto-detected)
   - **Start Command**: Leave as-is (auto-detected)

#### 4. Add PostgreSQL Database

1. In the same project, click "+ Add Service"
2. Select "Database"
3. Select "PostgreSQL"
4. Click "Add"

Railway will automatically:
- Create a PostgreSQL instance
- Set `DATABASE_URL` environment variable
- Connect it to your backend service

#### 5. Set Environment Variables

1. Click on the backend service
2. Go to "Variables"
3. Click "Raw Editor" and add:
   ```
   NODE_ENV=production
   JWT_SECRET=your_very_long_random_secret_key_min_32_chars
   ```
   - For JWT_SECRET, use a strong random string. Generate with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

#### 6. Run Database Migrations

1. Click on the backend service
2. Go to "Deployments"
3. Click "Redeploy latest"
4. In the logs, verify:
   ```
   ✓ Prisma migrations applied
   ✓ Server running on port 5000
   ```

If migrations don't run automatically:
1. Go to "Shell" tab
2. Run manually:
   ```bash
   npx prisma migrate deploy
   node src/server.js
   ```

#### 7. Create Frontend Service

1. Click "+ Add Service"
2. Select "GitHub Repo"
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview`

#### 8. Configure Frontend Variables

1. Click on the frontend service
2. Go to "Variables"
3. Add:
   ```
   VITE_API_URL=https://YOUR_BACKEND_RAILWAY_URL/api
   ```
   - Replace `YOUR_BACKEND_RAILWAY_URL` with your backend's public URL
   - Find this URL in backend service settings (e.g., `https://team-task-manager-backend.railway.app`)

#### 9. Deploy

1. Railway automatically deploys on every GitHub push
2. Check "Deployments" tab to monitor build progress
3. Once both services are "deployed", your app is live!

#### 10. Get Your URLs

1. Backend URL: Found in backend service settings (e.g., `https://team-task-manager-backend.railway.app`)
2. Frontend URL: Found in frontend service settings (e.g., `https://team-task-manager-frontend.railway.app`)

### Testing Production Deployment

```bash
# Test backend API
curl https://YOUR_BACKEND_RAILWAY_URL/

# Should return:
# {"status":"Team Task Manager API running"}
```

### Updating After Deployment

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```
3. Railway automatically redeploys
4. Check deployment logs in Railway dashboard

### Monitoring

1. Click on service in Railway
2. Go to "Logs" tab to view real-time logs
3. Check for errors or performance issues

---

## Vercel (Frontend Only) + Railway (Backend)

### Deploy Backend to Railway

Follow the Railway deployment steps above.

### Deploy Frontend to Vercel

#### 1. Push code to GitHub (if not already done)

#### 2. Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Select your GitHub repository
4. Configure:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 3. Set Environment Variables in Vercel

1. Go to project settings
2. Click "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL/api
   ```

#### 4. Deploy

1. Click "Deploy"
2. Vercel builds and deploys automatically
3. Your frontend is now live on `*.vercel.app`

---

## Heroku Deployment (Alternative)

### Prerequisites
- Heroku CLI installed
- Heroku account

### Backend Deployment

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev -a your-app-name-backend

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key -a your-app-name-backend
heroku config:set NODE_ENV=production -a your-app-name-backend

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npx prisma migrate deploy -a your-app-name-backend

# Check logs
heroku logs --tail -a your-app-name-backend
```

### Frontend Deployment

```bash
# Create new app
heroku create your-app-name-frontend --buildpack heroku/nodejs

# Set API URL
heroku config:set VITE_API_URL=https://your-app-name-backend.herokuapp.com/api -a your-app-name-frontend

# Deploy
git subtree push --prefix frontend heroku main

# Check logs
heroku logs --tail -a your-app-name-frontend
```

---

## Docker Deployment

### Build Docker Images

```bash
# Backend Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
EOF

# Frontend Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
EOF

# Root docker-compose.yml for production
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/taskmanager
      JWT_SECRET: your_secret_key
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://backend:5000/api

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: taskmanager
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF
```

### Run with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Environment Variables Reference

### Backend (.env production)

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/taskmanager

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_min_32_characters
JWT_EXPIRY=7d

# Server
NODE_ENV=production
PORT=5000

# CORS (optional)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)

```
# API Endpoint
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up error logging (Sentry, etc.)
- [ ] Enable rate limiting on backend
- [ ] Use strong database password
- [ ] Keep dependencies updated
- [ ] Enable 2FA on deployment accounts
- [ ] Set up SSL certificates
- [ ] Configure database firewall rules
- [ ] Set up monitoring and alerts

---

## Troubleshooting Deployment

### Application won't start

```bash
# Check logs
heroku logs --tail -a app-name  # Heroku
railway logs                     # Railway

# Common issues:
# 1. Missing environment variables
# 2. Database URL incorrect
# 3. Port not set correctly
```

### Database migration fails

```bash
# On Railway, use Shell to run manually:
npx prisma migrate deploy

# On Heroku:
heroku run npx prisma migrate deploy -a app-name

# If stuck:
npx prisma migrate resolve --rolled-back migration_name
```

### API calls not working from frontend

```bash
# Check CORS in backend/src/app.js
# Verify VITE_API_URL points to correct backend
# Check browser console for error details
```

### High memory usage

```bash
# Optimize Node.js memory
export NODE_OPTIONS="--max-old-space-size=512"

# Check for memory leaks in logs
```

---

## Performance Optimization

### Backend

1. Enable caching headers
2. Implement database query optimization
3. Use connection pooling
4. Add rate limiting
5. Compress responses with gzip

### Frontend

1. Enable production build optimizations
2. Use CDN for static assets
3. Implement lazy loading
4. Minimize bundle size
5. Enable service workers

---

## Monitoring

### Railway

- Dashboard provides real-time metrics
- View CPU, Memory, and Disk usage
- Check logs for errors

### Vercel

- Built-in analytics
- Performance monitoring
- Real-time logs

### Heroku

```bash
# View metrics
heroku ps -a app-name

# View logs
heroku logs --tail -a app-name
```

---

## Backup and Recovery

### PostgreSQL Backup (Railway)

```bash
# Through Railway dashboard:
# 1. Go to PostgreSQL service
# 2. Click "Backups" tab
# 3. Automatic backups are created daily
```

### Manual Backup

```bash
# Use pg_dump
pg_dump postgresql://user:password@host:5432/dbname > backup.sql
```

---

## Scaling

### Railway

1. Go to service settings
2. Increase instance size
3. Add replicas for redundancy

### Vercel

- Automatic scaling (no configuration needed)
- Handles traffic spikes automatically

### Heroku

```bash
# Scale dynos
heroku ps:scale web=2 -a app-name
```

---

## Cost Optimization

- **Railway**: Free tier available; pay-as-you-go pricing
- **Vercel**: Free tier for frontend; generous limits
- **Heroku**: No free tier; minimum $5/month
- **Docker on VPS**: Can be cheapest for sustained usage

---

## Next Steps

1. Deploy to your chosen platform
2. Test all functionality in production
3. Monitor logs and performance
4. Set up automated backups
5. Configure monitoring and alerts
6. Document deployment process for team

---

**Last Updated**: 2024
**Version**: 1.0.0

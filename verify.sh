#!/bin/bash

# Verification script for Team Task Manager
# Checks if all files and dependencies are in place

echo ""
echo "=================================================="
echo "  Team Task Manager - Installation Verification"
echo "=================================================="
echo ""

errors=0
warnings=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
    else
        echo -e "${RED}✗${NC} Missing: $1"
        errors=$((errors + 1))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
    else
        echo -e "${RED}✗${NC} Missing: $1"
        errors=$((errors + 1))
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        version=$("$1" --version 2>&1 | head -n 1)
        echo -e "${GREEN}✓${NC} $1 installed: $version"
    else
        echo -e "${RED}✗${NC} $1 NOT installed"
        errors=$((errors + 1))
    fi
}

echo "1. Checking Node.js and npm..."
check_command node
check_command npm
echo ""

echo "2. Checking Root Files..."
check_file "README.md"
check_file "SETUP.md"
check_file "QUICKSTART.md"
check_file "DEPLOYMENT.md"
check_file "IMPLEMENTATION_NOTES.md"
check_file "PROJECT_COMPLETION_CHECKLIST.md"
check_file ".gitignore"
check_file "docker-compose.yml"
echo ""

echo "3. Checking Backend Structure..."
check_dir "backend"
check_dir "backend/src"
check_dir "backend/prisma"
check_dir "backend/src/controllers"
check_dir "backend/src/middleware"
check_dir "backend/src/routes"
echo ""

echo "4. Checking Backend Files..."
check_file "backend/package.json"
check_file "backend/.env"
check_file "backend/.env.example"
check_file "backend/railway.toml"
check_file "backend/src/app.js"
check_file "backend/src/server.js"
check_file "backend/prisma/schema.prisma"
echo ""

echo "5. Checking Backend Controllers..."
check_file "backend/src/controllers/auth.controller.js"
check_file "backend/src/controllers/project.controller.js"
check_file "backend/src/controllers/task.controller.js"
check_file "backend/src/controllers/user.controller.js"
echo ""

echo "6. Checking Backend Middleware..."
check_file "backend/src/middleware/auth.middleware.js"
check_file "backend/src/middleware/role.middleware.js"
echo ""

echo "7. Checking Backend Routes..."
check_file "backend/src/routes/auth.routes.js"
check_file "backend/src/routes/project.routes.js"
check_file "backend/src/routes/task.routes.js"
check_file "backend/src/routes/user.routes.js"
echo ""

echo "8. Checking Frontend Structure..."
check_dir "frontend"
check_dir "frontend/src"
check_dir "frontend/src/api"
check_dir "frontend/src/context"
check_dir "frontend/src/components"
check_dir "frontend/src/pages"
echo ""

echo "9. Checking Frontend Files..."
check_file "frontend/package.json"
check_file "frontend/.env.local"
check_file "frontend/.env.example"
check_file "frontend/index.html"
check_file "frontend/vite.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
check_file "frontend/src/App.jsx"
check_file "frontend/src/main.jsx"
check_file "frontend/src/index.css"
echo ""

echo "10. Checking Frontend API & Context..."
check_file "frontend/src/api/axiosInstance.js"
check_file "frontend/src/context/AuthContext.jsx"
echo ""

echo "11. Checking Frontend Components..."
check_file "frontend/src/components/Navbar.jsx"
check_file "frontend/src/components/ProtectedRoute.jsx"
echo ""

echo "12. Checking Frontend Pages..."
check_file "frontend/src/pages/Login.jsx"
check_file "frontend/src/pages/Signup.jsx"
check_file "frontend/src/pages/Dashboard.jsx"
check_file "frontend/src/pages/Projects.jsx"
check_file "frontend/src/pages/ProjectDetail.jsx"
check_file "frontend/src/pages/Tasks.jsx"
echo ""

echo "13. Checking Backend Dependencies..."
if [ -d "backend/node_modules" ]; then
    count=$(find backend/node_modules -maxdepth 1 -type d | wc -l)
    echo -e "${GREEN}✓${NC} Backend node_modules: ~$count packages installed"
else
    echo -e "${YELLOW}⚠${NC} Backend node_modules not found (run: cd backend && npm install)"
    warnings=$((warnings + 1))
fi
echo ""

echo "14. Checking Frontend Dependencies..."
if [ -d "frontend/node_modules" ]; then
    count=$(find frontend/node_modules -maxdepth 1 -type d | wc -l)
    echo -e "${GREEN}✓${NC} Frontend node_modules: ~$count packages installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend node_modules not found (run: cd frontend && npm install)"
    warnings=$((warnings + 1))
fi
echo ""

echo "15. Checking Prisma Client..."
if [ -d "backend/node_modules/@prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Prisma client installed"
else
    echo -e "${YELLOW}⚠${NC} Prisma client not installed (run: cd backend && npx prisma generate)"
    warnings=$((warnings + 1))
fi
echo ""

echo "=================================================="
echo "  Verification Results"
echo "=================================================="
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make sure PostgreSQL is running"
    echo "2. Run: cd backend && npx prisma migrate dev --name init"
    echo "3. Start backend: cd backend && npm run dev"
    echo "4. Start frontend: cd frontend && npm run dev"
    echo "5. Open: http://localhost:5173"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Verification failed!${NC}"
    echo ""
    echo "Errors: $errors"
    echo "Warnings: $warnings"
    echo ""
    echo "Please fix the issues above:"
    echo "- Missing files: Check if files are created"
    echo "- Missing directories: Check project structure"
    echo "- Missing dependencies: Run npm install"
    echo ""
    exit 1
fi

@echo off
REM Verification script for Team Task Manager

echo.
echo ==================================================
echo   Team Task Manager - Installation Verification
echo ==================================================
echo.

setlocal enabledelayedexpansion
set errors=0
set warnings=0

REM Color codes (using text only, Windows doesn't support ANSI by default)

echo 1. Checking Node.js and npm...
where node >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set node_ver=%%i
    echo [OK] node installed: !node_ver!
) else (
    echo [ERROR] node NOT installed
    set /a errors+=1
)

where npm >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set npm_ver=%%i
    echo [OK] npm installed: !npm_ver!
) else (
    echo [ERROR] npm NOT installed
    set /a errors+=1
)
echo.

echo 2. Checking Root Files...
if exist "README.md" (echo [OK] README.md) else (echo [MISSING] README.md & set /a errors+=1)
if exist "SETUP.md" (echo [OK] SETUP.md) else (echo [MISSING] SETUP.md & set /a errors+=1)
if exist "QUICKSTART.md" (echo [OK] QUICKSTART.md) else (echo [MISSING] QUICKSTART.md & set /a errors+=1)
if exist "DEPLOYMENT.md" (echo [OK] DEPLOYMENT.md) else (echo [MISSING] DEPLOYMENT.md & set /a errors+=1)
if exist "IMPLEMENTATION_NOTES.md" (echo [OK] IMPLEMENTATION_NOTES.md) else (echo [MISSING] IMPLEMENTATION_NOTES.md & set /a errors+=1)
if exist ".gitignore" (echo [OK] .gitignore) else (echo [MISSING] .gitignore & set /a errors+=1)
if exist "docker-compose.yml" (echo [OK] docker-compose.yml) else (echo [MISSING] docker-compose.yml & set /a errors+=1)
echo.

echo 3. Checking Backend Structure...
if exist "backend" (echo [OK] backend/) else (echo [MISSING] backend/ & set /a errors+=1)
if exist "backend\src" (echo [OK] backend\src) else (echo [MISSING] backend\src & set /a errors+=1)
if exist "backend\prisma" (echo [OK] backend\prisma) else (echo [MISSING] backend\prisma & set /a errors+=1)
if exist "backend\src\controllers" (echo [OK] backend\src\controllers) else (echo [MISSING] backend\src\controllers & set /a errors+=1)
if exist "backend\src\middleware" (echo [OK] backend\src\middleware) else (echo [MISSING] backend\src\middleware & set /a errors+=1)
if exist "backend\src\routes" (echo [OK] backend\src\routes) else (echo [MISSING] backend\src\routes & set /a errors+=1)
echo.

echo 4. Checking Backend Files...
if exist "backend\package.json" (echo [OK] package.json) else (echo [MISSING] package.json & set /a errors+=1)
if exist "backend\.env" (echo [OK] .env) else (echo [WARNING] .env - set /a warnings+=1)
if exist "backend\.env.example" (echo [OK] .env.example) else (echo [MISSING] .env.example & set /a errors+=1)
if exist "backend\railway.toml" (echo [OK] railway.toml) else (echo [MISSING] railway.toml & set /a errors+=1)
if exist "backend\src\app.js" (echo [OK] app.js) else (echo [MISSING] app.js & set /a errors+=1)
if exist "backend\src\server.js" (echo [OK] server.js) else (echo [MISSING] server.js & set /a errors+=1)
if exist "backend\prisma\schema.prisma" (echo [OK] schema.prisma) else (echo [MISSING] schema.prisma & set /a errors+=1)
echo.

echo 5. Checking Backend Controllers...
if exist "backend\src\controllers\auth.controller.js" (echo [OK] auth.controller.js) else (echo [MISSING] auth.controller.js & set /a errors+=1)
if exist "backend\src\controllers\project.controller.js" (echo [OK] project.controller.js) else (echo [MISSING] project.controller.js & set /a errors+=1)
if exist "backend\src\controllers\task.controller.js" (echo [OK] task.controller.js) else (echo [MISSING] task.controller.js & set /a errors+=1)
if exist "backend\src\controllers\user.controller.js" (echo [OK] user.controller.js) else (echo [MISSING] user.controller.js & set /a errors+=1)
echo.

echo 6. Checking Backend Middleware...
if exist "backend\src\middleware\auth.middleware.js" (echo [OK] auth.middleware.js) else (echo [MISSING] auth.middleware.js & set /a errors+=1)
if exist "backend\src\middleware\role.middleware.js" (echo [OK] role.middleware.js) else (echo [MISSING] role.middleware.js & set /a errors+=1)
echo.

echo 7. Checking Backend Routes...
if exist "backend\src\routes\auth.routes.js" (echo [OK] auth.routes.js) else (echo [MISSING] auth.routes.js & set /a errors+=1)
if exist "backend\src\routes\project.routes.js" (echo [OK] project.routes.js) else (echo [MISSING] project.routes.js & set /a errors+=1)
if exist "backend\src\routes\task.routes.js" (echo [OK] task.routes.js) else (echo [MISSING] task.routes.js & set /a errors+=1)
if exist "backend\src\routes\user.routes.js" (echo [OK] user.routes.js) else (echo [MISSING] user.routes.js & set /a errors+=1)
echo.

echo 8. Checking Frontend Structure...
if exist "frontend" (echo [OK] frontend/) else (echo [MISSING] frontend/ & set /a errors+=1)
if exist "frontend\src" (echo [OK] frontend\src) else (echo [MISSING] frontend\src & set /a errors+=1)
if exist "frontend\src\api" (echo [OK] frontend\src\api) else (echo [MISSING] frontend\src\api & set /a errors+=1)
if exist "frontend\src\context" (echo [OK] frontend\src\context) else (echo [MISSING] frontend\src\context & set /a errors+=1)
if exist "frontend\src\components" (echo [OK] frontend\src\components) else (echo [MISSING] frontend\src\components & set /a errors+=1)
if exist "frontend\src\pages" (echo [OK] frontend\src\pages) else (echo [MISSING] frontend\src\pages & set /a errors+=1)
echo.

echo 9. Checking Frontend Files...
if exist "frontend\package.json" (echo [OK] package.json) else (echo [MISSING] package.json & set /a errors+=1)
if exist "frontend\.env.local" (echo [OK] .env.local) else (echo [WARNING] .env.local & set /a warnings+=1)
if exist "frontend\.env.example" (echo [OK] .env.example) else (echo [MISSING] .env.example & set /a errors+=1)
if exist "frontend\index.html" (echo [OK] index.html) else (echo [MISSING] index.html & set /a errors+=1)
if exist "frontend\vite.config.js" (echo [OK] vite.config.js) else (echo [MISSING] vite.config.js & set /a errors+=1)
if exist "frontend\tailwind.config.js" (echo [OK] tailwind.config.js) else (echo [MISSING] tailwind.config.js & set /a errors+=1)
if exist "frontend\postcss.config.js" (echo [OK] postcss.config.js) else (echo [MISSING] postcss.config.js & set /a errors+=1)
echo.

echo 10. Checking Frontend API and Context...
if exist "frontend\src\api\axiosInstance.js" (echo [OK] axiosInstance.js) else (echo [MISSING] axiosInstance.js & set /a errors+=1)
if exist "frontend\src\context\AuthContext.jsx" (echo [OK] AuthContext.jsx) else (echo [MISSING] AuthContext.jsx & set /a errors+=1)
echo.

echo 11. Checking Frontend Components...
if exist "frontend\src\components\Navbar.jsx" (echo [OK] Navbar.jsx) else (echo [MISSING] Navbar.jsx & set /a errors+=1)
if exist "frontend\src\components\ProtectedRoute.jsx" (echo [OK] ProtectedRoute.jsx) else (echo [MISSING] ProtectedRoute.jsx & set /a errors+=1)
echo.

echo 12. Checking Frontend Pages...
if exist "frontend\src\pages\Login.jsx" (echo [OK] Login.jsx) else (echo [MISSING] Login.jsx & set /a errors+=1)
if exist "frontend\src\pages\Signup.jsx" (echo [OK] Signup.jsx) else (echo [MISSING] Signup.jsx & set /a errors+=1)
if exist "frontend\src\pages\Dashboard.jsx" (echo [OK] Dashboard.jsx) else (echo [MISSING] Dashboard.jsx & set /a errors+=1)
if exist "frontend\src\pages\Projects.jsx" (echo [OK] Projects.jsx) else (echo [MISSING] Projects.jsx & set /a errors+=1)
if exist "frontend\src\pages\ProjectDetail.jsx" (echo [OK] ProjectDetail.jsx) else (echo [MISSING] ProjectDetail.jsx & set /a errors+=1)
if exist "frontend\src\pages\Tasks.jsx" (echo [OK] Tasks.jsx) else (echo [MISSING] Tasks.jsx & set /a errors+=1)
echo.

echo 13. Checking Backend Dependencies...
if exist "backend\node_modules" (
    echo [OK] Backend node_modules directory found
) else (
    echo [WARNING] Backend node_modules not found - run: cd backend ^&^& npm install
    set /a warnings+=1
)
echo.

echo 14. Checking Frontend Dependencies...
if exist "frontend\node_modules" (
    echo [OK] Frontend node_modules directory found
) else (
    echo [WARNING] Frontend node_modules not found - run: cd frontend ^&^& npm install
    set /a warnings+=1
)
echo.

echo ==================================================
echo   Verification Results
echo ==================================================
echo.

if !errors! equ 0 (
    if !warnings! equ 0 (
        echo [SUCCESS] All checks passed!
        echo.
        echo Next steps:
        echo 1. Make sure PostgreSQL is running
        echo 2. Run: cd backend ^&^& npx prisma migrate dev --name init
        echo 3. Start backend: cd backend ^&^& npm run dev
        echo 4. Start frontend: cd frontend ^&^& npm run dev
        echo 5. Open: http://localhost:5173
        echo.
    ) else (
        echo [SUCCESS] All critical checks passed with !warnings! warning(s)
        echo.
    )
) else (
    echo [FAILURE] Found !errors! error(s)
    if !warnings! gtr 0 (
        echo Found !warnings! warning(s)
    )
    echo.
    echo Please fix the issues above before proceeding.
    echo.
    pause
    exit /b 1
)

pause

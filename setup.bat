@echo off
REM Quick Setup Script for Team Task Manager

echo.
echo ========================================
echo   Team Task Manager - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js and npm are installed.
echo.

REM Backend setup
echo ========================================
echo   Setting up Backend...
echo ========================================
cd backend
echo Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend npm install failed.
    pause
    exit /b 1
)

echo.
echo Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Prisma generation failed. Make sure PostgreSQL is running.
)

echo.
echo [OK] Backend setup complete!
echo.
cd ..

REM Frontend setup
echo ========================================
echo   Setting up Frontend...
echo ========================================
cd frontend
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend npm install failed.
    pause
    exit /b 1
)

echo [OK] Frontend setup complete!
echo.
cd ..

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Make sure PostgreSQL is running
echo    (Use docker-compose: docker-compose up -d)
echo.
echo 2. Run database migrations:
echo    cd backend
echo    npx prisma migrate dev --name init
echo    cd ..
echo.
echo 3. Start the backend:
echo    cd backend
echo    npm run dev
echo.
echo 4. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:5173 in your browser
echo.
echo Happy coding!
echo.
pause

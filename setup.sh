#!/bin/bash

# Quick Setup Script for Team Task Manager

echo ""
echo "========================================"
echo "   Team Task Manager - Quick Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "[ERROR] npm is not installed. Please install Node.js first."
    exit 1
fi

echo "[OK] Node.js and npm are installed."
echo ""

# Backend setup
echo "========================================"
echo "   Setting up Backend..."
echo "========================================"
cd backend
echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Backend npm install failed."
    exit 1
fi

echo ""
echo "Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "[WARNING] Prisma generation failed. Make sure PostgreSQL is running."
fi

echo ""
echo "[OK] Backend setup complete!"
echo ""
cd ..

# Frontend setup
echo "========================================"
echo "   Setting up Frontend..."
echo "========================================"
cd frontend
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Frontend npm install failed."
    exit 1
fi

echo "[OK] Frontend setup complete!"
echo ""
cd ..

echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure PostgreSQL is running"
echo "   (Use docker-compose: docker-compose up -d)"
echo ""
echo "2. Run database migrations:"
echo "   cd backend"
echo "   npx prisma migrate dev --name init"
echo "   cd .."
echo ""
echo "3. Start the backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "Happy coding!"
echo ""

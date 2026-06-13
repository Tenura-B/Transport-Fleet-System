@echo off
REM Transportation Fleet Management System - Windows Setup Script

echo Starting Transportation Fleet Management System setup...

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pnpm is not installed. Please install pnpm first: https://pnpm.io/installation
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 20+ first: https://nodejs.org/
    exit /b 1
)

echo Installing dependencies...
pnpm install

echo Setting up Prisma...
cd apps/api

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found. Creating example.env...
    (
        echo # DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
    ) > .env.example
    echo INFO: Please create a .env file with your database URL (copy from .env.example and update values).
)

echo Generating Prisma Client...
pnpm prisma generate

echo.
echo Setup complete!
echo.
echo To start development:
echo 1. Make sure your .env file has a valid DATABASE_URL
echo 2. Run database migrations (if needed): pnpm prisma migrate dev
echo 3. Start backend: cd apps/api ^&^& pnpm start:dev
echo 4. Start frontend: cd apps/web ^&^& pnpm dev
echo.
echo Backend will run at: http://localhost:3001
echo Frontend will run at: http://localhost:3000

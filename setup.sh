#!/bin/bash

# Transportation Fleet Management System - Setup Script
echo "🚀 Starting Transportation Fleet Management System setup..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first: https://pnpm.io/installation"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first: https://nodejs.org/"
    exit 1
fi

echo "✅ Installing dependencies..."
pnpm install

echo "✅ Setting up Prisma..."
cd apps/api

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating example.env..."
    cat > .env.example << 'EOF'
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
EOF
    echo "ℹ️  Please create a .env file with your database URL (copy from .env.example and update values)."
fi

echo "✅ Generating Prisma Client..."
pnpm prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "1. Make sure your .env file has a valid DATABASE_URL"
echo "2. Run database migrations (if needed): pnpm prisma migrate dev"
echo "3. Start backend: cd apps/api && pnpm start:dev"
echo "4. Start frontend: cd apps/web && pnpm dev"
echo ""
echo "Backend will run at: http://localhost:3001"
echo "Frontend will run at: http://localhost:3000"

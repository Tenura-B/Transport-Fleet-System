# Transportation Fleet Management System

A full-stack web application for managing transportation fleets, built with modern technologies.

## 🚀 Tech Stack

### Backend
- **NestJS 11** - Progressive Node.js framework
- **TypeScript 5.7** - Type-safe development
- **Prisma 7.8** - ORM and database toolkit
- **PostgreSQL** - Database (hosted on Neon)
- **pnpm** - Package manager

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Package manager

## 📁 Project Structure

```
Transportation-Fleet/
├── apps/
│   ├── api/                # NestJS Backend API
│   │   ├── prisma/         # Prisma schema and migrations
│   │   ├── src/
│   │   │   ├── generated/  # Generated Prisma client
│   │   │   ├── prisma/     # Prisma module and service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── web/                # Next.js Frontend
│       ├── app/            # App Router
│       ├── public/         # Static assets
│       └── package.json
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # pnpm workspace config
├── setup.sh                # Linux/macOS setup script
└── setup.bat               # Windows setup script
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm (package manager)
- PostgreSQL database (or Neon account)

### Installation & Setup

#### Option 1: Using Setup Script

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

#### Option 2: Manual Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env` file in `apps/api/`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

3. Generate Prisma Client:
```bash
cd apps/api
pnpm prisma generate
```

4. Run database migrations (if needed):
```bash
pnpm prisma migrate dev
```

## 🏃 Running the Application

### Backend
```bash
cd apps/api
pnpm start:dev
```
Backend will be available at: `http://localhost:3001`

### Frontend
```bash
cd apps/web
pnpm dev
```
Frontend will be available at: `http://localhost:3000`

## 📦 Database

### Prisma Commands
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio
```

## 📝 License
MIT

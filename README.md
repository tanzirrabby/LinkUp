# LinkUp Monorepo

A production-style starter for a social networking platform (Facebook-like) with:
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT access/refresh tokens
- **Realtime:** Socket.IO

## Project Structure

- `frontend/` – Next.js application
- `backend/` – Express API server
- `backend/prisma/schema.prisma` – database models

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Core Features Included
- Signup/login + token refresh/logout
- User profiles (bio, avatar, cover)
- Friend requests and connections
- Posts, comments, reactions, shares
- Privacy flags (`public`, `friends`, `private`)
- Notifications REST + Socket.IO bootstrap
- Search endpoints (users/posts)

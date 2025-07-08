# 🗨️ Comment App – Backend-Focused Full Stack System

This is a scalable, backend-heavy full stack comment application built as part of the **Sanctity.ai Backend Internship Assessment**.

---

## 🔧 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Auth**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose

---

## ✅ Features

### 🔐 Authentication
- Secure registration and login (JWT-based)
- Protected routes with `@UseGuards(JwtAuthGuard)`

### 💬 Comments
- Post top-level comments and nested replies (infinite depth)
- Fetch full comment threads publicly
- Edit your own comments anytime (currently without time limit)

### 🗑️ Soft Delete & Restore (Upcoming)
- Delete comments (preserved as `[deleted]`)
- Restore within a grace period (coming soon)

### 🔔 Notifications (Planned)
- Notify users when someone replies to their comment
- Mark notifications as read/unread

---

## 📦 Project Structure

```bash
comment-app/
├── backend/                    # NestJS application
│   ├── src/
│   │   ├── auth/               # Auth module (JWT, guards)
│   │   ├── comments/           # Comment module (nested comments, edit/delete)
│   │   ├── notifications/      # Notification system
│   │   ├── users/              # User module
│   │   ├── common/             # Shared interceptors, pipes, filters
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   ├── .env
│   └── tsconfig.json
│
├── frontend/                   # React frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── .env.local
│
├── docker-compose.yml          # Compose backend, frontend, and PostgreSQL
├── README.md
└── .env                        # Root environment config

```

---

## 🐳 Docker Setup (Planned)

Docker support for both backend and PostgreSQL coming soon.

---

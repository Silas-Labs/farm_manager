# 🌾 Farm Manager

An **offline-first crop profitability tracker** for smallholder farmers. Record crops, expenses, and harvests in the field with no connection; sync when you're back online — and always know, per crop, whether it was worth planting.

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Recent Developments](#-recent-developments)
- [System Output & Visualizations](#-system-output--visualizations)
- [Project Scope & Timeline](#-project-scope--timeline)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## 📌 Problem Statement

Smallholder farmers rarely keep consistent records of what they plant and what it costs. By harvest time it's impossible to say which crop actually made money — and in the field, network coverage is often unreliable or nonexistent, so a tool that needs a connection to work simply won't get used.

This project addresses both problems: a simple record-keeping system that works **fully offline**, and profitability math that answers the one question that matters — *per crop and per plot, was it worth planting?*

## 🎯 Objectives

- Keep recording crops, expenses, and harvests **even without internet** (field-first)

- Link every expense to the crop it belongs to, with an escape hatch for shared farm-wide costs

- Compute **per-crop profitability** (revenue − linked expenses, margin)

- Rank crops from best to worst performer on the dashboard

- Sync automatically when a connection returns, without losing data or blocking the user

## 🧩 Features

- **Offline-first data layer** — every read and write goes through a local browser database (IndexedDB), so the app is fully usable without a connection

- **Background sync** — changes are queued in an outbox and flushed to the backend automatically on reconnect and on app boot; the UI badge reflects sync status

- **Crop-linked expenses & harvests** — each expense and harvest belongs to a crop; `is_shared_cost` lets shared farm-level costs be excluded from a crop's profit

- **Per-crop profitability** — revenue, linked expenses, net profit, and margin computed locally on the crops page

- **Dashboard ranking** — crops ranked best-to-worst by profitability with margin bars

- **Offline session persistence** — login stays cached so a returning farmer isn't locked out while offline

- **Field dashboard** — weather widget embedded in the dashboard, main navigation focused on crops, expenses, and harvests

## 🛠️ Tech Stack

### 🎨 Frontend

- **React 19** + **Vite 8** – UI and build tooling
- **Tailwind CSS 4** + **Material UI (MUI) 7** + **Radix / shadcn/ui** – styling and components
- **Recharts** – charts and margin visualizations
- **TanStack Table** – data tables
- **React Router 7** – client-side routing
- **Axios** – API communication
- **dayjs / date-fns** – date handling
- **IndexedDB (native)** – offline storage, outbox queue, and sync engine (no external dependency)

### ⚙️ Backend

- **Go** – REST API
- **go-chi/chi** – routing
- **go-sqlite3** – per-user SQLite databases
- **golang-jwt/jwt** – authentication tokens
- **bcrypt** (`golang.org/x/crypto`) – password hashing

#### 🧱 Architecture

- Clean architecture style:
  - `handler` (HTTP layer)
  - `service` (business logic & validation)
  - `repository` (data access)
  - `models` (domain entities)

- **Additive migrations:** schema changes (e.g. adding `crop_id` / `is_shared_cost` to existing expense tables) are applied idempotently on every open, so legacy databases upgrade in place without data loss.

### 🗄️ Database

- **SQLite** – one central `users.db` plus a per-user `farm_{user_id}.db`
- **IndexedDB** – client-side offline store per browser profile

### 🧪 Development & Tooling

- Go standard toolchain (`go build` / `go vet` / `go test`)
- Vite build (used as the frontend verification gate)
- Git + GitHub – version control and hosting

## 📈 Recent Developments

The project was recently refactored into an **offline-first crop profitability tracker**:

- **Offline store + sync manager** — native IndexedDB store with per-user tables and an outbox; writes are queued and flushed on reconnect/boot with a sync status badge.
- **Crop-linked costs** — expenses and harvests now require a `crop_id`; a new `is_shared_cost` flag excludes shared costs from profit.
- **Local-first reads** — pages render from the local store and reconcile with the backend.
- **Per-crop profitability** — computed locally on the crops page and ranked on the dashboard.
- **Modular backend** — refactored into `handler`, `service`, `repository`, `models` packages; new `/crops/profitability` endpoint; legacy database migration with regression test.
- **Security** — credentials removed from version control, JWT auth flows strengthened.

## 📊 System Output & Visualizations

- Per-crop profitability cards (revenue, linked expenses, net profit, margin)

- Dashboard crop ranking with margin bars (best → worst)

- Sync status indicator so users always know if data is uploaded

## 🚀 Project Scope & Timeline

Scope:

- Designed for smallholder and small-to-medium-scale farms

- Focus on record-keeping, crop profitability, and offline resilience

- No real-time sensor data, IoT integration, or predictive analytics in the initial version

Timeline:

- Development period: 2 months
- Phases: Requirement analysis → Design → Development → Testing → Documentation

## 🚀 Getting Started

### Backend

```bash
cd backend
go mod download
go run ./cmd/api
# serve on PORT (default 8080); expects JWT_SECRET in env/.env
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```bash
farm_manager/
 ├── frontend/        # React + Vite app (offline store, sync, UI)
 ├── backend/
 │   ├── cmd/api/     # HTTP server entrypoint
 │   ├── internal/    # handler, service, repository, models, middleware
 │   ├── pkg/         # database, auth, config
 │   └── docs/        # API route documentation
 ├── DOCS.md          # top-level project notes
 └── README.md
```

## 🤝 Contributing

Contributions are welcome.
Feel free to fork the repository, create a new branch, and submit a pull request for improvements or bug fixes.

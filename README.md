# 🌾 Farm Manager

A centralized farm management system to record activities, track costs, and visualize farm performance for better decision-making.

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Output & Visualizations](#-system-output--visualizations)
- [Project Scope & Timeline](#-project-scope--timeline)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## 📌 Problem Statement.


Managing a farm involves tracking a wide range of activities, resources, and expenses—from purchasing seeds and fertilizers to recording cultivation, harvesting, and sales. Farmers often face challenges in maintaining accurate records, analyzing operational costs, and assessing overall farm performance. Without a centralized system, it becomes difficult to identify trends, optimize resource usage, or make informed, data-driven decisions to improve productivity and profitability.

This project aims to address these challenges by developing a comprehensive and user-friendly Farm Management System that digitally records farm operations and presents meaningful insights through visual analytics.

## 🎯 Objectives

- Digitally record all farm-related activities and events

- Track costs associated with cultivation, inputs, and harvesting

- Monitor farm outputs such as yield and revenue

- Provide clear visualizations of farm performance

- Enable informed decision-making through organized data

## 🧩 Features

- Activity logging (cultivation, harvesting, purchases, sales)

- Input management (seeds, fertilizers, labor, machinery)

- Expense and cost tracking

- Yield and revenue monitoring

- Performance visualization using charts and graphs

- Date-wise and category-wise record keeping

## 🛠️ Tech Stack

### 🎨 Frontend

Built with modern React tooling for performance and scalability:

- React – Component-based UI development
- Vite – Fast development server and build system
- Tailwind CSS – Utility-first styling
- Material UI (MUI) – Prebuilt UI components
- shadcn/ui – Accessible UI components
- Radix UI – Headless UI primitives

#### 📊 Data Visualization & Tables

- Recharts – Charts for analytics
- TanStack Table – Advanced data tables

#### 🔄 State & Data Handling

- Axios – API communication
- React Router – Client-side routing

#### 📅 Date & Utilities

- dayjs / date-fns – Date manipulation
- clsx – Conditional classNames
- class-variance-authority – Variant-based styling

---

### ⚙️ Backend

Built with Go for performance and scalability:

- Go (Golang) – Backend programming language
- net/http – Standard HTTP package

#### 🧱 Architecture

- Clean architecture style:
  - Handlers (HTTP layer)
  - Services (business logic)
  - Repository (data access)
  - Models (domain entities)

#### 🔌 API

- RESTful API design
- JSON-based communication

---

### 🗄️ Database

- PostgreSQL – Relational database

---

### 🧪 Development & Tooling

- ESLint – Code linting
- Git – Version control
- GitHub – Repository hosting

---

### 🎯 Summary

- Frontend: React + Vite + Tailwind + MUI
- Backend: Go (REST API)
- Database: PostgreSQL
- Charts: Recharts
- Tooling: ESLint + Git

## 📊 System Output & Visualizations

- The system generates visual insights such as:

- Cost distribution charts (inputs vs labor vs harvesting)

- Yield and revenue trends over time

- Profit and loss summaries

- Activity timelines and summaries

## 🚀 Project Scope & Timeline

Scope:

- Designed for small to medium-scale farms

- Focuses on record-keeping, cost tracking, and visualization

- No real-time sensor data or IoT integration

- No predictive analytics in the initial version

**Timeline:**

Development period: 2 months

Phases: Requirement analysis → Design → Development → Testing → Documentation

## 📂 Project Structure

```bash
Farm-Manager/
 |── frontend/
 |── backend/
 |── database/
 |── docs/
 |── assets/
 |── README.md
```

## 🤝 Contributing

Contributions are welcome.
Feel free to fork the repository, create a new branch, and submit a pull request for improvements or bug fixes.

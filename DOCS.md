# Farm Manager - Complete Technical & User Documentation

📚 Table of Contents

    Overview

    System Architecture

    Prerequisites

    Installation & Setup

    Running the Application

    User Guide

    API Documentation

    Database Structure

    Configuration

    Troubleshooting

    Development & Customization

    Deployment

Overview

Farm Manager is a comprehensive farm management system designed for small to medium-scale farmers. It helps track crops, equipment, labor, expenses, harvests, and provides weather insights - all with complete user isolation and offline-capable architecture.
Key Features
Feature Description
User Authentication Secure JWT-based login/registration
Multi-Tenant Database Each user gets their own SQLite database file
Crop Management Track crops, stages, planting/harvest dates
Equipment Management Monitor machinery, status, maintenance
Labor Management Manage workers, roles, payroll
Expense Tracking Record all farm-related expenses
Harvest Recording Log yields and revenue
Weather Integration Real-time weather data (OpenWeather API)
Reports & Analytics Visual insights and data export
System Architecture
text

┌─────────────────────────────────────────────────────────────────┐
│ Frontend (React) │
│ Deployed on Netlify/Vercel │
├─────────────────────────────────────────────────────────────────┤
│ API Layer (Go) │
│ Deployed on Render/Railway │
├─────────────────────────────────────────────────────────────────┤
│ Database Layer (SQLite) │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ users.db │ │ farm_1.db │ │ farm_2.db │ │
│ │ (Central Auth) │ │ (User 1 Data) │ │ (User 2 Data) │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

Technology Stack
Layer Technology Version
Frontend React + Vite React 18
Styling Tailwind CSS 3.x
Backend Go (Chi Router) 1.21+
Database SQLite3 3.x
Auth JWT 5.x
HTTP Client Axios 1.x
Charts Recharts 2.x
Prerequisites
Required Software
bash

# Minimum versions required

Node.js: 18.0 or higher
npm: 9.0 or higher
Go: 1.21 or higher
Git: 2.0 or higher
SQLite3: 3.x (optional - for manual DB inspection)

API Keys Required
Service Purpose Get it from
OpenWeather API Weather data openweathermap.org
System Requirements
Component Minimum Recommended
RAM 1GB 2GB
Storage 500MB 1GB
CPU 1 core 2 cores
OS Any (Linux/Mac/Windows) Ubuntu 20.04+
Installation & Setup

1. Clone the Repository
   bash

git clone https://github.com/yourusername/farm-manager.git
cd farm-manager

2. Backend Setup
   bash

# Navigate to backend directory

cd backend

# Create data directory for databases

mkdir -p data

# Copy environment configuration

cp .env.example .env

# Edit .env with your values

nano .env

.env configuration:
env

# Server Configuration

PORT=8000
ENVIRONMENT=development

# JWT Configuration (CHANGE THIS!)

JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRY_HOURS=24

# SQLite Database Path

DB_PATH=./data/users.db

# OpenWeather API (optional - for weather feature)

WEATHER_API_KEY=your_openweather_api_key_here

bash

# Install Go dependencies

go mod tidy

# Verify installation

go version

3. Frontend Setup
   bash

# Navigate to frontend directory

cd ../frontend

# Copy environment configuration

cp .env.example .env

# Edit .env

nano .env

.env configuration:
env

# Backend API URL (development)

VITE_API_URL=http://localhost:8000/api

# Backend API URL (production - change for deployment)

# VITE_API_URL=https://your-backend-domain.com/api

bash

# Install Node dependencies

npm install

# Verify installation

node --version
npm --version

Running the Application
Development Mode
Terminal 1: Start Backend Server
bash

cd backend
go run cmd/api/main.go

Expected output:
text

2026/05/11 10:00:00 Central database connected successfully
2026/05/11 10:00:00 Central database tables created/verified
2026/05/11 10:00:00 Server starting on port 8000
2026/05/11 10:00:00 API available at http://localhost:8000

Terminal 2: Start Frontend Server
bash

cd frontend
npm run dev

Expected output:
text

VITE v5.0.0 ready in 500ms
➜ Local: http://localhost:5173/
➜ Network: use --host to expose

Production Build
Build Backend
bash

cd backend
go build -o farm-manager-api cmd/api/main.go
./farm-manager-api

Build Frontend
bash

cd frontend
npm run build

# Output will be in 'dist' directory

First-Time Access

    Open browser to http://localhost:5173

    You'll be redirected to login page

    Click "Create an account" to register

    Fill in your details:

        Full Name

        Email Address

        Password (min 6 characters)

        Farm Name

        Location (optional)

    After registration, login with your credentials

    You'll be taken to the Dashboard

Default Demo Account (for testing)
text

Email: admin@farm.com
Password: admin123

User Guide
Dashboard

The dashboard provides a farm overview with:
Section Description
Welcome Banner Greets user by name
KPI Cards Active crops, revenue, expenses, profit margin
Crop Status Planted, Growing, Ready to Harvest counts
Revenue vs Expenses Chart Visual comparison over time
Recent Activities Latest farm events
Crops Management

Adding a Crop:

    Navigate to "Crop Management" in sidebar

    Click "Plant New Crop" button

    Fill in:

        Crop name (e.g., Maize, Tomatoes)

        Brand/Seed company

        Variety

        Duration in months

        Planting date

    Click "Save"

Updating Crop Stage:

    Find the crop in the table

    Click "Update" button

    Select new stage: Planted → Growing → Ready to Harvest

    Confirm changes

Recording a Harvest:

    Find a crop in "Ready to Harvest" stage

    Click "Harvest" button

    Enter:

        Yield amount and unit (kg, tons, bags)

        Revenue amount

        Harvest date

        Notes (optional)

    Click "Save Harvest"

Equipment Management

Adding Equipment:

    Navigate to "Equipment" page

    Click "Add Equipment"

    Enter equipment details:

        Name (e.g., John Deere Tractor)

        Type (Tractor, Harvester, Plow, etc.)

        Model number

        Description

        Status (Working, Maintenance, Broken, Borrowed)

        Quantity

        Purchase date

        Price

    Click "Save"

Updating Equipment Status:

    Click the status dropdown in the table

    Select new status from options

Labor Management

Adding a Worker:

    Navigate to "Labor" page

    Click "Add Worker"

    Enter worker details:

        Full name

        Role (Farm Manager, Harvester, etc.)

        Phone number

        Location

        Status (Active, On Leave, Inactive)

        Hourly rate or monthly salary

        Start date

    Click "Save"

Processing Payroll:

    Find worker in table

    Click the dollar sign ($) button

    Select payment type:

        Hourly: Enter hours worked

        Salary: Fixed monthly amount

    Enter payment amount

    Select payment date

    Click "Process Payment"

Expense Tracking

Adding an Expense:

    Click "Add Expense" button (available on multiple pages)

    Fill in:

        Title/Description

        Amount

        Category (crop, equipment, labor, other)

        Expense type (seeds, fertilizer, purchase, repair, etc.)

        Date

        Notes (optional)

    Click "Save"

Weather Forecast

    Navigate to "Weather" page

    View current conditions for your location

    Check 5-day forecast

    Click "Refresh" for latest data

    Use "Change Location" to search different areas

Reports & Analytics

The Reports page provides comprehensive insights:
Tab Information
Summary Overview of all farm metrics
Financial Revenue, expenses, profit analysis
Crops Crop statistics and success rates
Equipment Utilization and maintenance costs
Labor Workforce and payroll summary
Expenses Detailed expense breakdown

Exporting Reports:

    Select date range (Week/Month/Quarter/Year)

    Click "Export" button

    JSON file will download with all data

API Documentation
Base URL
text

Development: http://localhost:8000/api
Production: https://your-domain.com/api

Authentication Endpoints
Register User
http

POST /auth/register
Content-Type: application/json

{
"name": "John Farmer",
"email": "john@farm.com",
"password": "password123",
"farm_name": "Green Acres",
"location": "Kisumu, Kenya"
}

Response:
json

{
"message": "User registered successfully",
"data": {
"id": 1,
"name": "John Farmer",
"email": "john@farm.com",
"farm_name": "Green Acres",
"location": "Kisumu, Kenya",
"role": "user"
}
}

Login
http

POST /auth/login
Content-Type: application/json

{
"email": "john@farm.com",
"password": "password123"
}

Response:
json

{
"message": "Login successful",
"data": {
"token": "eyJhbGciOiJIUzI1NiIs...",
"user": {
"id": 1,
"name": "John Farmer",
"email": "john@farm.com"
}
}
}

Crop Endpoints (require authentication)
Method Endpoint Description
GET /crops Get all crops
GET /crops/{id} Get crop by ID
POST /crops Create crop
PUT /crops/{id} Update crop
DELETE /crops/{id} Delete crop
GET /crops/stats/summary Get crop statistics

Create Crop Example:
http

POST /crops
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
"name": "Maize",
"brand": "SeedCo",
"variety": "H614",
"duration": 4,
"planted_date": "2026-01-15T00:00:00Z"
}

Equipment Endpoints
Method Endpoint Description
GET /equipment Get all equipment
POST /equipment Add equipment
PUT /equipment/{id} Update equipment
DELETE /equipment/{id} Delete equipment
Testing with cURL
bash

# Register

curl -X POST http://localhost:8000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name":"Test","email":"test@farm.com","password":"password123","farm_name":"Test Farm"}'

# Login

curl -X POST http://localhost:8000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"test@farm.com","password":"password123"}'

# Get crops (use token from login response)

curl -X GET http://localhost:8000/api/crops \
 -H "Authorization: Bearer YOUR_TOKEN_HERE"

Database Structure
Central Database (users.db)

users table:
sql

CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
farm_name TEXT,
location TEXT,
db_path TEXT,
role TEXT DEFAULT 'user',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

User Database (farm\_{user_id}.db)

crops table:
sql

CREATE TABLE crops (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
brand TEXT,
variety TEXT,
duration INTEGER,
stage TEXT DEFAULT 'Planted',
planted_date DATE,
expected_harvest_date DATE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

equipment table:
sql

CREATE TABLE equipment (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
type TEXT,
model TEXT,
description TEXT,
status TEXT DEFAULT 'Working',
quantity INTEGER DEFAULT 1,
purchase_date DATE,
price DECIMAL(10,2),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

labor table:
sql

CREATE TABLE labor (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
role TEXT,
phone TEXT,
location TEXT,
status TEXT DEFAULT 'Active',
hourly_rate DECIMAL(10,2),
monthly_salary DECIMAL(10,2),
start_date DATE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

expenses table:
sql

CREATE TABLE expenses (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
category TEXT,
expense_type TEXT,
date DATE,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

harvests table:
sql

CREATE TABLE harvests (
id INTEGER PRIMARY KEY AUTOINCREMENT,
crop_id INTEGER,
crop_name TEXT,
yield_amount DECIMAL(10,2),
yield_unit TEXT,
revenue DECIMAL(10,2),
harvest_date DATE,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

Inspecting Databases
bash

# Open central database

sqlite3 backend/data/users.db
.tables
SELECT \* FROM users;

# Open user database

sqlite3 backend/data/farm_1.db
.tables
SELECT \* FROM crops;

Configuration
Backend Configuration (backend/.env)
Variable Description Default
PORT Server port 8000
JWT_SECRET JWT signing key Required
JWT_EXPIRY_HOURS Token expiration 24
DB_PATH Central DB location ./data/users.db
ENVIRONMENT dev/production development
WEATHER_API_KEY OpenWeather API key (optional)
Frontend Configuration (frontend/.env)
Variable Description Default
VITE_API_URL Backend API URL http://localhost:8000/api
Tailwind Theme Configuration

To customize colors, edit tailwind.config.js:
javascript

module.exports = {
theme: {
extend: {
colors: {
farm: {
50: '#f0fdf4',
100: '#dcfce7',
// ... add your custom shades
700: '#15803d',
},
},
},
},
}

Troubleshooting
Common Issues & Solutions

1. Backend won't start: "address already in use"
   bash

# Find process using port 8000

lsof -i :8000

# Kill the process

kill -9 PID

# Or change port in .env

PORT=8001

2. Frontend can't connect to backend (404 errors)
   bash

# Check backend is running

curl http://localhost:8000/health

# Should return: {"status":"ok"}

# Verify API URL in frontend .env

VITE_API_URL=http://localhost:8000/api

3. Database locked error
   bash

# SQLite doesn't support multiple writers

# Make sure only one backend instance is running

pkill -f "go run cmd/api"

# Restart

go run cmd/api/main.go

4. Migration errors (missing columns)
   bash

# Backup and reset database

cp backend/data/users.db backend/data/users.db.backup
rm backend/data/users.db
rm backend/data/farm\_\*.db

# Restart backend - will recreate tables

go run cmd/api/main.go

5. JWT token invalid
   bash

# Token expires after JWT_EXPIRY_HOURS

# Login again to get new token

curl -X POST http://localhost:8000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"user@farm.com","password":"password"}'

6. Weather API not working
   bash

# Check API key in backend .env

WEATHER_API_KEY=your_valid_key

# Test API key

curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"

Logging & Debugging
Backend Logs

Backend logs to console with format:
text

2026/05/11 10:00:00 GET /api/crops 15.2ms
2026/05/11 10:00:00 POST /api/crops 8.3ms

Frontend Logs

Open browser DevTools (F12) → Console tab
Debug API calls
javascript

// In browser console
localStorage.getItem('token') // Check auth token

Development & Customization
Adding a New Feature

1. Create Model (internal/models/)
   go

// internal/models/newfeature.go
package models

type NewFeature struct {
ID int `json:"id"`
Name string `json:"name"`
}

2. Create Repository (internal/repository/)
   go

// Add to repository.go
type NewFeatureRepository struct {
db \*sql.DB
}

func (r \*NewFeatureRepository) GetAll() ([]models.NewFeature, error) {
// Implementation
}

3. Create Service (internal/service/)
   go

type NewFeatureService struct {
repo \*repository.NewFeatureRepository
}

func (s \*NewFeatureService) GetAll() ([]models.NewFeature, error) {
return s.repo.GetAll()
}

4. Create Handler (internal/handler/adapters.go)
   go

func NewFeatureGetAll(w http.ResponseWriter, r \*http.Request) {
userDB := middleware.GetUserDB(r)
repo := repository.NewNewFeatureRepository(userDB)
items, \_ := repo.GetAll()
json.NewEncoder(w).Encode(items)
}

5. Add Route (cmd/api/main.go)
   go

r.Get("/api/newfeature", handler.NewFeatureGetAll)

6. Add Frontend API (src/services/api.js)
   javascript

export const newFeatureAPI = {
getAll: () => api.get('/newfeature'),
create: (data) => api.post('/newfeature', data),
};

7. Create Frontend Component
   jsx

// src/pages/NewFeature.jsx
import React, { useState, useEffect } from 'react';
import { newFeatureAPI } from '../services/api';

export const NewFeature = () => {
const [data, setData] = useState([]);

    useEffect(() => {
        newFeatureAPI.getAll().then(res => setData(res.data));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">New Feature</h1>
            {/* Component content */}
        </div>
    );

};

Modifying Existing Features

    Change UI styling: Edit component JSX files in frontend/src/pages/

    Change business logic: Edit service files in backend/internal/service/

    Change database queries: Edit repository files in backend/internal/repository/

    Change API responses: Edit handler files in backend/internal/handler/

Database Migrations

For schema changes, add ALTER statements to createTables() in pkg/database/sqlite.go:
go

func createUserTables(db \*sql.DB) error {
// Add new column to existing table
db.Exec("ALTER TABLE crops ADD COLUMN organic BOOLEAN DEFAULT 0")
// ... rest of migrations
}

Deployment
Deploy Backend to Render

    Push code to GitHub

    Create new Web Service on Render

    Connect repository

    Set build command: go build -o api cmd/api/main.go

    Set start command: ./api

    Add environment variables

    Deploy

Deploy Backend to Railway
bash

# Install Railway CLI

npm i -g @railway/cli

# Login

railway login

# Initialize

railway init

# Deploy

railway up

Deploy Frontend to Netlify

    Build frontend: npm run build

    Drag dist folder to Netlify drag-and-drop area

    Or connect GitHub repository

Critical Netlify Configuration:

Create netlify.toml in frontend root:
toml

[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/\*"
to = "/index.html"
status = 200

Environment Variables for Production

Backend (.env):
env

PORT=8080
JWT_SECRET=your-production-secret-key
ENVIRONMENT=production

Frontend (.env.production):
env

VITE_API_URL=https://your-backend.onrender.com/api

Support & Resources
Useful Commands
bash

# Check Go version

go version

# Check Node version

node --version

# View backend logs

tail -f backend/logs/app.log

# Backup all databases

tar -czf backup-$(date +%Y%m%d).tar.gz backend/data/

# Reset application

rm -rf backend/data/\*.db

File Structure Reference
text

farm-manager/
├── backend/
│ ├── cmd/api/main.go # Entry point
│ ├── internal/
│ │ ├── models/ # Data structures
│ │ ├── repository/ # Database operations
│ │ ├── service/ # Business logic
│ │ ├── handler/ # HTTP handlers
│ │ └── middleware/ # Auth, CORS
│ ├── pkg/
│ │ ├── database/ # DB connection
│ │ └── auth/ # JWT utilities
│ └── data/ # SQLite database files
├── frontend/
│ ├── src/
│ │ ├── pages/ # UI components
│ │ ├── components/ # Reusable components
│ │ ├── services/ # API calls
│ │ ├── context/ # Auth context
│ │ └── App.jsx # Main component
│ └── public/ # Static assets
└── README.md

Version History
Version Date Changes
1.0.0 2026-05-11 Initial release
1.1.0 TBD Planned: Mobile app, Push notifications
License

This project is licensed under the MIT License.
Contributing

    Fork the repository

    Create feature branch: git checkout -b feature/amazing-feature

    Commit changes: git commit -m 'Add amazing feature'

    Push: git push origin feature/amazing-feature

    Open Pull Request

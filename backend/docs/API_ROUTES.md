# 🌾 Farm Manager API Routes

This document outlines the REST API routes for the Farm Manager backend.

Base URL: `/api/v1/`

---

## 🌾 Core Routes

### 1. Activities

Tracks all farm activities (cultivation, harvesting, purchase, sale).

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | /activities     | List all activities |
| POST   | /activities     | Create activity     |
| GET    | /activities/:id | Get single activity |
| PUT    | /activities/:id | Update activity     |
| DELETE | /activities/:id | Delete activity     |

---

### 2. Inputs

Manage farm resources (seeds, fertilizers, labor, machinery).

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| GET    | /inputs     | List all inputs |
| POST   | /inputs     | Add input       |
| GET    | /inputs/:id | Get input       |
| PUT    | /inputs/:id | Update input    |
| DELETE | /inputs/:id | Delete input    |

---

### 2b. Crops

Manage crops and compute per-crop profitability.

| Method | Endpoint                | Description                                     |
| ------ | ----------------------- | ----------------------------------------------- |
| GET    | /crops                  | List all crops                                  |
| POST   | /crops                  | Add crop                                        |
| GET    | /crops/profitability    | Per-crop revenue, expenses, net, margin         |
| GET    | /crops/:id              | Get crop                                       |
| PUT    | /crops/:id              | Update crop                                    |
| DELETE | /crops/:id              | Delete crop                                    |

**Note:** the `/crops/profitability` route must be declared before `/crops/{id}`
so the literal segment wins over the path parameter.

---

### 3. Expenses

Track costs. Each expense is linked to a crop and may be flagged as a shared
(farm-wide) cost that is excluded from the crop's profitability.

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| GET    | /expenses     | List all expenses |
| POST   | /expenses     | Add expense       |
| GET    | /expenses/:id | Get expense       |
| PUT    | /expenses/:id | Update expense    |
| DELETE | /expenses/:id | Delete expense    |

**Expense payload notes**
- `crop_id` (integer, required on create/update): the crop this expense belongs to.
  Returns `400 crop_id is required` when missing or `<= 0`.
- `is_shared_cost` (boolean, optional): when `true`, the expense is treated as a
  shared/farm-level cost and is excluded from the crop's profitability math.

---

### 4. Revenue / Sales

Manage farm sales and income.

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| GET    | /sales     | List all sales |
| POST   | /sales     | Record sale    |
| GET    | /sales/:id | Get sale       |
| PUT    | /sales/:id | Update sale    |
| DELETE | /sales/:id | Delete sale    |

---

### 5. Harvest / Yield

Track harvest data and yield statistics.

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | /harvests     | List harvests  |
| POST   | /harvests     | Add harvest    |
| GET    | /harvests/:id | Get harvest    |
| PUT    | /harvests/:id | Update harvest |
| DELETE | /harvests/:id | Delete harvest |

---

## 📊 Analytics Routes

Provides insights and visualizations.

### Summary Dashboard

GET /analytics/summary

Returns total costs, revenue, and profit/loss.

### Cost Breakdown

GET /analytics/costs?from=YYYY-MM-DD&to=YYYY-MM-DD

Returns costs split by inputs, labor, and harvesting.

### Revenue Trends

GET /analytics/revenue-trends

Shows revenue trends over time.

### Yield Trends

GET /analytics/yield-trends

Shows harvest yield trends over time.

### Activity Timeline

GET /analytics/activity-timeline

Timeline of farm activities.

---

## 📂 Filtering

Use query parameters to filter data:

GET /activities?type=harvest&from=2026-01-01&to=2026-02-01

---

## 🔐 Authentication (Optional)

If you add user accounts:

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| POST   | /auth/register | Register user    |
| POST   | /auth/login    | Login user       |
| GET    | /auth/me       | Get current user |

---

## 🧪 Utility Routes

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| GET    | /health  | Server status |

---

## 🧠 Suggested Go Route Grouping

### `/api/v1`

    /activities

    /inputs

    /expenses

    /sales

    /harvests

    /analytics

    /auth


---

## 🚀 Example Workflow

1. Record expense:

   POST /expenses

2. Record harvest:

   POST /harvests

3. Record sale:

   POST /sales

4. View dashboard:

   GET /analytics/summary

---

## 🔥 Pro Tips

- Keep **activities as the central table**.
- Link everything:
  - Expenses → Activity
  - Harvest → Activity
  - Sales → Harvest
- This prevents messy data relationships later.

# 🌾 Farm Manager API Routes

This document outlines the REST API routes for the Farm Manager backend.

Base URL: `/api/v1/`

All routes below are behind JWT auth (obtained via `/auth/login`), except
`/auth/register`, `/auth/login`, and `/health`.

---

## 🌾 Core Routes

### 1. Crops

Manage crops and compute per-crop profitability.

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| GET    | /crops               | List all crops                          |
| POST   | /crops               | Add crop                                |
| GET    | /crops/stats/summary | Crop statistics summary                 |
| GET    | /crops/profitability | Per-crop revenue, expenses, net, margin |
| GET    | /crops/:id           | Get a single crop                       |
| PUT    | /crops/:id           | Update a crop                           |
| DELETE | /crops/:id           | Delete a crop                           |

**Route ordering:** `/crops/stats/summary` and `/crops/profitability` must be
declared before `/crops/{id}` so the literal segments win over the path param.

---

### 2. Expenses

Track costs. Each expense is linked to a crop and may be flagged as a shared
(farm-wide) cost that is excluded from the crop's profitability.

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | /expenses             | List all expenses      |
| POST   | /expenses             | Add expense            |
| GET    | /expenses/stats/summary | Summary               |
| GET    | /expenses/:id         | Get an expense         |
| PUT    | /expenses/:id         | Update an expense      |
| DELETE | /expenses/:id         | Delete an expense      |

**Expense payload notes**
- `crop_id` (integer, required on create/update): the crop this expense belongs
  to. Returns `400 crop_id is required` when missing or `<= 0`.
- `is_shared_cost` (boolean, optional): when `true`, the expense is treated as a
  shared/farm-level cost and excluded from the crop's profitability math.

---

### 3. Harvest / Yield

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | /harvests             | List harvests   |
| POST   | /harvests             | Add harvest     |
| GET    | /harvests/stats/summary | Summary       |
| GET    | /harvests/:id         | Get a harvest   |
| PUT    | /harvests/:id         | Update harvest  |
| DELETE | /harvests/:id         | Delete harvest  |

**Payload note:** `crop_id` (integer) is required on create/update. Returns
`400 crop_id is required` when missing or `<= 0`.

---

### 4 & 5. Other entities

Present but not part of the refactored profitability flow; their routes are
untouched:

**Equipment**

| Method | Endpoint                  | Description    |
| ------ | ------------------------- | -------------- |
| GET    | /equipment                | List equipment |
| POST   | /equipment                | Add equipment  |
| GET    | /equipment/stats/summary  | Summary        |
| GET    | /equipment/:id            | Get            |
| PUT    | /equipment/:id            | Update         |
| DELETE | /equipment/:id            | Delete         |

**Labor**

| Method | Endpoint              | Description  |
| ------ | --------------------- | ------------ |
| GET    | /labor                | List labor   |
| POST   | /labor                | Add labor    |
| GET    | /labor/stats/summary  | Summary      |
| GET    | /labor/:id            | Get          |
| PUT    | /labor/:id            | Update       |
| DELETE | /labor/:id            | Delete       |

---

## 🔐 Authentication

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Register a user     |
| POST   | /auth/login    | Login               |
| GET    | /auth/me       | Get current user    |

---

## 🧪 Utility Routes

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| GET    | /health  | Server status |
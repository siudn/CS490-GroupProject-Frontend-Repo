# 💈 Salon App — Frontend Setup Guide

## 🚀 Overview
This app is organized by **feature**.  
No one should touch the root app files — everything is already wired up.

**Main features**
- `auth/` → login & signup (Auth team)
- `booking/` → customer booking flow
- `schedule/` → barber/staff schedule management
- `salon-reg/` → salon registration + admin verification

---

## 🧱 Folder Layout
```
src/
  app/
    App.jsx              # main entry (never touch)
    routes.jsx           # imports all feature routes
    layout/
      RootLayout.jsx     # shell with header/footer
      Header.jsx
  features/
    auth/
      auth-provider.jsx  # auth logic (real + stub)
      routes.jsx
      pages/
    booking/
    schedule/
    salon-reg/
  shared/
    api/client.js        # fetch wrapper
    routing/Protected.jsx
```

---

## 🔑 Auth System (How It Works)

- Everything runs under a single **AuthProvider** that gives `{ user, login, logout }`.
- Uses `.env` to toggle between:
  - `VITE_AUTH_MODE=stub` → fake login (for dev)
  - `VITE_AUTH_MODE=real` → backend API login
- In **stub mode**, the sign-in page has “Demo Customer / Owner / Barber / Admin” buttons.
- Or open:  
  `http://localhost:5173/auth/sign-in?demo=customer`

**User object**
```js
user = { id: 1, role: "customer" | "owner" | "barber" | "admin" } | null
```

---

## 🧑‍💻 Feature Team Rules

### 1️⃣ Never touch
- `App.jsx`
- `RootLayout.jsx`
- `app/routes.jsx`

### 2️⃣ Only edit your feature folder
```
src/features/<your-feature>/
```

### 3️⃣ Add new pages
Example:
```bash
src/features/booking/pages/BrowseServices.jsx
```
Register inside your feature’s `routes.jsx`:
```jsx
import { lazy } from "react";
const BrowseServices = lazy(() => import("./pages/BrowseServices.jsx"));

export default [
  { path: "/booking", element: <BrowseServices /> },
];
```
Run `npm run dev`, visit `/booking`, and it’s live.

### 4️⃣ Need user info?
```jsx
import { useAuth } from "../auth/auth-provider.jsx";
const { user } = useAuth();

if (user?.role === "owner") {
  // show owner-only UI
}
```

### 5️⃣ API calls
```jsx
import { api } from "../../shared/api/client.js";
const data = await api("/bookings");
```
Our fetch wrapper includes cookies/session automatically.

---

## 🧠 Auth Team Instructions

Implement the backend endpoints:

| Endpoint | Method | Returns |
|-----------|---------|----------|
| `/auth/login` | POST | `{ id, role, email }` |
| `/auth/logout` | POST | `{ success: true }` |
| `/auth/me` | GET | `{ id, role, email }` |

- Use `credentials: "include"` for cookies.
- Keep the same contract `{ user, login, logout }`.
- Once ready, set `VITE_AUTH_MODE=real` — **no app changes needed**.

---

## 🧩 Local Dev Setup
```bash
# Install deps
npm install

# Run dev server
npm run dev

# Default URL
http://localhost:5173/
```

**.env.local**
```
VITE_AUTH_MODE=stub
VITE_API=http://localhost:3000
```

---

## ✅ Quick Summary

- ❌ Don’t touch `App.jsx`
- ✅ Work only in your feature folder
- ➕ Add pages → register them in your `routes.jsx`
- 🔑 To simulate login → go to `/auth/sign-in` → click a Demo button
- 👤 Need user info → `const { user } = useAuth()`
- 🧠 That’s it. Everything auto-loads.

---

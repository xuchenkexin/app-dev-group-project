# SoFea Management System — Frontend

React + Vite frontend for SCSE2243 Application Development Project.

## Stack
- React 18 + Vite
- React Router v6 (client-side routing)
- Axios (API client, pre-configured with JWT interceptors)
- Linear-inspired dark design system

## Project Structure

```
src/
├── api/
│   ├── client.js        # Axios instance (change VITE_API_URL to connect real backend)
│   └── index.js         # All API functions + mock data (swap mock → real calls here)
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx      # Sidebar + main outlet
│   │   ├── Sidebar.jsx        # Navigation
│   │   └── ProtectedRoute.jsx # Auth guard
│   └── ui/
│       ├── Badge.jsx    ├── Button.jsx  ├── Card.jsx
│       ├── EmptyState.jsx     ├── Modal.jsx   ├── PageHeader.jsx
│       ├── StatCard.jsx       └── Table.jsx
├── context/
│   ├── AuthContext.jsx  # Login state + JWT storage
│   └── ToastContext.jsx # Global notifications
├── hooks/
│   └── useFetch.js      # Reusable async data hook
└── pages/
    ├── LoginPage.jsx
    ├── Dashboard.jsx
    ├── activities/ActivitiesPage.jsx
    ├── finance/FinancePage.jsx
    ├── announcements/AnnouncementsPage.jsx
    ├── users/UsersPage.jsx
    └── audit/AuditPage.jsx
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

Login: any email from Users page, password: `password123`

## Connecting to Backend

1. Copy `.env.example` → `.env.local`
2. Set `VITE_API_URL=http://your-backend/api`
3. In `src/api/index.js`, replace mock functions with real axios calls:

```js
// Before (mock)
getActivities: async () => { await delay(); return [...mockActivities] }

// After (real backend)
getActivities: async () => {
  const res = await client.get('/activities')
  return res.data
}
```

## Team
- Zhang Yihan — A24MJ4011
- Yang Dengkai — A24MJ4009
- Xu Chenkexin — A24MJ4008
- Supervisor: Dr. Halinawati Bt Hirol

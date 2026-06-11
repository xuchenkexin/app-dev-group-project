import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import ActivitiesPage from './pages/activities/ActivitiesPage'
import FinancePage from './pages/finance/FinancePage'
import AnnouncementsPage from './pages/announcements/AnnouncementsPage'
import UsersPage from './pages/users/UsersPage'
import AuditPage from './pages/audit/AuditPage'
import CheckinPage from './pages/checkin/CheckinPage'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="dashboard"      element={<Dashboard />} />
              <Route path="activities"     element={<ActivitiesPage />} />
              <Route path="checkin"        element={<CheckinPage />} />
              <Route path="finance"        element={<FinancePage />} />
              <Route path="announcements"  element={<AnnouncementsPage />} />
              <Route path="users"          element={<UsersPage />} />
              <Route path="audit"          element={<AuditPage />} />
              <Route path="*"              element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

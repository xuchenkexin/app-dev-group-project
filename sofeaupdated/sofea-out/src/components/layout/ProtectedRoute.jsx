import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLE_ROUTES } from '../../config/roles'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  const allowed = ROLE_ROUTES[user.role] || []
  if (!allowed.includes(location.pathname)) {
    return <Navigate to="/" replace />
  }

  return children
}

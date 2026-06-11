import { useAuth } from '../context/AuthContext'
import { ROLE_PERMISSIONS, ROLE_ROUTES } from '../config/roles'

export function usePermission() {
  const { user } = useAuth()
  const role = user?.role || 'high_committee'
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.high_committee

  const can = (action) => permissions[action] === true
  const canAccess = (path) => (ROLE_ROUTES[role] || []).includes(path)

  return { can, canAccess, role }
}

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePermission } from '../../hooks/usePermission'
import sofealogo from '../../assets/sofea-logo.png'

const navItems = [
  {
    group: 'Workspace',
    items: [
      { to: '/dashboard',    label: 'Dashboard',      icon: IconDashboard,      badge: null },
      { to: '/activities',   label: 'Activities',     icon: IconCalendar,       badge: 4 },
      { to: '/checkin',      label: 'Check-in',       icon: IconCheckin,        badge: null },
      { to: '/finance',      label: 'Finance',        icon: IconFinance,        badge: 7 },
      { to: '/announcements',label: 'Announcements',  icon: IconAnnouncement,   badge: 3 },
    ]
  },
  {
    group: 'Admin',
    items: [
      { to: '/users',        label: 'Users',          icon: IconUsers,          badge: null },
      { to: '/audit',        label: 'Audit Report',   icon: IconAudit,          badge: null },
    ]
  }
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { canAccess } = usePermission()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabel = {
    sa_advisor: 'SA Advisor',
    high_committee: 'High Committee',
    member: 'Member',
  }

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('') || 'U'

  return (
    <nav style={{
      width: 220, minHeight: '100vh',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--hairline)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={sofealogo} alt="SOFEA" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '1.5px', color: 'var(--primary)' }}>SOFEA</div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase', color: 'var(--ink-subtle)' }}>MJIIT · UTM</div>
        </div>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {navItems.map(group => (
          <div key={group.group} style={{ padding: '8px 8px 4px' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-tertiary)', padding: '0 8px 6px' }}>
              {group.group}
            </div>
            {group.items.map(item => {
              if (!canAccess(item.to)) return null
              return <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '7px 8px', borderRadius: 6,
                  color: isActive ? 'var(--ink)' : 'var(--ink-subtle)',
                  background: isActive ? 'var(--surface-3)' : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 13, textDecoration: 'none',
                  transition: 'background 0.1s, color 0.1s',
                  marginBottom: 1,
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('active'))
                    e.currentTarget.style.background = 'var(--surface-2)'
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.style.background.includes('surface-3'))
                    e.currentTarget.style.background = ''
                }}
              >
                <item.icon />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge != null && (
                  <span style={{
                    background: 'var(--surface-4)', color: 'var(--ink-subtle)',
                    fontSize: 10, fontFamily: 'var(--mono)',
                    padding: '1px 6px', borderRadius: 'var(--radius-pill)',
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}
          onClick={handleLogout}
          title="Click to logout"
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-subtle)' }}>
              {roleLabel[user?.role] || user?.role}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Icons ────────────────────────────────────────────────────
function IconDashboard() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
}
function IconCalendar() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>
}
function IconFinance() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M5 5h4.5a2.5 2.5 0 010 5H5m0-5V4m0 6v2"/></svg>
}
function IconAnnouncement() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5.5h12v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7zm4 8v1.5m4-1.5v1.5M2 5.5l6-4 6 4"/></svg>
}
function IconUsers() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2-5 5-5s5 2 5 5"/><path d="M11 2a3 3 0 010 6"/><path d="M14 14c0-2.5-1.5-4.2-3-5"/></svg>
}
function IconAudit() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M5 6h6M5 9h4"/></svg>
}
function IconCheckin() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="10" y="10" width="1.5" height="1.5" fill="currentColor" stroke="none"/><path d="M12.5 9v2m0 2v.5M9 12.5h2m2 0h.5"/></svg>
}

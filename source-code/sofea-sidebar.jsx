// SoFea — Sidebar component

const Sidebar = ({ currentPage, navigate, role, userName, userRole }) => {
  const navItems = [
    { id: 'dashboard',      label: 'Dashboard',      icon: 'dashboard' },
    { id: 'activities',     label: 'Activities',     icon: 'activities' },
    { id: 'finance',        label: 'Finance',        icon: 'finance' },
    { id: 'announcements',  label: 'Announcements',  icon: 'announcements' },
  ];

  const activePages = {
    dashboard: 'dashboard',
    activities: 'activities',
    'activity-detail': 'activities',
    attendance: 'activities',
    finance: 'finance',
    'record-transaction': 'finance',
    'audit-report': 'finance',
    announcements: 'announcements',
  };

  const activeNav = activePages[currentPage] || currentPage;

  return (
    <div style={{
      width: 210, minWidth: 210, background: '#0C447C',
      display: 'flex', flexDirection: 'column',
      height: '100%', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 18px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#185FA5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: 0.3 }}>SoFea</span>
      </div>

      {/* Nav section label */}
      <div style={{ padding: '0 18px 8px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>
        Navigation
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                fontFamily: 'Inter, sans-serif',
                borderLeft: isActive ? '3px solid #378ADD' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon name={item.icon} size={16} color={isActive ? '#fff' : 'rgba(255,255,255,0.65)'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Card */}
      <div style={{ padding: '12px 10px 16px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 10,
          padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#378ADD',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0,
          }}>
            {(userName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
              {userRole || 'Member'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Sidebar });

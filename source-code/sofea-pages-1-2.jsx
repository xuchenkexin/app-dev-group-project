// SoFea — Page 1: Login, Page 2: Dashboard

// ── LOGIN PAGE ─────────────────────────────────────────
const LoginPage = ({ onLogin, openModal }) => {
  const [role, setRole] = React.useState('committee');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required.';
    if (!password) e.password = 'Password is required.';
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onLogin(role);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F0F4F8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', padding: 24, boxSizing: 'border-box',
    }}>
      <div style={{
        width: 380, background: '#fff',
        borderRadius: 16, border: '0.5px solid #D0DDE8',
        padding: '36px 32px 32px', boxSizing: 'border-box',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#185FA5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#0C447C' }}>SoFea</span>
        </div>
        <div style={{ fontSize: 12, color: '#8AA0B0', marginBottom: 28 }}>
          Student Organization Management System
        </div>

        {/* Role Toggle */}
        <div style={{ marginBottom: 22 }}>
          <Label>Sign in as</Label>
          <div style={{ display: 'flex', background: '#F0F4F8', borderRadius: 8, padding: 3, gap: 3 }}>
            {[
              { id: 'advisor', label: 'SA Advisor' },
              { id: 'committee', label: 'High Committee' },
            ].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                flex: 1, height: 36, borderRadius: 6, border: 'none',
                background: role === r.id ? '#185FA5' : 'transparent',
                color: role === r.id ? '#fff' : '#6888A0',
                fontSize: 13, fontWeight: role === r.id ? 500 : 400,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <FormField label="Email Address" error={errors.email}>
            <SofInput
              type="email" placeholder="you@university.edu.my"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(err => ({ ...err, email: '' })); }}
              error={!!errors.email}
            />
          </FormField>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <FormField label="Password" error={errors.password}>
            <div style={{ position: 'relative' }}>
              <SofInput
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(err => ({ ...err, password: '' })); }}
                error={!!errors.password}
                style={{ paddingRight: 42 }}
              />
              <button onClick={() => setShowPass(s => !s)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#8AA0B0', padding: 0,
              }}>
                <Icon name={showPass ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
          </FormField>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: 22 }}>
          <button onClick={() => openModal('forgot-password')} style={{
            background: 'none', border: 'none', color: '#185FA5',
            fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>Forgot password?</button>
        </div>

        {/* Sign In */}
        <PrimaryBtn onClick={handleLogin} style={{ width: '100%', height: 42, fontSize: 14 }}>
          Sign In
        </PrimaryBtn>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#8AA0B0' }}>
          Need access?{' '}
          <span style={{ color: '#185FA5' }}>Contact your administrator</span>
        </div>
      </div>
    </div>
  );
};

// ── DASHBOARD PAGE ─────────────────────────────────────
const DashboardPage = ({ navigate, openModal, activities, announcements, role }) => {
  const totalIncome = 1820;
  const totalExpenses = 730;
  const netBalance = totalIncome - totalExpenses;

  const recentActivities = activities.slice(0, 4);
  const recentAnnouncements = announcements.slice(0, 4);

  const statCards = [
    { icon: <Icon name="activities" size={20} color="#185FA5" />, iconBg: '#E6F1FB', value: activities.length, label: 'Total Activities' },
    { icon: <Icon name="finance" size={20} color="#27500A" />, iconBg: '#EAF3DE', value: `RM ${netBalance.toLocaleString()}`, label: 'Net Balance' },
    { icon: <Icon name="users" size={20} color="#185FA5" />, iconBg: '#E6F1FB', value: 48, label: 'Total Members' },
    { icon: <Icon name="announcements" size={20} color="#633806" />, iconBg: '#FAEEDA', value: announcements.length, label: 'Announcements' },
  ];

  return (
    <PageLayout title="Dashboard" actions={
      <button onClick={() => openModal('notifications')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        position: 'relative', color: '#6888A0', padding: 6,
        display: 'flex', alignItems: 'center',
      }}>
        <Icon name="bell" size={20} />
        <span style={{
          position: 'absolute', top: 2, right: 2,
          width: 8, height: 8, borderRadius: '50%', background: '#185FA5',
        }} />
      </button>
    }>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {statCards.map((s, i) => (
          <SofCard key={i} style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: s.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#1A2A3A', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6888A0', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          </SofCard>
        ))}
      </div>

      {/* Two-col section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Recent Activities */}
        <SofCard>
          <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionTitle>Recent Activities</SectionTitle>
            <button onClick={() => navigate('activities')} style={{
              background: 'none', border: 'none', color: '#185FA5',
              fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>See all →</button>
          </div>
          <Divider />
          <div style={{ padding: '8px 0' }}>
            {recentActivities.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px',
                borderBottom: '0.5px solid #F0F4F8',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: a.status === 'Open' ? '#185FA5' : a.status === 'Closed' ? '#E49B0F' : '#E24B4A',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2A3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: '#8AA0B0', marginTop: 1 }}>{a.date}</div>
                </div>
                <Badge label={a.status} />
              </div>
            ))}
          </div>
        </SofCard>

        {/* Announcements */}
        <SofCard>
          <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionTitle>Announcements</SectionTitle>
            <button onClick={() => navigate('announcements')} style={{
              background: 'none', border: 'none', color: '#185FA5',
              fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>See all →</button>
          </div>
          <Divider />
          <div style={{ padding: '8px 0' }}>
            {recentAnnouncements.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 20px',
                borderBottom: '0.5px solid #F0F4F8',
              }}>
                {a.unread
                  ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#185FA5', flexShrink: 0, marginTop: 4 }} />
                  : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'transparent', flexShrink: 0, marginTop: 4 }} />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: a.unread ? 600 : 400, color: '#1A2A3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: '#8AA0B0', marginTop: 1 }}>{a.audience} · {a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </SofCard>

      </div>
    </PageLayout>
  );
};

Object.assign(window, { LoginPage, DashboardPage });

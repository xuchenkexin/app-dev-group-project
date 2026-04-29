// SoFea — Global design tokens, icons, and primitive UI components

const C = {
  primaryDark: '#0C447C',
  primary: '#185FA5',
  primaryMid: '#378ADD',
  primaryLight: '#E6F1FB',
  primaryBorder: '#B5D4F4',
  bgPage: '#F0F4F8',
  bgCard: '#FFFFFF',
  borderCard: '#D0DDE8',
  textPrimary: '#1A2A3A',
  textSecondary: '#6888A0',
  textMuted: '#8AA0B0',
};

const BADGE_MAP = {
  'Open':           { bg: '#E6F1FB', text: '#185FA5' },
  'Closed':         { bg: '#FAEEDA', text: '#633806' },
  'Cancelled':      { bg: '#FCEBEB', text: '#791F1F' },
  'Present':        { bg: '#EAF3DE', text: '#27500A' },
  'Absent':         { bg: '#FCEBEB', text: '#791F1F' },
  'Income':         { bg: '#EAF3DE', text: '#27500A' },
  'Expense':        { bg: '#FCEBEB', text: '#791F1F' },
  'All Members':    { bg: '#E6F1FB', text: '#185FA5' },
  'High Committee': { bg: '#F0EAFB', text: '#5B2D8E' },
  'SA Advisor':     { bg: '#E6F5FB', text: '#0C5A78' },
};

// SVG icon paths
const SVGI = {
  dashboard:     () => <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  activities:    () => <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  finance:       () => <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  announcements: () => <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  calendar:      () => <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  location:      () => <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  users:         () => <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  bell:          () => <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  search:        () => <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  plus:          () => <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  chevronRight:  () => <polyline points="9 18 15 12 9 6"/>,
  chevronDown:   () => <polyline points="6 9 12 15 18 9"/>,
  eye:           () => <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff:        () => <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  x:             () => <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  check:         () => <polyline points="20 6 9 17 4 12"/>,
  arrowLeft:     () => <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
  clock:         () => <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  download:      () => <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  edit:          () => <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  checkSquare:   () => <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  trending:      () => <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  info:          () => <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  mail:          () => <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  fileText:      () => <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  speakerphone:  () => <><path d="M18 8a6 6 0 0 1 0 8"/><path d="M14.54 9.46a5 5 0 0 1 0 5.07"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></>,
};

const Icon = ({ name, size = 16, color = 'currentColor', style: s }) => {
  const Paths = SVGI[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={s}>
      {Paths ? <Paths /> : null}
    </svg>
  );
};

const Badge = ({ label, style: s }) => {
  const bs = BADGE_MAP[label] || { bg: '#E6F1FB', text: '#185FA5' };
  return (
    <span style={{
      background: bs.bg, color: bs.text,
      borderRadius: 20, padding: '3px 10px',
      fontSize: 11, fontWeight: 500,
      display: 'inline-block', whiteSpace: 'nowrap', ...s,
    }}>{label}</span>
  );
};

const Avatar = ({ initials, size = 32, bg = '#378ADD', color = '#fff', fontSize = 12 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: bg, color, fontSize, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>{initials}</div>
);

const SofCard = ({ children, style: s }) => (
  <div style={{ background: '#fff', border: '0.5px solid #D0DDE8', borderRadius: 12, ...s }}>
    {children}
  </div>
);

const SofInput = ({ style: s, error, ...props }) => (
  <input {...props} style={{
    height: 40, borderRadius: 8,
    border: error ? '1px solid #E24B4A' : '0.5px solid #C0D0DE',
    background: '#F8FBFD', padding: '0 12px',
    fontSize: 13, color: '#1A2A3A', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', ...s,
  }} />
);

const SofTextarea = ({ style: s, error, ...props }) => (
  <textarea {...props} style={{
    borderRadius: 8,
    border: error ? '1px solid #E24B4A' : '0.5px solid #C0D0DE',
    background: '#F8FBFD', padding: '10px 12px',
    fontSize: 13, color: '#1A2A3A', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    resize: 'vertical', fontFamily: 'Inter, sans-serif', ...s,
  }} />
);

const SofSelect = ({ children, style: s, ...props }) => (
  <select {...props} style={{
    height: 40, borderRadius: 8,
    border: '0.5px solid #C0D0DE',
    background: '#F8FBFD', padding: '0 10px',
    fontSize: 13, color: '#1A2A3A', outline: 'none', cursor: 'pointer', ...s,
  }}>{children}</select>
);

const PrimaryBtn = ({ children, onClick, style: s, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    height: 40, borderRadius: 8,
    background: disabled ? '#B5D4F4' : '#185FA5',
    color: '#fff', border: 'none', padding: '0 18px',
    fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    whiteSpace: 'nowrap', ...s,
  }}>{children}</button>
);

const OutlineBtn = ({ children, onClick, style: s }) => (
  <button onClick={onClick} style={{
    height: 40, borderRadius: 8,
    background: '#fff', color: '#185FA5',
    border: '0.5px solid #185FA5', padding: '0 18px',
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    whiteSpace: 'nowrap', ...s,
  }}>{children}</button>
);

const Label = ({ children, style: s }) => (
  <div style={{ fontSize: 12, fontWeight: 500, color: '#4A6070', marginBottom: 6, ...s }}>{children}</div>
);

const FormField = ({ label, error, children, style: s }) => (
  <div style={{ display: 'flex', flexDirection: 'column', ...s }}>
    {label && <Label>{label}</Label>}
    {children}
    {error && <div style={{ fontSize: 11, color: '#791F1F', marginTop: 4 }}>{error}</div>}
  </div>
);

const ProgressBar = ({ value, max, color = '#185FA5' }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ height: 6, background: '#E6F1FB', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
    </div>
  );
};

const PageLayout = ({ children, title, actions, subtitle, style: s }) => (
  <div style={{ padding: 24, flex: 1, overflowY: 'auto', boxSizing: 'border-box', ...s }}>
    {(title || actions) && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: '#0C447C', margin: 0 }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: '#6888A0', marginTop: 2 }}>{subtitle}</div>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

const SectionTitle = ({ children, style: s }) => (
  <div style={{ fontSize: 14, fontWeight: 500, color: '#0C447C', ...s }}>{children}</div>
);

const Divider = ({ style: s }) => (
  <div style={{ height: '0.5px', background: '#D0DDE8', ...s }} />
);

Object.assign(window, {
  C, BADGE_MAP, Icon, Badge, Avatar,
  SofCard, SofInput, SofTextarea, SofSelect,
  PrimaryBtn, OutlineBtn, Label, FormField,
  ProgressBar, PageLayout, SectionTitle, Divider,
});

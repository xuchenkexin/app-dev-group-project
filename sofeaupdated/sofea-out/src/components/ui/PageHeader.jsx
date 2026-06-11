export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.6px', color: 'var(--ink)', marginBottom: 4 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: 'var(--ink-subtle)' }}>{subtitle}</p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </div>
  )
}

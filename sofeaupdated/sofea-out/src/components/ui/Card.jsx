export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ children, style }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--hairline)',
      display: 'flex', alignItems: 'center', gap: 10,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return (
    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.1px' }}>
      {children}
    </span>
  )
}

export function CardActions({ children }) {
  return <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>{children}</div>
}

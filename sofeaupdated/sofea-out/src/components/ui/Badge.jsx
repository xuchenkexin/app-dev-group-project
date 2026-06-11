
const variants = {
  green:  { bg: 'var(--success-bg)',  color: 'var(--success-text)' },
  amber:  { bg: 'var(--warning-bg)',  color: 'var(--warning-text)' },
  red:    { bg: 'var(--danger-bg)',   color: 'var(--danger-text)'  },
  blue:   { bg: 'var(--info-bg)',     color: 'var(--info-text)'    },
  gray:   { bg: 'var(--surface-3)',   color: 'var(--ink-subtle)'   },
}

const statusMap = {
  open:           'green',
  active:         'green',
  registered:     'green',
  present:        'green',
  income:         'green',
  closed:         'amber',
  pending:        'amber',
  absent:         'red',
  cancelled:      'red',
  expense:        'red',
  sa_advisor:     'blue',
  high_committee: 'blue',
  member:         'gray',
}

export function Badge({ children, variant, dot = true }) {
  const v = variant || statusMap[String(children).toLowerCase()] || 'gray'
  const { bg, color } = variants[v] || variants.gray

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 'var(--radius-pill)',
      fontSize: 11, fontWeight: 500,
      background: bg, color,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', opacity: 0.8 }} />}
      {children}
    </span>
  )
}

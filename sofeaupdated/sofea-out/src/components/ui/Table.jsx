export function Table({ children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }) {
  return <thead>{children}</thead>
}

export function Th({ children, align = 'left' }) {
  return (
    <th style={{
      fontSize: 11, fontWeight: 500, letterSpacing: '0.3px',
      textTransform: 'uppercase', color: 'var(--ink-subtle)',
      padding: '10px 20px', textAlign: align,
      borderBottom: '1px solid var(--hairline)',
    }}>
      {children}
    </th>
  )
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>
}

export function Tr({ children, onClick }) {
  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: '1px solid var(--hairline)', transition: 'background 0.1s', cursor: onClick ? 'pointer' : 'default' }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'var(--surface-2)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </tr>
  )
}

export function Td({ children, mono, muted, align = 'left', style: extra }) {
  return (
    <td style={{
      padding: '12px 20px',
      color: muted ? 'var(--ink-subtle)' : 'var(--ink-muted)',
      fontFamily: mono ? 'var(--mono)' : 'var(--font)',
      fontSize: mono ? 12 : 13,
      textAlign: align,
      verticalAlign: 'middle',
      ...extra,
    }}>
      {children}
    </td>
  )
}

export function TdPrimary({ children }) {
  return (
    <td style={{ padding: '12px 20px', color: 'var(--ink)', fontWeight: 500, fontSize: 13, verticalAlign: 'middle' }}>
      {children}
    </td>
  )
}

export function StatCard({ label, value, delta, deltaType = 'neutral' }) {
  const deltaColor = deltaType === 'up' ? 'var(--success-text)' : deltaType === 'down' ? 'var(--danger-text)' : 'var(--ink-subtle)'

  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase', color: 'var(--ink-subtle)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: 4 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: 12, color: deltaColor, display: 'flex', alignItems: 'center', gap: 3 }}>
          {deltaType === 'up' && <ArrowUp />}
          {deltaType === 'down' && <ArrowDown />}
          {delta}
        </div>
      )}
    </div>
  )
}

function ArrowUp() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 1L8.5 5H6.5v4h-3V5H1.5z"/></svg>
}
function ArrowDown() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 9L1.5 5H3.5V1h3v4h2z"/></svg>
}

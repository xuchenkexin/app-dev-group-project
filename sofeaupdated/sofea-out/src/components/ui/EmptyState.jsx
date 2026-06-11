export function EmptyState({ message = 'No data found.', action }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block' }}>
        <circle cx="16" cy="16" r="12"/><path d="M12 16h8M16 12v8"/>
      </svg>
      <p style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: action ? 14 : 0 }}>{message}</p>
      {action}
    </div>
  )
}

export function LoadingState() {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '2px solid var(--surface-3)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.7s linear infinite',
        margin: '0 auto',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

import { useEffect } from 'react'
import { Button } from './Button'

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-xl)',
        width: 480, maxWidth: '100%',
        animation: 'modalIn 0.15s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.2px' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink-subtle)', padding: 4, borderRadius: 4,
              display: 'flex', lineHeight: 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--hairline)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.97) translateY(4px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  )
}

// ─── Form field components ─────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-subtle)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'var(--surface-2)',
  border: '1px solid var(--hairline-strong)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--ink)',
  fontSize: 13,
  padding: '8px 12px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.1s',
}

export function Input({ type = 'text', placeholder, value, onChange, min, step }) {
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} min={min} step={step}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--primary-focus)'}
      onBlur={e => e.target.style.borderColor = 'var(--hairline-strong)'}
    />
  )
}

export function Select({ value, onChange, children }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
      onFocus={e => e.target.style.borderColor = 'var(--primary-focus)'}
      onBlur={e => e.target.style.borderColor = 'var(--hairline-strong)'}
    >
      {children}
    </select>
  )
}

export function Textarea({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
      onFocus={e => e.target.style.borderColor = 'var(--primary-focus)'}
      onBlur={e => e.target.style.borderColor = 'var(--hairline-strong)'}
    />
  )
}

export function FieldRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>
}

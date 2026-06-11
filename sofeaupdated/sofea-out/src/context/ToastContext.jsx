import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-xl)',
            padding: '11px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, color: 'var(--ink)',
            animation: 'slideUp 0.2s ease',
            minWidth: 240,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: t.type === 'error' ? 'var(--danger-text)' : t.type === 'warning' ? 'var(--warning-text)' : '#27a644',
            }} />
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

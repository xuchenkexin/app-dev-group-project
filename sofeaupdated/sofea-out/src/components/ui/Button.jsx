const variants = {
  primary: {
    background: 'var(--primary)', color: '#fff', border: 'none',
  },
  secondary: {
    background: 'var(--surface-1)', color: 'var(--ink)',
    border: '1px solid var(--hairline)',
  },
  ghost: {
    background: 'transparent', color: 'var(--ink-subtle)', border: 'none',
  },
  danger: {
    background: 'var(--danger-bg)', color: 'var(--danger-text)', border: 'none',
  },
}

export function Button({ children, variant = 'secondary', size = 'md', onClick, type = 'button', disabled, style: extraStyle }) {
  const v = variants[variant] || variants.secondary
  const padding = size === 'sm' ? '5px 10px' : size === 'lg' ? '9px 18px' : '7px 13px'
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 14 : 13

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding, fontSize, fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        ...v,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.1s, opacity 0.1s',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
      onMouseEnter={e => {
        if (disabled) return
        if (variant === 'primary') e.currentTarget.style.background = 'var(--primary-hover)'
        if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-2)'
        if (variant === 'ghost') { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--ink-muted)' }
      }}
      onMouseLeave={e => {
        if (disabled) return
        e.currentTarget.style.background = v.background
        e.currentTarget.style.color = v.color
      }}
    >
      {children}
    </button>
  )
}

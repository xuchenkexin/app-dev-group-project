import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import sofealogo from '../assets/sofea-logo.png'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Input, Field } from '../components/ui/Modal'

const ROLE_CONFIG = {
  sa_advisor: {
    label: 'SA Advisor',
    email: 'ahmad.faris@sofea.edu.my',
  },
  high_committee: {
    label: 'High Committee',
    email: 'hafiz.rahim@sofea.edu.my',
  },
}

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSelectRole = (role) => {
    setSelectedRole(role)
    setEmail(ROLE_CONFIG[role].email)
    setPassword('password123')
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
    setSelectedRole(null)
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--canvas)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <img src={sofealogo} alt="SOFEA" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '2px', color: 'var(--ink)' }}>SOFEA</div>
            <div style={{ fontSize: 11, color: 'var(--ink-subtle)', letterSpacing: '0.3px' }}>Management System</div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 28px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {step === 1 ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--ink)', marginBottom: 4 }}>
                  Sign in
                </h1>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>
                  Select your role to continue
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                  <button
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    style={{
                      flex: 1, padding: '20px 14px', borderRadius: 'var(--radius-xl)', minHeight: 180,
                      border: '1.5px solid var(--hairline)',
                      background: 'var(--canvas)',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'border-color 0.15s, background 0.15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--primary)'
                      e.currentTarget.style.background = 'var(--primary-light)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--hairline)'
                      e.currentTarget.style.background = 'var(--canvas)'
                    }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      {role === 'sa_advisor' ? <IconShield /> : <IconUsers />}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{cfg.label}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <button
                  onClick={handleBack}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, color: 'var(--ink-subtle)',
                    background: 'var(--surface-2)', border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-pill)', padding: '4px 10px 4px 8px',
                    cursor: 'pointer', marginBottom: 16, transition: 'color 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-subtle)'}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7.5 2L3.5 6l4 4"/>
                  </svg>
                  {ROLE_CONFIG[selectedRole].label}
                </button>

                <h1 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--ink)', marginBottom: 4 }}>
                  Sign in
                </h1>
                <p style={{ fontSize: 13, color: 'var(--ink-subtle)' }}>
                  MJIIT Student Organization Portal
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Email">
                  <Input
                    type="email"
                    placeholder="your@graduate.utm.my"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Field>
                <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '9px 14px', marginTop: 4 }}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

            </>
          )}
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--ink-tertiary)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
              transition: 'color 0.15s', padding: '4px 8px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-subtle)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-tertiary)'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 2L3.5 6l4 4"/>
            </svg>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z"/>
      <path d="M7 10l2 2 4-4"/>
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="7" r="3"/>
      <path d="M2 18c0-4 2.7-6 6-6s6 2 6 6"/>
      <path d="M14 4a3 3 0 010 6"/>
      <path d="M18 18c0-3-1.5-5-4-6"/>
    </svg>
  )
}

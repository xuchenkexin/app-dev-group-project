import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import sofealogo from '../assets/sofea-logo.png'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TAGLINE = "The secret whereabouts of all talented developers, late-night grinders, last-minute assignment doers and basically weirdos surviving to make place in the industry where AI's trying to take their jobs. But guess what? We are still standing, we breakthrough every industry interviews, make a quick cash, not settling down for mediocre, live life outside of norm and we touch grass."

const BADGE_COLORS = {
  0: { bg: '#F2E6E6', color: '#9b1c1c', label: 'Urgent' },
  1: { bg: '#E6F0E8', color: '#15803d', label: 'Event' },
  2: { bg: '#F0ECD8', color: '#92620a', label: 'Notice' },
}

export default function HomePage() {
  const navigate = useNavigate()
  const [announcements, setAnnouncements] = useState([])
  const [annLoading, setAnnLoading] = useState(true)

  useEffect(() => {
    api.getAnnouncements()
      .then(d => setAnnouncements(d))
      .catch(() => {})
      .finally(() => setAnnLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', fontFamily: 'var(--font)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,248,242,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={sofealogo} alt="SOFEA" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '2px', color: 'var(--primary)' }}>SOFEA</span>
            <span style={{ fontSize: 10, color: 'var(--ink-subtle)', letterSpacing: '0.3px', marginLeft: 8, textTransform: 'uppercase' }}>SOFEA · MJIIT · UTM</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-subtle)' }}>Committee / Advisor?</span>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '6px 16px', fontSize: 12, fontWeight: 600,
              background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', letterSpacing: '0.3px',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            Login →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '64px 32px 48px',
        borderBottom: '1px solid var(--hairline)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: 52, fontWeight: 700, letterSpacing: '-1px',
          color: 'var(--ink)', lineHeight: 1.15, marginBottom: 16,
        }}>
          Welcome to{' '}
          <span style={{ color: 'var(--primary)' }}>SOFEA</span>
        </h1>

        <p style={{
          fontSize: 16, color: 'var(--ink-subtle)', lineHeight: 1.8,
          maxWidth: 620, marginBottom: 32,
        }}>
          {TAGLINE.split('.')[0] + '.'}
        </p>

        {/* Quote block */}
        <div style={{
          padding: '16px 20px',
          borderLeft: '3px solid #c9a227',
          background: 'rgba(201,162,39,0.06)',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          maxWidth: 640, marginBottom: 36,
        }}>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.75, fontStyle: 'italic' }}>
            "We breakthrough every industry interviews, make a quick cash, not settling down for mediocre, live life outside of norm and we touch grass. That's what <strong>SOFEANs</strong> are."
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { val: announcements.length || '—', label: 'Announcements', icon: '📢', loading: annLoading },
            { val: '50+', label: 'Active members', icon: '👥', loading: false },
          ].map(s => (
            <div key={s.label} style={{
              padding: '12px 20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-1)', border: '1px solid var(--hairline)',
              display: 'flex', alignItems: 'center', gap: 10, minWidth: 160,
            }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                  {s.loading ? '—' : s.val}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Body: Announcements ── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto',
        borderBottom: '1px solid var(--hairline)',
      }}>

        {/* Announcements */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-subtle)' }}>
              Latest Announcements
            </span>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: '#16a34a',
              boxShadow: '0 0 0 3px rgba(22,163,74,0.15)',
            }} title="Live" />
          </div>

          {annLoading ? (
            <div style={{ color: 'var(--ink-tertiary)', fontSize: 13 }}>Loading…</div>
          ) : !announcements.length ? (
            <div style={{ color: 'var(--ink-tertiary)', fontSize: 13 }}>No announcements yet.</div>
          ) : (
            announcements.map((a, i) => {
              const badge = BADGE_COLORS[i % 3]
              return (
                <div key={a.id} style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--hairline)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      background: badge.bg, color: badge.color,
                    }}>{badge.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-tertiary)' }}>{formatDate(a.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-subtle)', lineHeight: 1.6 }}>
                    {a.content.length > 100 ? a.content.slice(0, 100) + '…' : a.content}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </section>

      {/* ── About section ── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '40px 32px',
        borderBottom: '1px solid var(--hairline)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-subtle)', marginBottom: 16 }}>
          About SOFEA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { icon: '⚙️', title: 'Powered by engineers', desc: 'SOF·EA is the software engineering student body under MJIIT, UTM — building, breaking, and surviving together.' },
            { icon: '🌐', title: 'Industry-ready', desc: 'We prepare members for real-world tech roles through workshops, networking, and hands-on project exposure.' },
            { icon: '🌿', title: 'We touch grass', desc: 'Not just keyboards — SOFEA members know how to live outside the screen. Balance is part of the culture.' },
            { icon: '🔑', title: 'Members-only system', desc: 'SOFEA Management System is for committee and advisors to manage activities, finances, and announcements.' },
          ].map(c => (
            <div key={c.title} style={{
              padding: '16px', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--hairline)', background: 'var(--surface-1)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-subtle)', lineHeight: 1.65 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, color: 'var(--ink-tertiary)' }}>
          © 2026 SOFEA · MJIIT UTM
        </span>
        <button
          onClick={() => navigate('/login')}
          style={{
            fontSize: 11, color: 'var(--primary)', background: 'none',
            border: 'none', cursor: 'pointer', fontWeight: 500,
          }}
        >
          Committee / Advisor login →
        </button>
      </footer>
    </div>
  )
}

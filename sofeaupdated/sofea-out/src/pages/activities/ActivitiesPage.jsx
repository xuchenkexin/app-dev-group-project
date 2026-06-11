import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { api } from '../../api'
import { useToast } from '../../context/ToastContext'
import { usePermission } from '../../hooks/usePermission'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardActions } from '../../components/ui/Card'
import { Table, Thead, Th, Tbody, Tr, Td, TdPrimary } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal, Field, Input, Select, Textarea, FieldRow } from '../../components/ui/Modal'
import { LoadingState, EmptyState } from '../../components/ui/EmptyState'

const EMPTY_FORM = { title: '', date: '', venue: '', description: '', max_slots: '', status: 'open' }
const STATUS_OPTIONS = ['open', 'closed', 'cancelled']

function formatDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d)) return String(val).slice(0, 10)
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 3 13 3" />
      <path d="M4 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M2 3l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
      <line x1="7" y1="6" x2="7" y2="10" />
    </svg>
  )
}

const STATUS_COLORS = {
  open:      { bg: 'var(--success-bg)',  color: 'var(--success-text)' },
  closed:    { bg: 'var(--surface-3)',   color: 'var(--ink-subtle)' },
  cancelled: { bg: 'var(--danger-bg)',   color: 'var(--danger-text)' },
}

export default function ActivitiesPage() {
  const { data: fetched, loading, refetch } = useFetch(api.getActivities)
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [checkinCode, setCheckinCode] = useState(null)
  const [checkinExpiry, setCheckinExpiry] = useState(null)
  const [generatingCode, setGeneratingCode] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null) // activityId being updated
  const { toast } = useToast()
  const { can } = usePermission()

  useEffect(() => { if (fetched) setItems(fetched) }, [fetched])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  // ── Create ───────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.title || !form.date || !form.venue) {
      toast('Title, date and venue are required', 'error'); return
    }
    setSaving(true)
    try {
      const created = await api.createActivity({ ...form, max_slots: Number(form.max_slots) || 0 })
      setItems(prev => [created, ...prev])
      toast('Activity created successfully')
      setOpen(false); setForm(EMPTY_FORM)
    } catch { toast('Failed to create activity', 'error') }
    finally { setSaving(false) }
  }

  // ── Delete ───────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await api.deleteActivity(confirmId)
      setItems(prev => prev.filter(a => a.id !== confirmId))
      toast('Activity deleted')
    } catch { toast('Failed to delete activity', 'error') }
    finally {
      setDeleting(false)
      setConfirmId(null)
      setConfirmTitle('')
    }
  }

  // ── Register ────────────────────────────────────────────────
  const handleRegister = async (activity) => {
    if (activity.status !== 'open') {
      toast('This activity is not open for registration', 'error'); return
    }
    try {
      await api.register(activity.id)
      setItems(prev => prev.map(a => a.id === activity.id ? { ...a, registered: (a.registered || 0) + 1 } : a))
      toast(`Registered for "${activity.title}"`)
    } catch (e) {
      const msg = e.response?.data?.message || 'Registration failed'
      toast(msg, 'error')
    }
  }

  // ── Status inline update ─────────────────────────────────────
  const handleStatusChange = async (activity, newStatus) => {
    if (newStatus === activity.status) return
    setUpdatingStatus(activity.id)
    try {
      await api.updateActivity(activity.id, { ...activity, status: newStatus })
      setItems(prev => prev.map(a => a.id === activity.id ? { ...a, status: newStatus } : a))
      toast(`Status updated to "${newStatus}"`)
    } catch { toast('Failed to update status', 'error') }
    finally { setUpdatingStatus(null) }
  }

  // ── Check-in code ────────────────────────────────────────────
  const handleGenerateCode = async (activity) => {
    setSelectedActivity(activity)
    setCheckinCode(null); setCheckinExpiry(null)
    setCheckinOpen(true); setGeneratingCode(true)
    try {
      const res = await api.generateCheckinCode(activity.id)
      setCheckinCode(res.code)
      setCheckinExpiry(new Date(res.expires))
    } catch { toast('Failed to generate code', 'error') }
    finally { setGeneratingCode(false) }
  }

  const formatExpiry = (d) => {
    if (!d) return ''
    return d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })
  }

  const pct = (a) => a.max_slots ? Math.round((a.registered / a.max_slots) * 100) : 0

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Activity Management"
        title="Activities"
        subtitle="Create, manage, and track student organization activities"
        action={can('canCreateActivity') ? <Button variant="primary" onClick={() => setOpen(true)}>+ New Activity</Button> : null}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardActions>
            <Button size="sm" onClick={refetch}>Refresh</Button>
          </CardActions>
        </CardHeader>
        {loading ? <LoadingState /> : !items.length ? (
          <EmptyState message="No activities yet." action={can('canCreateActivity') ? <Button variant="primary" onClick={() => setOpen(true)}>Create first activity</Button> : null} />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Title</Th><Th>Date</Th><Th>Venue</Th><Th>Slots</Th><Th>Fill</Th><Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </Thead>
            <Tbody>
              {items.map(a => (
                <Tr key={a.id}>
                  <TdPrimary>{a.title}</TdPrimary>
                  <Td mono>{formatDate(a.date)}</Td>
                  <Td muted>{a.venue}</Td>
                  <Td>{a.registered} / {a.max_slots || '∞'}</Td>
                  <Td>
                    <div style={{ width: 72, height: 3, background: 'var(--surface-3)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', width: `${pct(a)}%` }} />
                    </div>
                  </Td>

                  {/* Status: SA Advisor gets inline dropdown, others get read-only badge */}
                  <Td>
                    {can('canCreateActivity') ? (
                      <select
                        value={a.status}
                        disabled={updatingStatus === a.id}
                        onChange={e => handleStatusChange(a, e.target.value)}
                        style={{
                          fontSize: 11, fontWeight: 600,
                          padding: '3px 6px',
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid transparent',
                          background: STATUS_COLORS[a.status]?.bg || 'var(--surface-3)',
                          color: STATUS_COLORS[a.status]?.color || 'var(--ink)',
                          cursor: updatingStatus === a.id ? 'wait' : 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          paddingRight: 18,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='currentColor' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 5px center',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge>{a.status}</Badge>
                    )}
                  </Td>

                  {/* Actions column — shared across roles */}
                  <Td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {can('canGenerateCheckinCode') && (
                        <Button size="sm" variant="primary" onClick={() => handleGenerateCode(a)}>
                          Check-in Code
                        </Button>
                      )}
                      {can('canRegisterActivity') && (
                        <Button size="sm" variant="ghost" onClick={() => handleRegister(a)}>
                          Register
                        </Button>
                      )}
                      {can('canCreateActivity') && (
                        <button
                          onClick={() => { setConfirmId(a.id); setConfirmTitle(a.title) }}
                          title="Delete activity"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--hairline)',
                            background: 'transparent', color: 'var(--ink-subtle)',
                            cursor: 'pointer', transition: 'background 0.1s, color 0.1s, border-color 0.1s',
                            flexShrink: 0,
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--danger-bg)'
                            e.currentTarget.style.color = 'var(--danger-text)'
                            e.currentTarget.style.borderColor = 'var(--danger-text)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--ink-subtle)'
                            e.currentTarget.style.borderColor = 'var(--hairline)'
                          }}
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* Confirm delete modal */}
      <Modal
        open={!!confirmId}
        onClose={() => { setConfirmId(null); setConfirmTitle('') }}
        title="Delete Activity"
        footer={<>
          <Button onClick={() => { setConfirmId(null); setConfirmTitle('') }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </>}
      >
        <p style={{ fontSize: 13, color: 'var(--ink-subtle)', lineHeight: 1.6 }}>
          Are you sure you want to delete this activity?
        </p>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginTop: 8 }}>
          "{confirmTitle}"
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 8 }}>
          This will also remove all registrations and attendance records for this activity.
        </p>
      </Modal>

      {/* Create modal */}
      <Modal
        open={open}
        onClose={() => { setOpen(false); setForm(EMPTY_FORM) }}
        title="Create New Activity"
        footer={<>
          <Button onClick={() => { setOpen(false); setForm(EMPTY_FORM) }}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} disabled={saving}>{saving ? 'Creating…' : 'Create Activity'}</Button>
        </>}
      >
        <Field label="Activity Title">
          <Input placeholder="e.g. Tech Expo 2025" value={form.title} onChange={set('title')} />
        </Field>
        <FieldRow>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={set('date')} />
          </Field>
          <Field label="Max Slots (0 = unlimited)">
            <Input type="number" placeholder="50" value={form.max_slots} onChange={set('max_slots')} min="0" />
          </Field>
        </FieldRow>
        <Field label="Venue">
          <Input placeholder="e.g. MJIIT Block A, Room 3" value={form.venue} onChange={set('venue')} />
        </Field>
        <Field label="Description">
          <Textarea placeholder="Activity details…" value={form.description} onChange={set('description')} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={set('status')}>
            <option value="open">open</option>
            <option value="closed">closed</option>
            <option value="cancelled">cancelled</option>
          </Select>
        </Field>
      </Modal>

      {/* Attendance modal */}
      <Modal
        open={attendanceOpen}
        onClose={() => setAttendanceOpen(false)}
        title={`Attendance — ${selectedActivity?.title || ''}`}
        footer={<Button variant="primary" onClick={() => { toast('Attendance saved'); setAttendanceOpen(false) }}>Save Attendance</Button>}
      >
        {selectedActivity && (
          <div style={{ fontSize: 12, color: 'var(--ink-subtle)' }}>
            Mark each participant as present or absent.
          </div>
        )}
      </Modal>

      {/* Check-in Code modal */}
      <Modal
        open={checkinOpen}
        onClose={() => { setCheckinOpen(false); setCheckinCode(null) }}
        title={`Check-in Code — ${selectedActivity?.title || ''}`}
        footer={<Button variant="primary" onClick={() => { setCheckinOpen(false); setCheckinCode(null) }}>Done</Button>}
      >
        {generatingCode ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--ink-subtle)', fontSize: 13 }}>
            Generating code…
          </div>
        ) : checkinCode ? (
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-subtle)', marginBottom: 16 }}>
              Display this on a projector or screen. Participants enter the code on their own device to self check-in.
            </div>
            <div style={{
              textAlign: 'center', padding: '28px 20px',
              background: 'var(--surface-1)', borderRadius: 'var(--radius-xl)',
              border: '2px dashed var(--hairline-strong)', marginBottom: 14,
            }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-subtle)', marginBottom: 10 }}>
                Check-in Code
              </div>
              <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '10px', color: 'var(--primary)', fontFamily: 'var(--mono)' }}>
                {checkinCode}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-tertiary)', marginTop: 12 }}>
                Valid until {formatExpiry(checkinExpiry)} · 30 min window
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', fontSize: 12, color: 'var(--warning-text)' }}>
              ⚠️ Code expires automatically. Click "Done" and regenerate if needed.
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

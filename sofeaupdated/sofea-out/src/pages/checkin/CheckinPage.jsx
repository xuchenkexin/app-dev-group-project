import { useState, useCallback } from 'react'
import { api } from '../../api'
import { usePermission } from '../../hooks/usePermission'
import { useToast } from '../../context/ToastContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardActions } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal, Field, Input } from '../../components/ui/Modal'
import { useFetch } from '../../hooks/useFetch'
import { LoadingState } from '../../components/ui/EmptyState'

function formatDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d)) return String(val).slice(0, 10)
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function CheckinPage() {
  const { role } = usePermission()
  const { toast } = useToast()
  const { data: activities } = useFetch(api.getActivities)
  const isAdvisor = role === 'sa_advisor'

  // ── Self check-in state (High Committee) ─────────────────────
  const [selectedCheckinActivityId, setSelectedCheckinActivityId] = useState('')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // ── Attendance list state (SA Advisor) ────────────────────────
  const [selectedActivityId, setSelectedActivityId] = useState('')
  // Each entry: { registration_id, user_name, user_email, status, attendance_id }
  const [participants, setParticipants] = useState([])
  // Snapshot of last-saved state for change detection: { [registration_id]: { status, attendance_id } }
  const [savedStatuses, setSavedStatuses] = useState({})
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [saving, setSaving] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)

  // ── Manual override modal state ───────────────────────────────
  const [overrideActivityId, setOverrideActivityId] = useState('')
  const [overrideName, setOverrideName] = useState('')
  const [overrideStatus, setOverrideStatus] = useState(null)   // 'present' | 'absent'
  const [overrideSaving, setOverrideSaving] = useState(false)

  // Load registrations + existing attendance for a selected activity
  const handleActivityChange = useCallback(async (activityId) => {
    setSelectedActivityId(activityId)
    setParticipants([])
    setSavedStatuses({})
    if (!activityId) return

    setLoadingParticipants(true)
    try {
      const [regs, attRecords] = await Promise.all([
        api.getRegistrations(activityId),
        api.getAttendance(activityId),
      ])

      // Build attendance map: registration_id → attendance record
      const attMap = {}
      for (const rec of (attRecords || [])) {
        attMap[rec.registration_id] = rec
      }

      const merged = (regs || []).map(r => ({
        registration_id: r.registration_id,
        user_name:  r.user_name,
        user_email: r.user_email,
        status:      attMap[r.registration_id]?.status      ?? null,
        attendance_id: attMap[r.registration_id]?.attendance_id ?? null,
      }))

      setParticipants(merged)

      // Snapshot for change detection on save
      const snap = {}
      for (const p of merged) {
        snap[p.registration_id] = { status: p.status, attendance_id: p.attendance_id }
      }
      setSavedStatuses(snap)
    } catch {
      toast('Failed to load participants', 'error')
    } finally {
      setLoadingParticipants(false)
    }
  }, [toast])

  // Toggle present/absent in local state only — save on button click
  const toggleStatus = (registrationId, newStatus) => {
    setParticipants(prev => prev.map(p =>
      p.registration_id === registrationId ? { ...p, status: newStatus } : p
    ))
  }

  // Batch-save all changes
  const handleSaveAttendance = async () => {
    if (!selectedActivityId) return
    setSaving(true)
    let saved = 0
    let failed = 0
    const updatedSnap = { ...savedStatuses }

    for (const p of participants) {
      if (p.status === null) continue // skip still-unmarked
      const orig = savedStatuses[p.registration_id]
      if (p.status === orig?.status) continue // unchanged

      try {
        if (orig?.attendance_id) {
          // Update existing record
          await api.updateAttendance(orig.attendance_id, p.status)
          updatedSnap[p.registration_id] = { ...orig, status: p.status }
        } else {
          // Create new record
          const rec = await api.markAttendance(p.registration_id, p.status)
          const newId = rec?.attendance_id ?? rec?.id ?? null
          updatedSnap[p.registration_id] = { status: p.status, attendance_id: newId }
          // Persist attendance_id so future saves use PUT
          setParticipants(prev => prev.map(x =>
            x.registration_id === p.registration_id ? { ...x, attendance_id: newId } : x
          ))
        }
        saved++
      } catch {
        failed++
      }
    }

    setSavedStatuses(updatedSnap)
    setSaving(false)

    if (failed > 0) {
      toast(`Saved ${saved}, failed ${failed}. Please try again.`, 'error')
    } else if (saved === 0) {
      toast('No changes to save')
    } else {
      toast(`Attendance saved for ${saved} participant${saved !== 1 ? 's' : ''}`)
    }
  }

  const openOverrideModal = () => {
    setOverrideActivityId(selectedActivityId || '')
    setOverrideName('')
    setOverrideStatus(null)
    setManualOpen(true)
  }

  const closeOverrideModal = () => {
    setManualOpen(false)
    setOverrideActivityId('')
    setOverrideName('')
    setOverrideStatus(null)
  }

  const handleSaveOverride = async () => {
    if (!overrideActivityId) { toast('Please select an activity', 'error'); return }
    if (!overrideName.trim()) { toast('Please enter a student name or email', 'error'); return }
    if (!overrideStatus) { toast('Please select Present or Absent', 'error'); return }

    setOverrideSaving(true)
    try {
      // Fetch registrations for the selected activity and find matching person
      const regs = await api.getRegistrations(overrideActivityId)
      const q = overrideName.trim().toLowerCase()
      const match = regs.find(r =>
        r.user_name?.toLowerCase().includes(q) ||
        r.user_email?.toLowerCase().includes(q)
      )
      if (!match) {
        toast('No registration found for this person in the selected activity', 'error')
        return
      }

      // Try POST; if 409 (already marked) fetch the existing record and PUT
      try {
        await api.markAttendance(match.registration_id, overrideStatus)
      } catch (e) {
        if (e.response?.status === 409) {
          const attRecords = await api.getAttendance(overrideActivityId)
          const existing = attRecords.find(r => r.registration_id === match.registration_id)
          if (existing?.attendance_id) {
            await api.updateAttendance(existing.attendance_id, overrideStatus)
          } else {
            throw new Error('Could not locate existing attendance record')
          }
        } else {
          throw e
        }
      }

      toast(`Attendance overridden: ${match.user_name} → ${overrideStatus}`)
      closeOverrideModal()

      // Refresh the attendance list if we're viewing the same activity
      if (selectedActivityId === overrideActivityId) {
        handleActivityChange(selectedActivityId)
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to save override'
      toast(msg, 'error')
    } finally {
      setOverrideSaving(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!selectedCheckinActivityId) { toast('Please select an activity first', 'error'); return }
    if (code.trim().length < 4) { toast('Enter a valid check-in code', 'error'); return }
    setSubmitting(true)
    try {
      await api.submitCheckin(code.trim(), selectedCheckinActivityId)
      setSuccess(true)
      toast('Checked in successfully')
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Invalid or expired code'
      toast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const counts = {
    present: participants.filter(p => p.status === 'present').length,
    absent:  participants.filter(p => p.status === 'absent').length,
    unmarked: participants.filter(p => !p.status).length,
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Attendance"
        title="Check-in"
        subtitle="Self check-in with code, or manage attendance manually"
      />

      <div>

        {/* ── Self Check-in: High Committee only ── */}
        {!isAdvisor && (
          <Card>
            <CardHeader>
              <CardTitle>Self Check-in</CardTitle>
            </CardHeader>
            <div style={{ padding: '20px' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--success-bg)', margin: '0 auto 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>✓</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Checked in successfully!
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-subtle)', marginBottom: 20 }}>
                    Your attendance has been recorded.
                  </div>
                  <Button onClick={() => { setSuccess(false); setCode(''); setSelectedCheckinActivityId('') }}>Check in to another</Button>
                </div>
              ) : (
                <>
                  {/* Activity selector */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-subtle)', marginBottom: 6 }}>
                      Activity
                    </div>
                    <select
                      value={selectedCheckinActivityId}
                      onChange={e => setSelectedCheckinActivityId(e.target.value)}
                      style={{
                        width: '100%', fontSize: 13, padding: '8px 10px', boxSizing: 'border-box',
                        background: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--ink)',
                      }}
                    >
                      <option value="">— Select an activity —</option>
                      {(activities || []).filter(a => a.status === 'open').map(a => (
                        <option key={a.id} value={a.id}>
                          {a.title} · {formatDate(a.date)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--ink-subtle)', lineHeight: 1.65, marginBottom: 18 }}>
                    Enter the 6-character code displayed by your committee on screen.
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <input
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. AK7X2Q"
                      maxLength={8}
                      onKeyDown={e => e.key === 'Enter' && handleSubmitCode()}
                      style={{
                        width: '100%', textAlign: 'center', boxSizing: 'border-box',
                        fontSize: 28, fontWeight: 700, letterSpacing: '8px',
                        fontFamily: 'var(--mono)',
                        padding: '14px 16px',
                        background: 'var(--surface-2)', color: 'var(--ink)',
                        border: '1.5px solid var(--hairline-strong)',
                        borderRadius: 'var(--radius-lg)',
                        outline: 'none', textTransform: 'uppercase',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary-focus)'}
                      onBlur={e => e.target.style.borderColor = 'var(--hairline-strong)'}
                    />
                  </div>
                  <Button
                    variant="primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleSubmitCode}
                    disabled={submitting}
                  >
                    {submitting ? 'Verifying…' : 'Submit Check-in'}
                  </Button>
                  <div style={{ fontSize: 11, color: 'var(--ink-tertiary)', textAlign: 'center', marginTop: 10 }}>
                    Code is case-insensitive · Valid for 30 minutes
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* ── Attendance List: SA Advisor only ── */}
        {isAdvisor && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance List</CardTitle>
              <CardActions>
                <Button size="sm" onClick={openOverrideModal}>Manual override</Button>
              </CardActions>
            </CardHeader>

            {/* Activity selector */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--hairline)' }}>
              <select
                value={selectedActivityId}
                onChange={e => handleActivityChange(e.target.value)}
                style={{
                  fontSize: 12, padding: '6px 10px', width: '100%',
                  background: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--ink)',
                }}
              >
                <option value="">— Select an activity —</option>
                {(activities || []).map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} · {formatDate(a.date)}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary pills — only when activity selected */}
            {selectedActivityId && !loadingParticipants && (
              <div style={{ padding: '10px 20px', display: 'flex', gap: 8, borderBottom: '1px solid var(--hairline)' }}>
                {[
                  { label: 'Present', count: counts.present,  bg: 'var(--success-bg)', color: 'var(--success-text)' },
                  { label: 'Absent',  count: counts.absent,   bg: 'var(--danger-bg)',  color: 'var(--danger-text)'  },
                  { label: 'Pending', count: counts.unmarked, bg: 'var(--surface-3)',  color: 'var(--ink-subtle)'   },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                    background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
                  }}>
                    {s.label} · {s.count}
                  </div>
                ))}
              </div>
            )}

            {/* Participant rows */}
            {loadingParticipants ? (
              <LoadingState />
            ) : !selectedActivityId ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-tertiary)' }}>
                Select an activity above to view its participants
              </div>
            ) : !participants.length ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: 13, color: 'var(--ink-tertiary)' }}>
                No registrations found for this activity
              </div>
            ) : (
              <div>
                {participants.map(p => (
                  <div key={p.registration_id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 20px', borderBottom: '1px solid var(--hairline)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--surface-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, color: 'var(--ink-subtle)',
                    }}>
                      {(p.user_name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.user_name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-subtle)', fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.user_email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                      {['present', 'absent'].map(s => (
                        <button
                          key={s}
                          onClick={() => toggleStatus(p.registration_id, s)}
                          style={{
                            padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                            fontSize: 11, fontWeight: 500, border: 'none', cursor: 'pointer',
                            background: p.status === s
                              ? (s === 'present' ? 'var(--success-bg)' : 'var(--danger-bg)')
                              : 'var(--surface-3)',
                            color: p.status === s
                              ? (s === 'present' ? 'var(--success-text)' : 'var(--danger-text)')
                              : 'var(--ink-tertiary)',
                            transition: 'background 0.1s',
                          }}
                        >
                          {s === 'present' ? '✓' : '✗'} {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save button — only when activity selected */}
            {selectedActivityId && (
              <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)' }}>
                <Button variant="primary" onClick={handleSaveAttendance} disabled={saving || loadingParticipants}>
                  {saving ? 'Saving…' : 'Save Attendance'}
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Manual override modal */}
      <Modal
        open={manualOpen}
        onClose={closeOverrideModal}
        title="Manual Attendance Override"
        footer={
          <>
            <Button onClick={closeOverrideModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveOverride} disabled={overrideSaving}>
              {overrideSaving ? 'Saving…' : 'Save Override'}
            </Button>
          </>
        }
      >
        <div style={{ fontSize: 12, color: 'var(--ink-subtle)', marginBottom: 14 }}>
          Manually correct check-in records, e.g. if a participant had trouble entering the code.
        </div>

        {/* Activity selector */}
        <Field label="Activity">
          <select
            value={overrideActivityId}
            onChange={e => setOverrideActivityId(e.target.value)}
            style={{
              width: '100%', fontSize: 13, padding: '7px 10px', boxSizing: 'border-box',
              background: 'var(--surface-2)', border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)', color: overrideActivityId ? 'var(--ink)' : 'var(--ink-tertiary)',
            }}
          >
            <option value="">— Select an activity —</option>
            {(activities || []).map(a => (
              <option key={a.id} value={a.id}>{a.title} · {formatDate(a.date)}</option>
            ))}
          </select>
        </Field>

        <Field label="Student Name / Email">
          <Input
            value={overrideName}
            onChange={e => setOverrideName(e.target.value)}
            placeholder="e.g. Ahmad Faris or ahmad@example.com"
          />
        </Field>

        <Field label="Override Status">
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { val: 'present', label: '✓ Present', activeBg: 'var(--success-bg)', activeColor: 'var(--success-text)', activeBorder: 'var(--success-text)' },
              { val: 'absent',  label: '✗ Absent',  activeBg: 'var(--danger-bg)',  activeColor: 'var(--danger-text)',  activeBorder: 'var(--danger-text)'  },
            ].map(({ val, label, activeBg, activeColor, activeBorder }) => (
              <button
                key={val}
                onClick={() => setOverrideStatus(val)}
                style={{
                  flex: 1, padding: '8px', borderRadius: 'var(--radius-md)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `1.5px solid ${overrideStatus === val ? activeBorder : 'var(--hairline-strong)'}`,
                  background: overrideStatus === val ? activeBg : 'var(--surface-2)',
                  color: overrideStatus === val ? activeColor : 'var(--ink-subtle)',
                  transition: 'background 0.1s, color 0.1s, border-color 0.1s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
      </Modal>
    </div>
  )
}

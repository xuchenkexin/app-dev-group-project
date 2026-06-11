import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { api } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { usePermission } from '../../hooks/usePermission'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardActions } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal, Field, Input, Select, Textarea } from '../../components/ui/Modal'
import { LoadingState, EmptyState } from '../../components/ui/EmptyState'

const EMPTY = { title: '', content: '', audience: 'All Members' }

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 3 13 3" />
      <path d="M4 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M2 3l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" />
      <line x1="7" y1="6" x2="7" y2="10" />
      <line x1="5" y1="6" x2="5.2" y2="10" />
      <line x1="9" y1="6" x2="8.8" y2="10" />
    </svg>
  )
}

export default function AnnouncementsPage() {
  const { data: fetched, loading, refetch } = useFetch(api.getAnnouncements)
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { can } = usePermission()
  const { user } = useAuth()

  useEffect(() => {
    if (fetched) setItems(fetched)
  }, [fetched])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const canDelete = (a) => {
    if (!user) return false
    if (user.role === 'sa_advisor') return true
    return a.created_by === user.id
  }

  const handleDeleteClick = (a) => {
    setConfirmId(a.id)
    setConfirmTitle(a.title)
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await api.deleteAnnouncement(confirmId)
      setItems(prev => prev.filter(a => a.id !== confirmId))
      toast('Announcement deleted')
    } catch {
      toast('Failed to delete announcement', 'error')
    } finally {
      setDeleting(false)
      setConfirmId(null)
      setConfirmTitle('')
    }
  }

  const handlePublish = async () => {
    if (!form.title || !form.content) {
      toast('Title and content are required', 'error'); return
    }
    setSaving(true)
    try {
      const created = await api.createAnnouncement(form)
      setItems(prev => [created, ...prev])
      toast('Announcement published')
      setOpen(false); setForm(EMPTY)
    } catch { toast('Failed to publish', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Announcement Module"
        title="Announcements"
        subtitle="Publish and notify members about organization updates"
        action={can('canCreateAnnouncement') ? <Button variant="primary" onClick={() => setOpen(true)}>+ New Announcement</Button> : null}
      />

      <Card>
        <CardHeader>
          <CardTitle>Published Announcements</CardTitle>
          <CardActions>
            <Button size="sm" onClick={refetch}>Refresh</Button>
          </CardActions>
        </CardHeader>
        {loading ? <LoadingState /> : !items.length ? (
          <EmptyState message="No announcements yet." action={can('canCreateAnnouncement') ? <Button variant="primary" onClick={() => setOpen(true)}>Create first announcement</Button> : null} />
        ) : (
          items.map(a => (
            <div key={a.id} style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--hairline)',
              display: 'flex', gap: 14, alignItems: 'flex-start',
              transition: 'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color || 'var(--primary)', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 5 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-subtle)', lineHeight: 1.6, marginBottom: 8 }}>{a.content}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-tertiary)', fontFamily: 'var(--mono)' }}>
                    {formatTime(a.created_at)}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)', background: 'var(--surface-3)', color: 'var(--ink-subtle)',
                  }}>
                    {a.audience}
                  </span>
                </div>
              </div>

              {canDelete(a) && (
                <button
                  onClick={() => handleDeleteClick(a)}
                  title="Delete announcement"
                  style={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--hairline)',
                    background: 'transparent', color: 'var(--ink-subtle)',
                    cursor: 'pointer', transition: 'background 0.1s, color 0.1s, border-color 0.1s',
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
          ))
        )}
      </Card>

      {/* Confirm delete modal */}
      <Modal
        open={!!confirmId}
        onClose={() => { setConfirmId(null); setConfirmTitle('') }}
        title="Delete Announcement"
        footer={<>
          <Button onClick={() => { setConfirmId(null); setConfirmTitle('') }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </>}
      >
        <p style={{ fontSize: 13, color: 'var(--ink-subtle)', lineHeight: 1.6 }}>
          Are you sure you want to delete this announcement?
        </p>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginTop: 8 }}>
          "{confirmTitle}"
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 8 }}>
          This action cannot be undone.
        </p>
      </Modal>

      {/* Publish modal */}
      <Modal
        open={open}
        onClose={() => { setOpen(false); setForm(EMPTY) }}
        title="New Announcement"
        footer={<>
          <Button onClick={() => { setOpen(false); setForm(EMPTY) }}>Cancel</Button>
          <Button variant="primary" onClick={handlePublish} disabled={saving}>{saving ? 'Publishing…' : 'Publish'}</Button>
        </>}
      >
        <Field label="Title">
          <Input placeholder="Announcement title" value={form.title} onChange={set('title')} />
        </Field>
        <Field label="Content">
          <Textarea placeholder="Write announcement content…" value={form.content} onChange={set('content')} rows={5} />
        </Field>
        <Field label="Target Audience">
          <Select value={form.audience} onChange={set('audience')}>
            <option>All Members</option>
            <option>High Committee</option>
            <option>SA Advisor</option>
          </Select>
        </Field>
      </Modal>
    </div>
  )
}

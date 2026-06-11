import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { api } from '../../api'
import { useToast } from '../../context/ToastContext'
import { usePermission } from '../../hooks/usePermission'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardActions } from '../../components/ui/Card'
import { Table, Thead, Th, Tbody, Tr, Td, TdPrimary } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal, Field, Input, Select, Textarea, FieldRow } from '../../components/ui/Modal'
import { LoadingState, EmptyState } from '../../components/ui/EmptyState'

const EMPTY = { type: 'income', category: '', description: '', amount: '', date: '' }

function formatDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
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

export default function FinancePage() {
  const { data: fetched, loading, refetch } = useFetch(api.getTransactions)
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [confirmId, setConfirmId] = useState(null)
  const [confirmDesc, setConfirmDesc] = useState('')
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const { can } = usePermission()

  useEffect(() => { if (fetched) setItems(fetched) }, [fetched])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  // Derived totals always reflect current items
  const income  = items.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0)
  const expense = items.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - expense

  const filtered = items.filter(t => filter === 'all' ? true : t.type === filter)

  const txId = (t) => t.transaction_id ?? t.id

  const handleSave = async () => {
    if (!form.category || !form.amount || !form.date) {
      toast('Category, amount and date are required', 'error'); return
    }
    setSaving(true)
    try {
      await api.createTransaction({ ...form, amount: parseFloat(form.amount) })
      toast('Transaction recorded')
      setOpen(false); setForm(EMPTY); refetch()
    } catch { toast('Failed to save transaction', 'error') }
    finally { setSaving(false) }
  }

  const handleDeleteConfirm = async () => {
    setDeleting(true)
    try {
      await api.deleteTransaction(confirmId)
      setItems(prev => prev.filter(t => txId(t) !== confirmId))
      toast('Transaction deleted')
    } catch {
      toast('Failed to delete transaction', 'error')
    } finally {
      setDeleting(false)
      setConfirmId(null)
      setConfirmDesc('')
    }
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Financial Management"
        title="Finance"
        subtitle="Track income, expenses, and manage the organization budget"
        action={can('canRecordTransaction') ? <Button variant="primary" onClick={() => setOpen(true)}>+ Record Transaction</Button> : null}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Income"   value={loading ? '—' : `RM ${income.toLocaleString()}`}   deltaType="up"   delta="This semester" />
        <StatCard label="Total Expenses" value={loading ? '—' : `RM ${expense.toLocaleString()}`}  deltaType="down" delta="This semester" />
        <StatCard label="Net Balance"    value={loading ? '—' : `RM ${balance.toLocaleString()}`}  delta="Available" />
        <StatCard label="Transactions"   value={loading ? '—' : items.length}                       delta="Total records" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardActions>
            {['all','income','expense'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 12px', borderRadius: 'var(--radius-pill)', fontSize: 12,
                fontWeight: 500, border: 'none', cursor: 'pointer',
                background: filter === f ? 'var(--surface-3)' : 'transparent',
                color: filter === f ? 'var(--ink)' : 'var(--ink-subtle)',
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </CardActions>
        </CardHeader>
        {loading ? <LoadingState /> : !filtered.length ? (
          <EmptyState message="No transactions found." />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Date</Th><Th>Category</Th><Th>Description</Th><Th>Type</Th>
                <Th align="right">Amount</Th><Th></Th>
              </tr>
            </Thead>
            <Tbody>
              {filtered.map((t, i) => (
                <Tr key={txId(t) ?? i}>
                  <Td mono>{formatDate(t.date)}</Td>
                  <TdPrimary>{t.category}</TdPrimary>
                  <Td muted>{t.description}</Td>
                  <Td><Badge>{t.type}</Badge></Td>
                  <Td align="right" style={{
                    fontFamily: 'var(--mono)',
                    color: t.type === 'income' ? 'var(--success-text)' : 'var(--danger-text)',
                    fontWeight: 500,
                  }}>
                    {t.type === 'income' ? '+' : '-'}RM {Number(t.amount).toLocaleString()}
                  </Td>
                  <Td>
                    <button
                      onClick={() => { setConfirmId(txId(t)); setConfirmDesc(`${t.category}${t.description ? ' — ' + t.description : ''}`) }}
                      title="Delete transaction"
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
        onClose={() => { setConfirmId(null); setConfirmDesc('') }}
        title="Delete Transaction"
        footer={<>
          <Button onClick={() => { setConfirmId(null); setConfirmDesc('') }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </>}
      >
        <p style={{ fontSize: 13, color: 'var(--ink-subtle)', lineHeight: 1.6 }}>
          Are you sure you want to delete this transaction?
        </p>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginTop: 8 }}>
          "{confirmDesc}"
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 8 }}>
          This action cannot be undone. The totals will update automatically.
        </p>
      </Modal>

      {/* Create modal */}
      <Modal
        open={open}
        onClose={() => { setOpen(false); setForm(EMPTY) }}
        title="Record Transaction"
        footer={<>
          <Button onClick={() => { setOpen(false); setForm(EMPTY) }}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </>}
      >
        <Field label="Type">
          <Select value={form.type} onChange={set('type')}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </Field>
        <Field label="Category">
          <Input placeholder="e.g. Sponsorship, Logistics, Catering" value={form.category} onChange={set('category')} />
        </Field>
        <FieldRow>
          <Field label="Amount (RM)">
            <Input type="number" placeholder="0.00" value={form.amount} onChange={set('amount')} min="0" step="0.01" />
          </Field>
          <Field label="Date">
            <Input type="date" value={form.date} onChange={set('date')} />
          </Field>
        </FieldRow>
        <Field label="Description">
          <Textarea placeholder="Transaction details…" value={form.description} onChange={set('description')} rows={3} />
        </Field>
      </Modal>
    </div>
  )
}

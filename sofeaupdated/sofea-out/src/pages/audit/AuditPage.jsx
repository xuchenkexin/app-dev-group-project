import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { api } from '../../api'
import { useToast } from '../../context/ToastContext'
import { usePermission } from '../../hooks/usePermission'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardActions } from '../../components/ui/Card'
import { Table, Thead, Th, Tbody, Tr, Td, TdPrimary } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Modal'
import { LoadingState } from '../../components/ui/EmptyState'

const todayStr = () => new Date().toISOString().split('T')[0]

// ── CSV export ────────────────────────────────────────────────
function exportCSV(report, from, to) {
  const fmtDate = (v) => {
    if (!v) return ''
    const d = new Date(v)
    return isNaN(d) ? String(v).slice(0, 10)
      : [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
  }

  const txRows = report.transactions.map(t => [
    fmtDate(t.date),
    t.category ?? '',
    `"${(t.description ?? '').replace(/"/g, '""')}"`,
    t.type,
    Number(t.amount).toFixed(2),
  ])

  const csv = [
    [`SOFEA Financial Audit Report`],
    [`Period: ${from} to ${to}`],
    [`Generated: ${todayStr()}`],
    [],
    ['SUMMARY'],
    ['Total Income',   `RM ${Number(report.income).toFixed(2)}`],
    ['Total Expenses', `RM ${Number(report.expense).toFixed(2)}`],
    ['Net Balance',    `RM ${Number(report.balance).toFixed(2)}`],
    [],
    ['TRANSACTIONS'],
    ['Date', 'Category', 'Description', 'Type', 'Amount (RM)'],
    ...txRows,
  ].map(r => r.join(',')).join('\r\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `sofea-report-${todayStr()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── PDF export ────────────────────────────────────────────────
function exportPDF(report, from, to, byCategory) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  let y = 18

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('SOFEA Financial Audit Report', W / 2, y, { align: 'center' })
  y += 7

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`Period: ${from}  to  ${to}`, W / 2, y, { align: 'center' })
  doc.text(`Generated: ${todayStr()}`, W / 2, y + 5, { align: 'center' })
  doc.setTextColor(0)
  y += 16

  // Summary boxes
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('SUMMARY', 14, y)
  y += 5

  const summaryData = [
    ['Total Income',   `RM ${Number(report.income).toLocaleString()}`],
    ['Total Expenses', `RM ${Number(report.expense).toLocaleString()}`],
    ['Net Balance',    `RM ${Number(report.balance).toLocaleString()}`],
  ]

  autoTable(doc, {
    startY: y,
    head: [['', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles:  { fillColor: [40, 40, 40], fontSize: 8 },
    bodyStyles:  { fontSize: 9 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 40 } },
    margin: { left: 14 },
    tableWidth: 90,
    didParseCell: (data) => {
      if (data.section === 'body') {
        if (data.row.index === 0) data.cell.styles.textColor = [21, 128, 61]
        if (data.row.index === 1) data.cell.styles.textColor = [185, 28, 28]
      }
    },
  })
  y = doc.lastAutoTable.finalY + 10

  // By Category
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('BY CATEGORY', 14, y)
  y += 5

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Income (RM)', 'Expenses (RM)']],
    body: Object.entries(byCategory).map(([cat, vals]) => [
      cat,
      vals.income  ? Number(vals.income).toLocaleString()  : '—',
      vals.expense ? Number(vals.expense).toLocaleString() : '—',
    ]),
    theme: 'striped',
    headStyles: { fillColor: [40, 40, 40], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 14 },
  })
  y = doc.lastAutoTable.finalY + 10

  // All Transactions
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('ALL TRANSACTIONS', 14, y)
  y += 5

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Category', 'Description', 'Type', 'Amount (RM)']],
    body: report.transactions.map(t => [
      t.date,
      t.category ?? '',
      t.description ?? '',
      t.type,
      (t.type === 'income' ? '+' : '-') + Number(t.amount).toLocaleString(),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [40, 40, 40], fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 28 },
      4: { halign: 'right', cellWidth: 28 },
    },
    margin: { left: 14 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        data.cell.styles.textColor = data.row.raw[3] === 'income'
          ? [21, 128, 61]
          : [185, 28, 28]
      }
    },
  })

  doc.save(`sofea-report-${todayStr()}.pdf`)
}

// ─────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [from, setFrom] = useState('2025-01-01')
  const [to, setTo]     = useState('2025-05-31')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { can } = usePermission()

  const generate = async () => {
    if (!from || !to) { toast('Select a date range', 'error'); return }
    setLoading(true)
    try {
      const r = await api.getAuditReport({ from, to })
      setReport(r)
      toast('Report generated')
    } catch { toast('Failed to generate report', 'error') }
    finally { setLoading(false) }
  }

  const byCategory = report?.transactions.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || { income: 0, expense: 0 }
    acc[t.category][t.type] += Number(t.amount)
    return acc
  }, {})

  const handleCSV = () => {
    exportCSV(report, from, to)
    toast('CSV downloaded')
  }

  const handlePDF = () => {
    exportPDF(report, from, to, byCategory)
    toast('PDF downloaded')
  }

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Admin"
        title="Audit Report"
        subtitle="Generate and export financial audit summaries for any date range"
      />

      {/* Date range selector */}
      <Card style={{ marginBottom: 16 }}>
        <CardHeader><CardTitle>Generate Report</CardTitle></CardHeader>
        <div style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Field label="From"><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="To"><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></Field>
          </div>
          <Button variant="primary" onClick={generate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </div>
      </Card>

      {loading && <LoadingState />}

      {report && !loading && (
        <>
          {/* Summary */}
          <Card style={{ marginBottom: 16 }}>
            <CardHeader>
              <CardTitle>Summary — {from} to {to}</CardTitle>
              <CardActions>
                {can('canExportAudit') && (
                  <Button size="sm" onClick={handlePDF}>Export PDF</Button>
                )}
                {can('canExportAudit') && (
                  <Button size="sm" onClick={handleCSV}>Export CSV</Button>
                )}
              </CardActions>
            </CardHeader>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
              {[
                { label: 'Total Income',   val: `RM ${Number(report.income).toLocaleString()}`,   color: 'var(--success-text)', border: true },
                { label: 'Total Expenses', val: `RM ${Number(report.expense).toLocaleString()}`,  color: 'var(--danger-text)',  border: true },
                { label: 'Net Balance',    val: `RM ${Number(report.balance).toLocaleString()}`,  color: 'var(--ink)',          border: false },
              ].map(item => (
                <div key={item.label} style={{
                  textAlign: 'center', padding: '8px 20px',
                  borderRight: item.border ? '1px solid var(--hairline)' : 'none',
                }}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--ink-subtle)', marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 600, color: item.color, letterSpacing: '-1px' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* By category */}
          <Card style={{ marginBottom: 16 }}>
            <CardHeader><CardTitle>By Category</CardTitle></CardHeader>
            <Table>
              <Thead><tr><Th>Category</Th><Th align="right">Income</Th><Th align="right">Expenses</Th></tr></Thead>
              <Tbody>
                {Object.entries(byCategory).map(([cat, vals]) => (
                  <Tr key={cat}>
                    <TdPrimary>{cat}</TdPrimary>
                    <Td align="right" style={{ fontFamily: 'var(--mono)', color: vals.income ? 'var(--success-text)' : 'var(--ink-tertiary)' }}>
                      {vals.income ? `RM ${Number(vals.income).toLocaleString()}` : '—'}
                    </Td>
                    <Td align="right" style={{ fontFamily: 'var(--mono)', color: vals.expense ? 'var(--danger-text)' : 'var(--ink-tertiary)' }}>
                      {vals.expense ? `RM ${Number(vals.expense).toLocaleString()}` : '—'}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>

          {/* Transaction list */}
          <Card>
            <CardHeader><CardTitle>All Transactions in Period</CardTitle></CardHeader>
            <Table>
              <Thead><tr><Th>Date</Th><Th>Category</Th><Th>Description</Th><Th>Type</Th><Th align="right">Amount</Th></tr></Thead>
              <Tbody>
                {report.transactions.map((t, i) => (
                  <Tr key={t.transaction_id ?? t.id ?? i}>
                    <Td mono>{t.date}</Td>
                    <TdPrimary>{t.category}</TdPrimary>
                    <Td muted>{t.description}</Td>
                    <Td><Badge>{t.type}</Badge></Td>
                    <Td align="right" style={{ fontFamily: 'var(--mono)', color: t.type === 'income' ? 'var(--success-text)' : 'var(--danger-text)', fontWeight: 500 }}>
                      {t.type === 'income' ? '+' : '-'}RM {Number(t.amount).toLocaleString()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}

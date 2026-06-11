import { useFetch } from '../hooks/useFetch'
import { api } from '../api'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardActions } from '../components/ui/Card'
import { Table, Thead, Th, Tbody, Tr, Td, TdPrimary } from '../components/ui/Table'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { data: stats,   loading: sLoading } = useFetch(api.getDashboardStats)
  const { data: summary, loading: fLoading } = useFetch(api.getTransactionSummary)
  const navigate = useNavigate()

  const income  = Number(summary?.total_income)  || 0
  const expense = Number(summary?.total_expense) || 0
  const balance = Number(summary?.net_balance)   || 0

  const months  = ['Jan','Feb','Mar','Apr','May','Jun']
  const barData = [55, 70, 40, 88, 62, 30]

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="Organization management"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard
          label="Total Activities"
          value={sLoading ? '—' : stats?.total_activities ?? 0}
          delta="+2 this month" deltaType="up"
        />
        <StatCard
          label="Open Activities"
          value={sLoading ? '—' : stats?.active_activities ?? 0}
          delta="Available now"
        />
        <StatCard
          label="Balance (RM)"
          value={fLoading ? '—' : balance.toLocaleString()}
          delta={`–RM ${expense.toLocaleString()} spent`} deltaType="down"
        />
        <StatCard
          label="Unread Notifications"
          value={sLoading ? '—' : stats?.unread_notifications ?? 0}
          delta="In your inbox"
        />
      </div>

      {/* Two col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Upcoming activities */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardActions>
              <Button size="sm" onClick={() => navigate('/activities')}>View all</Button>
            </CardActions>
          </CardHeader>
          {sLoading ? <LoadingState /> : (
            <>
              {(stats?.recent_activities || []).slice(0, 3).map(a => (
                <div key={a.id} style={{
                  padding: '13px 20px', borderBottom: '1px solid var(--hairline)',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                  onClick={() => navigate('/activities')}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-subtle)' }}>{a.venue} · {a.date}</div>
                    <div style={{ height: 3, background: 'var(--surface-3)', borderRadius: 9999, marginTop: 7, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 9999, width: `${Math.round((a.registered / (a.max_slots || 1)) * 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Badge>{a.status}</Badge>
                    <div style={{ fontSize: 11, color: 'var(--ink-tertiary)', marginTop: 4 }}>{a.registered}/{a.max_slots || '∞'} slots</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </Card>

        {/* Finance summary */}
        <Card>
          <CardHeader>
            <CardTitle>Finance Summary</CardTitle>
            <CardActions>
              <Button size="sm" onClick={() => navigate('/finance')}>View all</Button>
            </CardActions>
          </CardHeader>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 20px 14px' }}>
            {months.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', borderRadius: '3px 3px 0 0', minHeight: 4, background: i === 5 ? 'var(--primary-light)' : 'var(--primary)', height: `${barData[i]}%` }} />
                <div style={{ fontSize: 10, color: 'var(--ink-tertiary)', fontFamily: 'var(--mono)' }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 20px 18px', display: 'flex', gap: 20 }}>
            {[
              { label: 'Income',   val: `RM ${income.toLocaleString()}`,   color: 'var(--success-text)' },
              { label: 'Expenses', val: `RM ${expense.toLocaleString()}`,  color: 'var(--danger-text)'  },
              { label: 'Balance',  val: `RM ${balance.toLocaleString()}`,  color: 'var(--ink)'          },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--ink-subtle)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: item.color, letterSpacing: '-0.5px' }}>{fLoading ? '—' : item.val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardActions>
            <Button size="sm" onClick={() => navigate('/finance')}>View all</Button>
          </CardActions>
        </CardHeader>
        {sLoading ? <LoadingState /> : (
          <Table>
            <Thead>
              <tr>
                <Th>Description</Th><Th>Category</Th><Th>Type</Th><Th>Date</Th><Th>Amount (RM)</Th>
              </tr>
            </Thead>
            <Tbody>
              {(stats?.recent_transactions || []).map(t => (
                <Tr key={t.transaction_id}>
                  <TdPrimary>{t.description || '—'}</TdPrimary>
                  <Td>{t.category || '—'}</Td>
                  <Td><Badge>{t.type}</Badge></Td>
                  <Td mono>{t.date}</Td>
                  <Td mono>{Number(t.amount).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}

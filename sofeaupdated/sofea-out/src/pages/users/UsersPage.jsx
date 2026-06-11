import { useFetch } from '../../hooks/useFetch'
import { api } from '../../api'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, Thead, Th, Tbody, Tr, Td, TdPrimary } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { LoadingState, EmptyState } from '../../components/ui/EmptyState'

export default function UsersPage() {
  const { data: users, loading } = useFetch(api.getUsers)

  return (
    <div style={{ padding: '28px 24px' }}>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        subtitle="Manage system access and roles for organization members"
        action={null}
      />

      <Card>
        <CardHeader>
          <CardTitle>System Members</CardTitle>
        </CardHeader>
        {loading ? <LoadingState /> : !users?.length ? (
          <EmptyState message="No users found." />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Joined</Th><Th>Status</Th>
              </tr>
            </Thead>
            <Tbody>
              {users.map(u => (
                <Tr key={u.id}>
                  <TdPrimary>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: u.role === 'sa_advisor' ? 'var(--info-bg)' : 'rgba(94,106,210,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600,
                        color: u.role === 'sa_advisor' ? 'var(--info-text)' : 'var(--primary-hover)',
                        flexShrink: 0,
                      }}>
                        {u.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      {u.name}
                    </div>
                  </TdPrimary>
                  <Td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-subtle)' }}>{u.email}</Td>
                  <Td><Badge>{u.role}</Badge></Td>
                  <Td mono>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</Td>
                  <Td><Badge variant="green">active</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  )
}

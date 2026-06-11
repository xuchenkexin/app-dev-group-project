import client from './client'

// ─── Field-name normalisers ────────────────────────────────────
// Backend PKs use table_id (activity_id, announcement_id …).
// Frontend components expect plain `id`.

function normalizeActivity(a) {
  return {
    ...a,
    id: a.activity_id ?? a.id,
    registered: a.registered_count ?? a.registered ?? 0,
  }
}

const ROLE_LABEL = { all: 'All Members', sa_advisor: 'SA Advisor', high_committee: 'High Committee' }
const LABEL_ROLE = { 'All Members': 'all', 'High Committee': 'high_committee', 'SA Advisor': 'sa_advisor' }

function normalizeAnnouncement(a) {
  return {
    ...a,
    id: a.announcement_id ?? a.id,
    created_at: a.published_at ?? a.created_at,
    audience: ROLE_LABEL[a.target_role] ?? a.audience ?? 'All Members',
  }
}


// ─── Real API ─────────────────────────────────────────────────
export const api = {

  // ── Auth ────────────────────────────────────────────────────
  login: async ({ email, password }) => {
    const res = await client.post('/auth/login', { email, password })
    return res.data.data   // { token, user }
  },

  // ── Activities ──────────────────────────────────────────────
  getActivities: async () => {
    const res = await client.get('/activities')
    return res.data.data.map(normalizeActivity)
  },
  createActivity: async (data) => {
    const res = await client.post('/activities', data)
    return normalizeActivity(res.data.data)
  },
  updateActivity: async (id, data) => {
    const res = await client.put(`/activities/${id}`, data)
    return normalizeActivity(res.data.data)
  },
  deleteActivity: async (id) => {
    const res = await client.delete(`/activities/${id}`)
    return res.data
  },

  // ── Registrations ───────────────────────────────────────────
  getRegistrations: async (activityId) => {
    if (!activityId) return []
    const res = await client.get(`/registrations/activity/${activityId}`)
    return res.data.data
  },
  register: async (activityId) => {
    const res = await client.post('/registrations', { activity_id: activityId })
    return res.data
  },

  // ── Attendance ──────────────────────────────────────────────
  getAttendance: async (activityId) => {
    const res = await client.get(`/attendance/activity/${activityId}`)
    return res.data.data
  },
  markAttendance: async (registrationId, status) => {
    const res = await client.post('/attendance', { registration_id: registrationId, status })
    return res.data.data
  },
  updateAttendance: async (attendanceId, status) => {
    const res = await client.put(`/attendance/${attendanceId}`, { status })
    return res.data.data
  },

  // ── Finance ─────────────────────────────────────────────────
  getTransactions: async () => {
    const res = await client.get('/transactions')
    return res.data.data
  },
  createTransaction: async (data) => {
    const res = await client.post('/transactions', data)
    return res.data.data
  },
  deleteTransaction: async (id) => {
    const res = await client.delete(`/transactions/${id}`)
    return res.data
  },
  getTransactionSummary: async () => {
    const res = await client.get('/transactions/summary')
    return res.data.data   // { total_income, total_expense, net_balance }
  },

  // ── Announcements ───────────────────────────────────────────
  getAnnouncements: async () => {
    const res = await client.get('/announcements')
    return res.data.data.map(normalizeAnnouncement)
  },
  createAnnouncement: async (data) => {
    const payload = {
      title: data.title,
      content: data.content,
      target_role: LABEL_ROLE[data.audience] ?? 'all',
    }
    const res = await client.post('/announcements', payload)
    return normalizeAnnouncement(res.data.data)
  },
  deleteAnnouncement: async (id) => {
    const res = await client.delete(`/announcements/${id}`)
    return res.data
  },

  // ── Dashboard ───────────────────────────────────────────────
  getDashboardStats: async () => {
    const res = await client.get('/dashboard/stats')
    const d = res.data.data
    return {
      ...d,
      recent_activities: (d.recent_activities || []).map(normalizeActivity),
    }
  },

  // ── Users ───────────────────────────────────────────────────
  getUsers: async () => {
    const res = await client.get('/users')
    return res.data.data.map(u => ({ ...u, id: u.user_id }))
  },

  // ── Check-in (server-side) ───────────────────────────────────
  generateCheckinCode: async (activityId) => {
    const res = await client.post(`/checkin/generate/${activityId}`)
    return res.data.data  // { code, expires }
  },
  submitCheckin: async (code, activityId) => {
    const res = await client.post('/checkin/submit', { activity_id: activityId, code })
    return res.data       // { success, message }
  },

  // ── Audit (computed from transactions) ──────────────────────
  getAuditReport: async ({ from, to }) => {
    const res = await client.get('/transactions')
    const all = res.data.data
    // mysql2 returns DATE columns as JS Date objects → ISO string in UTC.
    // Use local-timezone YYYY-MM-DD for correct comparison.
    const toYMD = (v) => {
      const d = new Date(v)
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-')
    }
    const filtered = all.filter(t => {
      const d = toYMD(t.date)
      return d >= from && d <= to
    })
    const income  = filtered.filter(t => t.type === 'income') .reduce((s, t) => s + Number(t.amount), 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { transactions: filtered, income, expense, balance: income - expense }
  },
}

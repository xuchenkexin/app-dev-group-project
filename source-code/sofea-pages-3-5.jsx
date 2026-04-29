// SoFea — Pages 3, 4, 5: Activity List, Activity Detail, Attendance

// ── ACTIVITY LIST — Page 3 ─────────────────────────────
const ActivityListPage = ({ navigate, openModal, activities }) => {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const tabs = ['All', 'Open', 'Closed', 'Cancelled'];

  const filtered = activities.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tabCount = tab => tab === 'All' ? activities.length : activities.filter(a => a.status === tab).length;

  const statusDot = { Open: '#185FA5', Closed: '#E49B0F', Cancelled: '#E24B4A' };

  return (
    <PageLayout
      title="Activities"
      actions={
        <PrimaryBtn onClick={() => navigate('activity-detail', { mode: 'create' })}>
          <Icon name="plus" size={15} color="#fff" /> New Activity
        </PrimaryBtn>
      }
    >
      {/* Search + filter row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Icon name="search" size={15} color="#8AA0B0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <SofInput
            placeholder="Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <SofSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 150 }}>
          {tabs.map(t => <option key={t}>{t}</option>)}
        </SofSelect>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setStatusFilter(tab)} style={{
            height: 32, padding: '0 14px', borderRadius: 20, border: 'none',
            background: statusFilter === tab ? '#185FA5' : '#fff',
            color: statusFilter === tab ? '#fff' : '#6888A0',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            border: statusFilter === tab ? 'none' : '0.5px solid #D0DDE8',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {tab}
            <span style={{
              background: statusFilter === tab ? 'rgba(255,255,255,0.25)' : '#F0F4F8',
              color: statusFilter === tab ? '#fff' : '#6888A0',
              borderRadius: 10, padding: '1px 7px', fontSize: 11,
            }}>{tabCount(tab)}</span>
          </button>
        ))}
      </div>

      {/* Activity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {filtered.map(a => {
          const remaining = a.maxSlots - a.registered;
          return (
            <SofCard key={a.id} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1A2A3A', flex: 1, paddingRight: 8 }}>{a.title}</div>
                <Badge label={a.status} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6888A0' }}>
                  <Icon name="calendar" size={13} color="#8AA0B0" /> {a.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#6888A0' }}>
                  <Icon name="location" size={13} color="#8AA0B0" /> {a.venue}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8AA0B0', marginBottom: 5 }}>
                  <span>Registration</span>
                  <span>{a.registered}/{a.maxSlots} slots filled</span>
                </div>
                <ProgressBar value={a.registered} max={a.maxSlots} color={remaining === 0 ? '#E49B0F' : '#185FA5'} />
              </div>
              <button onClick={() => navigate('activity-detail', { activityId: a.id })} style={{
                background: 'none', border: 'none', color: '#185FA5',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', padding: 0,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                View details <Icon name="chevronRight" size={13} color="#185FA5" />
              </button>
            </SofCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8AA0B0', fontSize: 13 }}>
          No activities found.
        </div>
      )}
    </PageLayout>
  );
};

// ── ACTIVITY DETAIL + CREATE — Page 4 ─────────────────
const ActivityDetailPage = ({ navigate, openModal, activities, mode, activityId }) => {
  const activity = activities.find(a => a.id === activityId) || activities[0];

  // Create form state
  const [createForm, setCreateForm] = React.useState({ title: '', date: '', venue: '', maxSlots: '', description: '' });
  const [createErrors, setCreateErrors] = React.useState({});
  const setCreate = (k, v) => setCreateForm(f => ({ ...f, [k]: v }));

  const validateCreate = () => {
    const e = {};
    if (!createForm.title) e.title = 'Required';
    if (!createForm.date) e.date = 'Required';
    if (!createForm.venue) e.venue = 'Required';
    if (!createForm.maxSlots) e.maxSlots = 'Required';
    return e;
  };

  const handleCreate = () => {
    const e = validateCreate();
    if (Object.keys(e).length) { setCreateErrors(e); return; }
    openModal('create-activity-success');
  };

  const remaining = activity ? activity.maxSlots - activity.registered : 0;
  const isFull = remaining === 0;

  const participants = [
    { id: 1, name: 'Ahmad Faris', matric: 'A23CS0001', initials: 'AF', date: '10 Feb 2025', status: 'Present' },
    { id: 2, name: 'Nurul Ain', matric: 'A23CS0002', initials: 'NA', date: '11 Feb 2025', status: 'Present' },
    { id: 3, name: 'Muhammad Haziq', matric: 'A23CS0003', initials: 'MH', date: '11 Feb 2025', status: 'Absent' },
    { id: 4, name: 'Siti Rahmah', matric: 'A23CS0004', initials: 'SR', date: '12 Feb 2025', status: 'Present' },
  ];

  return (
    <PageLayout style={{ padding: 0 }}>
      <div style={{ padding: '20px 24px 0' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 12, color: '#8AA0B0' }}>
          <button onClick={() => navigate('activities')} style={{ background: 'none', border: 'none', color: '#185FA5', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>Activities</button>
          <Icon name="chevronRight" size={12} color="#8AA0B0" />
          <span>{activity?.title || 'New Activity'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, padding: '0 24px 24px' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Activity Info Card */}
          {activity && (
            <SofCard style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0C447C', margin: '0 0 8px' }}>{activity.title}</h2>
                  <Badge label={activity.status} />
                </div>
              </div>

              {/* Meta grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                {[
                  { icon: 'calendar', label: 'Date', value: activity.date },
                  { icon: 'clock', label: 'Time', value: activity.time },
                  { icon: 'location', label: 'Venue', value: activity.venue },
                  { icon: 'users', label: 'Max Slots', value: `${activity.maxSlots} participants` },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={m.icon} size={15} color="#185FA5" />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#8AA0B0', marginBottom: 1 }}>{m.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2A3A' }}>{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 13, color: '#1A2A3A', lineHeight: 1.7, margin: '0 0 18px' }}>{activity.description}</p>

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6888A0', marginBottom: 6 }}>
                  <span>Registration Progress</span>
                  <span>{activity.registered}/{activity.maxSlots}</span>
                </div>
                <ProgressBar value={activity.registered} max={activity.maxSlots} color={isFull ? '#E49B0F' : '#185FA5'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#EAF3DE', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#27500A' }}>{activity.registered}</div>
                  <div style={{ fontSize: 12, color: '#27500A', opacity: 0.8 }}>Registered</div>
                </div>
                <div style={{ background: isFull ? '#FAEEDA' : '#E6F1FB', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: isFull ? '#633806' : '#185FA5' }}>{remaining}</div>
                  <div style={{ fontSize: 12, color: isFull ? '#633806' : '#185FA5', opacity: 0.8 }}>Remaining</div>
                </div>
              </div>

              {/* Participants preview */}
              <Divider style={{ margin: '18px 0 14px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <SectionTitle>Participants</SectionTitle>
                <button onClick={() => openModal('participants-list')} style={{
                  background: 'none', border: 'none', color: '#185FA5',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>View all</button>
              </div>
              {participants.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid #F0F4F8' }}>
                  <Avatar initials={p.initials} size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2A3A' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#8AA0B0' }}>{p.matric} · {p.date}</div>
                  </div>
                  {p.status && <Badge label={p.status} />}
                </div>
              ))}
            </SofCard>
          )}

          {/* Create Form */}
          <SofCard style={{ padding: 24 }}>
            <SectionTitle style={{ marginBottom: 16 }}>Create New Activity</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FormField label="Activity Name" error={createErrors.title}>
                <SofInput placeholder="e.g. Annual Dinner 2025" value={createForm.title} onChange={e => { setCreate('title', e.target.value); setCreateErrors(err => ({...err, title:''})); }} error={!!createErrors.title} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FormField label="Date" error={createErrors.date}>
                  <SofInput type="date" value={createForm.date} onChange={e => { setCreate('date', e.target.value); setCreateErrors(err => ({...err, date:''})); }} error={!!createErrors.date} />
                </FormField>
                <FormField label="Venue" error={createErrors.venue}>
                  <SofInput placeholder="e.g. Dewan Besar" value={createForm.venue} onChange={e => { setCreate('venue', e.target.value); setCreateErrors(err => ({...err, venue:''})); }} error={!!createErrors.venue} />
                </FormField>
              </div>
              <FormField label="Max Slots" error={createErrors.maxSlots}>
                <SofInput type="number" placeholder="e.g. 50" value={createForm.maxSlots} onChange={e => { setCreate('maxSlots', e.target.value); setCreateErrors(err => ({...err, maxSlots:''})); }} error={!!createErrors.maxSlots} />
              </FormField>
              <FormField label="Description">
                <SofTextarea rows={3} placeholder="Describe the activity..." value={createForm.description} onChange={e => setCreate('description', e.target.value)} />
              </FormField>
              <PrimaryBtn onClick={handleCreate} style={{ width: '100%' }}>
                <Icon name="plus" size={15} color="#fff" /> Create Activity
              </PrimaryBtn>
            </div>
          </SofCard>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activity && (
            <SofCard style={{ padding: 20 }}>
              <SectionTitle style={{ marginBottom: 14 }}>Actions</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <PrimaryBtn onClick={() => navigate('attendance', { activityId: activity.id })} style={{ width: '100%' }}>
                  <Icon name="checkSquare" size={15} color="#fff" /> Mark Attendance
                </PrimaryBtn>
                <OutlineBtn onClick={() => openModal('edit-activity')} style={{ width: '100%' }}>
                  <Icon name="edit" size={15} color="#185FA5" /> Edit Activity
                </OutlineBtn>
                {activity.status === 'Open' && (
                  <PrimaryBtn
                    onClick={() => openModal(isFull ? 'reg-closed' : 'reg-success')}
                    style={{ width: '100%', background: isFull ? '#6888A0' : '#185FA5' }}
                  >
                    {isFull ? 'Activity Full' : 'Register'}
                  </PrimaryBtn>
                )}
              </div>
            </SofCard>
          )}

          {/* Activity quick stats */}
          {activity && (
            <SofCard style={{ padding: 20 }}>
              <SectionTitle style={{ marginBottom: 12 }}>Quick Info</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#8AA0B0' }}>Status</span>
                  <Badge label={activity.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#8AA0B0' }}>Slots filled</span>
                  <span style={{ color: '#1A2A3A', fontWeight: 500 }}>{Math.round((activity.registered / activity.maxSlots) * 100)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#8AA0B0' }}>Time</span>
                  <span style={{ color: '#1A2A3A', fontWeight: 500 }}>{activity.time}</span>
                </div>
              </div>
            </SofCard>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

// ── ATTENDANCE — Page 5 ────────────────────────────────
const AttendancePage = ({ navigate, activityId, activities }) => {
  const activity = activities.find(a => a.id === activityId) || activities[0];

  const initParticipants = [
    { id: 1, name: 'Ahmad Faris', matric: 'A23CS0001', initials: 'AF', status: 'Present' },
    { id: 2, name: 'Nurul Ain', matric: 'A23CS0002', initials: 'NA', status: 'Present' },
    { id: 3, name: 'Muhammad Haziq', matric: 'A23CS0003', initials: 'MH', status: 'Absent' },
    { id: 4, name: 'Siti Rahmah', matric: 'A23CS0004', initials: 'SR', status: null },
    { id: 5, name: 'Amir Zulkifli', matric: 'A23CS0005', initials: 'AZ', status: null },
    { id: 6, name: 'Farah Nadia', matric: 'A23CS0006', initials: 'FN', status: 'Present' },
    { id: 7, name: 'Zulaikha Bt Razali', matric: 'A23CS0007', initials: 'ZR', status: null },
    { id: 8, name: 'Hafizuddin Mahmud', matric: 'A23CS0008', initials: 'HM', status: 'Absent' },
  ];

  const [participants, setParticipants] = React.useState(initParticipants);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const perPage = 6;

  const toggle = (id, status) => {
    setParticipants(ps => ps.map(p => p.id === id ? { ...p, status: p.status === status ? null : status } : p));
  };

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.matric.toLowerCase().includes(search.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const present = participants.filter(p => p.status === 'Present').length;
  const absent = participants.filter(p => p.status === 'Absent').length;

  return (
    <PageLayout title="Attendance Tracking" subtitle={activity?.title}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Registered', value: participants.length, bg: '#E6F1FB', color: '#185FA5' },
          { label: 'Present', value: present, bg: '#EAF3DE', color: '#27500A' },
          { label: 'Absent', value: absent, bg: '#FCEBEB', color: '#791F1F' },
        ].map(s => (
          <SofCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6888A0', marginTop: 2 }}>{s.label}</div>
          </SofCard>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
        <Icon name="search" size={15} color="#8AA0B0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <SofInput placeholder="Search participant..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: 36 }} />
      </div>

      {/* Table */}
      <SofCard>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FBFD' }}>
              {['Participant', 'Matric Number', 'Status', 'Mark'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#4A6070', borderBottom: '0.5px solid #D0DDE8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map(p => (
              <tr key={p.id} style={{ borderBottom: '0.5px solid #F0F4F8' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={p.initials} size={30} />
                    <span style={{ fontWeight: 500, color: '#1A2A3A' }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#6888A0' }}>{p.matric}</td>
                <td style={{ padding: '12px 16px' }}>
                  {p.status
                    ? <Badge label={p.status} />
                    : <span style={{ color: '#8AA0B0', fontSize: 12 }}>—</span>
                  }
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggle(p.id, 'Present')} style={{
                      height: 30, padding: '0 12px', borderRadius: 6, border: 'none',
                      background: p.status === 'Present' ? '#185FA5' : '#F0F4F8',
                      color: p.status === 'Present' ? '#fff' : '#6888A0',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}>P</button>
                    <button onClick={() => toggle(p.id, 'Absent')} style={{
                      height: 30, padding: '0 12px', borderRadius: 6, border: 'none',
                      background: p.status === 'Absent' ? '#E24B4A' : '#F0F4F8',
                      color: p.status === 'Absent' ? '#fff' : '#6888A0',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}>A</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '0.5px solid #D0DDE8' }}>
          <span style={{ fontSize: 12, color: '#8AA0B0' }}>
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{
                width: 30, height: 30, borderRadius: 6, border: 'none',
                background: page === n ? '#185FA5' : '#F0F4F8',
                color: page === n ? '#fff' : '#6888A0',
                fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{n}</button>
            ))}
          </div>
        </div>
      </SofCard>
    </PageLayout>
  );
};

Object.assign(window, { ActivityListPage, ActivityDetailPage, AttendancePage });

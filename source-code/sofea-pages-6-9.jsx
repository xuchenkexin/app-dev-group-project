// SoFea — Pages 6, 7, 8, 9: Finance, Record Transaction, Audit Report, Announcements

// ── FINANCE — Page 6 ───────────────────────────────────
const FinancePage = ({ navigate, transactions }) => {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('All');
  const [catFilter, setCatFilter] = React.useState('All');

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  const filtered = transactions.filter(t => {
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || t.type === typeFilter;
    const matchCat = catFilter === 'All' || t.category === catFilter;
    return matchSearch && matchType && matchCat;
  });

  const dotColor = { Income: '#27500A', Expense: '#791F1F' };
  const amtColor = { Income: '#27500A', Expense: '#791F1F' };

  return (
    <PageLayout title="Financial Management" actions={
      <div style={{ display: 'flex', gap: 8 }}>
        <PrimaryBtn onClick={() => navigate('record-transaction', { mode: 'income' })}>
          <Icon name="plus" size={15} color="#fff" /> Record Income
        </PrimaryBtn>
        <OutlineBtn onClick={() => navigate('record-transaction', { mode: 'expense' })}>
          <Icon name="plus" size={15} color="#185FA5" /> Record Expense
        </OutlineBtn>
      </div>
    }>
      {/* Balance Banner */}
      <div style={{
        background: '#185FA5', borderRadius: 12,
        padding: '20px 24px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Net Balance</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>RM {netBalance.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
        </div>
        <button onClick={() => navigate('audit-report')} style={{
          background: 'rgba(255,255,255,0.15)', border: '0.5px solid rgba(255,255,255,0.3)',
          borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="fileText" size={14} color="#fff" /> Generate Audit Report
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <SofCard style={{ padding: '16px 20px', borderLeft: '3px solid #27500A' }}>
          <div style={{ fontSize: 11, color: '#8AA0B0', marginBottom: 4 }}>Total Income</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#27500A' }}>RM {totalIncome.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
        </SofCard>
        <SofCard style={{ padding: '16px 20px', borderLeft: '3px solid #791F1F' }}>
          <div style={{ fontSize: 11, color: '#8AA0B0', marginBottom: 4 }}>Total Expenses</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#791F1F' }}>RM {totalExpenses.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</div>
        </SofCard>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Icon name="search" size={15} color="#8AA0B0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <SofInput placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <SofSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 130 }}>
          <option>All</option><option>Income</option><option>Expense</option>
        </SofSelect>
        <SofSelect value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 170 }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </SofSelect>
      </div>

      {/* Table */}
      <SofCard>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FBFD' }}>
              {['', 'Description', 'Category', 'Date', 'Amount', 'Type'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#4A6070', borderBottom: '0.5px solid #D0DDE8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} style={{ borderBottom: '0.5px solid #F0F4F8' }}>
                <td style={{ padding: '12px 16px', width: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor[t.type] }} />
                </td>
                <td style={{ padding: '12px 16px', color: '#1A2A3A', fontWeight: 500 }}>{t.desc}</td>
                <td style={{ padding: '12px 16px', color: '#6888A0' }}>{t.category}</td>
                <td style={{ padding: '12px 16px', color: '#6888A0' }}>{t.date}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: amtColor[t.type] }}>
                  {t.type === 'Income' ? '+' : '-'} RM {t.amount.toFixed(2)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={t.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#8AA0B0', fontSize: 13 }}>No transactions found.</div>
        )}
      </SofCard>
    </PageLayout>
  );
};

// ── RECORD TRANSACTION — Page 7 ────────────────────────
const RecordTransactionPage = ({ navigate, openModal, initialMode }) => {
  const [mode, setMode] = React.useState(initialMode || 'income');
  const [form, setForm] = React.useState({ description: '', amount: '', date: '', category: '', notes: '' });
  const [errors, setErrors] = React.useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const clearErr = k => setErrors(e => ({ ...e, [k]: '' }));

  const incomeCategories = ['Membership', 'Sponsorship', 'Registration', 'Donation', 'Other'];
  const expenseCategories = ['Venue', 'Food & Beverage', 'Merchandise', 'Transport', 'Equipment', 'Other'];
  const cats = mode === 'income' ? incomeCategories : expenseCategories;

  const validate = () => {
    const e = {};
    if (!form.description) e.description = 'Required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Required';
    if (!form.category) e.category = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    openModal('transaction-saved');
  };

  const activeIncome = mode === 'income';

  return (
    <PageLayout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: '#8AA0B0' }}>
          <button onClick={() => navigate('finance')} style={{ background: 'none', border: 'none', color: '#185FA5', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>Finance</button>
          <Icon name="chevronRight" size={12} color="#8AA0B0" />
          <span>Record Transaction</span>
        </div>

        <SofCard style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0C447C', margin: '0 0 20px' }}>Record Transaction</h2>

          {/* Toggle */}
          <div style={{ display: 'flex', background: '#F0F4F8', borderRadius: 8, padding: 3, gap: 3, marginBottom: 22 }}>
            {['income', 'expense'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }} style={{
                flex: 1, height: 36, borderRadius: 6, border: 'none',
                background: mode === m ? (m === 'income' ? '#27500A' : '#791F1F') : 'transparent',
                color: mode === m ? '#fff' : '#6888A0',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>{m === 'income' ? '+ Income' : '− Expense'}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Description" error={errors.description}>
              <SofInput placeholder="e.g. Sponsorship from Company X" value={form.description}
                onChange={e => { set('description', e.target.value); clearErr('description'); }} error={!!errors.description} />
            </FormField>

            <FormField label="Amount (RM)" error={errors.amount}>
              <div style={{ position: 'relative', display: 'flex' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#E6F1FB', borderRadius: '8px 0 0 8px',
                  border: '0.5px solid #C0D0DE', borderRight: 'none',
                  padding: '0 12px', fontSize: 13, fontWeight: 600, color: '#185FA5',
                  height: 40, flexShrink: 0,
                }}>RM</div>
                <SofInput type="number" placeholder="0.00" value={form.amount}
                  onChange={e => { set('amount', e.target.value); clearErr('amount'); }} error={!!errors.amount}
                  style={{ borderRadius: '0 8px 8px 0' }} />
              </div>
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Date" error={errors.date}>
                <SofInput type="date" value={form.date}
                  onChange={e => { set('date', e.target.value); clearErr('date'); }} error={!!errors.date} />
              </FormField>
              <FormField label="Category" error={errors.category}>
                <SofSelect value={form.category} onChange={e => { set('category', e.target.value); clearErr('category'); }} style={{ width: '100%' }}>
                  <option value="">Select category</option>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </SofSelect>
              </FormField>
            </div>

            <FormField label="Notes (optional)">
              <SofTextarea rows={3} placeholder="Additional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
            </FormField>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <OutlineBtn onClick={() => navigate('finance')} style={{ flex: 1 }}>Cancel</OutlineBtn>
              <PrimaryBtn onClick={handleSave} style={{ flex: 2 }}>Save Transaction</PrimaryBtn>
            </div>
          </div>
        </SofCard>
      </div>
    </PageLayout>
  );
};

// ── AUDIT REPORT — Page 8 ──────────────────────────────
const AuditReportPage = ({ navigate, transactions, role }) => {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [generated, setGenerated] = React.useState(false);
  const [dateErr, setDateErr] = React.useState('');

  const handleGenerate = () => {
    if (!fromDate || !toDate) { setDateErr('Please select a date range.'); return; }
    setDateErr('');
    setGenerated(true);
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const incomeRows = transactions.filter(t => t.type === 'Income');
  const expenseRows = transactions.filter(t => t.type === 'Expense');

  return (
    <PageLayout title="Audit Report" actions={
      role === 'advisor' && (
        <span style={{ background: '#E6F1FB', color: '#185FA5', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>
          SA Advisor Only
        </span>
      )
    }>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: '#8AA0B0' }}>
        <button onClick={() => navigate('finance')} style={{ background: 'none', border: 'none', color: '#185FA5', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0 }}>Finance</button>
        <Icon name="chevronRight" size={12} color="#8AA0B0" />
        <span>Audit Report</span>
      </div>

      {/* Date Range Selector */}
      <SofCard style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <FormField label="From Date" style={{ flex: 1, minWidth: 150 }}>
            <SofInput type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setDateErr(''); }} />
          </FormField>
          <FormField label="To Date" style={{ flex: 1, minWidth: 150 }}>
            <SofInput type="date" value={toDate} onChange={e => { setToDate(e.target.value); setDateErr(''); }} />
          </FormField>
          <div style={{ paddingBottom: dateErr ? 20 : 0 }}>
            <PrimaryBtn onClick={handleGenerate}>
              <Icon name="trending" size={15} color="#fff" /> Generate Report
            </PrimaryBtn>
          </div>
        </div>
        {dateErr && <div style={{ fontSize: 12, color: '#791F1F', marginTop: 8 }}>{dateErr}</div>}
      </SofCard>

      {generated && (
        <>
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
            <SofCard style={{ padding: '16px 20px', background: '#EAF3DE', border: '0.5px solid #B8DCA0' }}>
              <div style={{ fontSize: 11, color: '#27500A', opacity: 0.8, marginBottom: 4 }}>Total Income</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#27500A' }}>RM {totalIncome.toFixed(2)}</div>
            </SofCard>
            <SofCard style={{ padding: '16px 20px', background: '#FCEBEB', border: '0.5px solid #F0B8B8' }}>
              <div style={{ fontSize: 11, color: '#791F1F', opacity: 0.8, marginBottom: 4 }}>Total Expenses</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#791F1F' }}>RM {totalExpenses.toFixed(2)}</div>
            </SofCard>
            <SofCard style={{ padding: '16px 20px', background: '#E6F1FB', border: '0.5px solid #B5D4F4' }}>
              <div style={{ fontSize: 11, color: '#185FA5', opacity: 0.8, marginBottom: 4 }}>Net Balance</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#185FA5' }}>RM {netBalance.toFixed(2)}</div>
            </SofCard>
          </div>

          {/* Tables + Export */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Income Breakdown */}
            <SofCard style={{ padding: 20 }}>
              <SectionTitle style={{ marginBottom: 12 }}>Income Breakdown</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FBFD' }}>
                    {['Description', 'Category', 'Amount'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#4A6070', borderBottom: '0.5px solid #D0DDE8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incomeRows.map(t => (
                    <tr key={t.id} style={{ borderBottom: '0.5px solid #F0F4F8' }}>
                      <td style={{ padding: '8px 10px', color: '#1A2A3A' }}>{t.desc}</td>
                      <td style={{ padding: '8px 10px', color: '#6888A0' }}>{t.category}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#27500A' }}>RM {t.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SofCard>

            {/* Expense Breakdown + Report Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SofCard style={{ padding: 20 }}>
                <SectionTitle style={{ marginBottom: 12 }}>Expense Breakdown</SectionTitle>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F8FBFD' }}>
                      {['Description', 'Category', 'Amount'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#4A6070', borderBottom: '0.5px solid #D0DDE8' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenseRows.map(t => (
                      <tr key={t.id} style={{ borderBottom: '0.5px solid #F0F4F8' }}>
                        <td style={{ padding: '8px 10px', color: '#1A2A3A' }}>{t.desc}</td>
                        <td style={{ padding: '8px 10px', color: '#6888A0' }}>{t.category}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#791F1F' }}>RM {t.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SofCard>

              <SofCard style={{ padding: 20 }}>
                <SectionTitle style={{ marginBottom: 12 }}>Report Info</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#8AA0B0' }}>Generated by</span>
                    <span style={{ color: '#1A2A3A', fontWeight: 500 }}>SA Advisor</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#8AA0B0' }}>Date Range</span>
                    <span style={{ color: '#1A2A3A', fontWeight: 500 }}>{fromDate} — {toDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#8AA0B0' }}>Generated on</span>
                    <span style={{ color: '#1A2A3A', fontWeight: 500 }}>29 Apr 2026</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <PrimaryBtn onClick={() => {}} style={{ flex: 1 }}>
                    <Icon name="download" size={14} color="#fff" /> Export PDF
                  </PrimaryBtn>
                  <OutlineBtn onClick={() => {}} style={{ flex: 1 }}>
                    <Icon name="download" size={14} color="#185FA5" /> Export CSV
                  </OutlineBtn>
                </div>
              </SofCard>
            </div>
          </div>
        </>
      )}

      {!generated && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8AA0B0', fontSize: 13 }}>
          <Icon name="fileText" size={40} color="#D0DDE8" style={{ display: 'block', margin: '0 auto 12px' }} />
          Select a date range and click Generate Report to view the audit summary.
        </div>
      )}
    </PageLayout>
  );
};

// ── ANNOUNCEMENTS — Page 9 ─────────────────────────────
const AnnouncementsPage = ({ openModal, announcements, setAnnouncements }) => {
  const [tab, setTab] = React.useState('All');
  const [form, setForm] = React.useState({ title: '', content: '', audiences: ['All Members'] });
  const [formErrors, setFormErrors] = React.useState({});
  const formRef = React.useRef(null);

  const tabs = ['All', 'Unread', 'All Members', 'High Committee'];

  const filtered = announcements.filter(a => {
    if (tab === 'Unread') return a.unread;
    if (tab === 'All') return true;
    return a.audience === tab;
  });

  const toggleAudience = aud => {
    setForm(f => {
      const has = f.audiences.includes(aud);
      const next = has ? f.audiences.filter(a => a !== aud) : [...f.audiences, aud];
      return { ...f, audiences: next.length ? next : [aud] };
    });
  };

  const handlePublish = () => {
    const e = {};
    if (!form.title) e.title = 'Title is required';
    if (!form.content) e.content = 'Content is required';
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setFormErrors({});
    openModal('announcement-published');
  };

  const audienceChips = ['All Members', 'SA Advisor', 'High Committee'];
  const audienceDot = { 'All Members': '#185FA5', 'High Committee': '#5B2D8E', 'SA Advisor': '#0C5A78' };

  return (
    <PageLayout title="Announcements" style={{ padding: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, height: '100%' }}>

        {/* Left — Announcement List */}
        <div style={{ padding: 24, overflowY: 'auto', borderRight: '0.5px solid #D0DDE8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 500, color: '#0C447C', margin: 0 }}>Announcements</h1>
            <PrimaryBtn onClick={() => formRef.current?.scrollIntoView && window.scrollTo({ top: 9999, behavior: 'smooth' })}>
              <Icon name="plus" size={15} color="#fff" /> New
            </PrimaryBtn>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                height: 30, padding: '0 14px', borderRadius: 20, border: 'none',
                background: tab === t ? '#185FA5' : '#fff',
                color: tab === t ? '#fff' : '#6888A0',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                border: tab === t ? 'none' : '0.5px solid #D0DDE8',
              }}>{t}</button>
            ))}
          </div>

          {/* Announcement Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(a => (
              <div key={a.id} style={{
                background: '#fff', borderRadius: 10,
                border: '0.5px solid #D0DDE8',
                borderLeft: a.unread ? '3px solid #185FA5' : '0.5px solid #D0DDE8',
                padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: '#E6F1FB', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name="speakerphone" size={16} color="#185FA5" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      {a.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#185FA5', flexShrink: 0 }} />}
                      <div style={{ fontSize: 13, fontWeight: a.unread ? 600 : 500, color: '#1A2A3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#8AA0B0', marginBottom: 6 }}>{a.audience} · {a.date}</div>
                    <div style={{ fontSize: 12, color: '#6888A0', lineHeight: 1.6, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.preview}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Badge label={a.audience} />
                      <button onClick={() => openModal('announcement-detail', a)} style={{
                        background: 'none', border: 'none', color: '#185FA5',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: 0,
                      }}>Read more →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8AA0B0', fontSize: 13 }}>No announcements here.</div>
            )}
          </div>
        </div>

        {/* Right — Compose Form */}
        <div style={{ padding: 24, overflowY: 'auto', background: '#FAFCFE' }} ref={formRef}>
          <SofCard style={{ padding: 22, marginBottom: 14 }}>
            <SectionTitle style={{ marginBottom: 16 }}>New Announcement</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FormField label="Title" error={formErrors.title}>
                <SofInput placeholder="Announcement title..."
                  value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setFormErrors(x => ({ ...x, title: '' })); }}
                  error={!!formErrors.title}
                />
              </FormField>
              <FormField label="Content" error={formErrors.content}>
                <SofTextarea rows={5} placeholder="Write your announcement..."
                  value={form.content}
                  onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setFormErrors(x => ({ ...x, content: '' })); }}
                  error={!!formErrors.content}
                />
              </FormField>
              <FormField label="Target Audience">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {audienceChips.map(aud => {
                    const sel = form.audiences.includes(aud);
                    return (
                      <button key={aud} onClick={() => toggleAudience(aud)} style={{
                        height: 30, padding: '0 12px', borderRadius: 20,
                        border: sel ? 'none' : '0.5px solid #D0DDE8',
                        background: sel ? '#E6F1FB' : '#fff',
                        color: sel ? '#185FA5' : '#6888A0',
                        fontSize: 12, fontWeight: sel ? 600 : 400, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        {sel && <Icon name="check" size={12} color="#185FA5" />}
                        {aud}
                      </button>
                    );
                  })}
                </div>
              </FormField>
              <PrimaryBtn onClick={handlePublish} style={{ width: '100%' }}>
                <Icon name="speakerphone" size={14} color="#fff" /> Publish Announcement
              </PrimaryBtn>
            </div>
          </SofCard>

          {/* Info card */}
          <SofCard style={{ padding: 16, background: '#E6F1FB', border: '0.5px solid #B5D4F4' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Icon name="info" size={16} color="#185FA5" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: '#185FA5', lineHeight: 1.6 }}>
                Publishing an announcement will send an in-app notification to all selected target audiences. Members will see it the next time they open the app.
              </div>
            </div>
          </SofCard>
        </div>
      </div>
    </PageLayout>
  );
};

Object.assign(window, { FinancePage, RecordTransactionPage, AuditReportPage, AnnouncementsPage });

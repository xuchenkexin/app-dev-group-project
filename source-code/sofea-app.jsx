// SoFea — Main App component with routing, data, and modal management

const ACTIVITIES_DATA = [
  { id: 1, title: 'Welcome Night 2025', status: 'Open', date: '15 Feb 2025', time: '7:00 PM', venue: 'Dewan Besar', maxSlots: 50, registered: 32, description: 'Annual welcome night for new and returning members. Light refreshments will be provided. Dress code: smart casual.' },
  { id: 2, title: 'Sports Day 2025', status: 'Open', date: '8 Mar 2025', time: '9:00 AM', venue: 'Field A, UTM', maxSlots: 100, registered: 87, description: 'Annual sports day featuring track and field events, team sports, and fun activities for all members.' },
  { id: 3, title: 'Community Service', status: 'Closed', date: '20 Jan 2025', time: '8:00 AM', venue: 'Kg. Melayu Majidee', maxSlots: 30, registered: 30, description: 'Gotong-royong programme at the local community center. Participants should wear comfortable clothing suitable for outdoor work.' },
  { id: 4, title: 'Tech Workshop', status: 'Cancelled', date: '28 Feb 2025', time: '2:00 PM', venue: 'Lab 3, Block N28', maxSlots: 25, registered: 0, description: 'Introduction to web development workshop. This event has been cancelled due to insufficient registration.' },
];

const TRANSACTIONS_DATA = [
  { id: 1, desc: 'Membership fees collection', category: 'Membership', date: '1 Jan 2025', amount: 500, type: 'Income' },
  { id: 2, desc: 'Venue rental for Welcome Night', category: 'Venue', date: '10 Feb 2025', amount: 200, type: 'Expense' },
  { id: 3, desc: 'Sponsorship from TechCorp Sdn Bhd', category: 'Sponsorship', date: '15 Feb 2025', amount: 1000, type: 'Income' },
  { id: 4, desc: 'Catering for Sports Day', category: 'Food & Beverage', date: '8 Mar 2025', amount: 350, type: 'Expense' },
  { id: 5, desc: 'T-shirt printing batch 1', category: 'Merchandise', date: '5 Mar 2025', amount: 180, type: 'Expense' },
  { id: 6, desc: 'Event registration fees', category: 'Registration', date: '1 Mar 2025', amount: 320, type: 'Income' },
];

const ANNOUNCEMENTS_DATA = [
  { id: 1, title: 'General Meeting — March 2025', audience: 'All Members', date: '2 Mar 2025', preview: 'Reminder: general meeting this Friday at 8 PM in Dewan Seminar. All members are required to attend.', content: 'Reminder that our general meeting will be held this Friday at 8 PM in Dewan Seminar. All members are required to attend. Please bring your student ID and last month\'s meeting notes. Refreshments will be served.', unread: true },
  { id: 2, title: 'Welcome Night Preparation', audience: 'High Committee', date: '28 Feb 2025', preview: 'Committee members must arrive 2 hours early for setup. Please wear official committee attire.', content: 'Committee members are required to arrive 2 hours early for setup at Dewan Besar. Please wear the official committee attire and bring your assigned equipment checklist. Walkie-talkies will be distributed upon arrival at the registration desk.', unread: true },
  { id: 3, title: 'Sports Day Rescheduled', audience: 'All Members', date: '25 Feb 2025', preview: 'Sports Day has been rescheduled to March 8, 2025 due to weather conditions. Transport departs at 8 AM.', content: 'Due to unforeseen weather conditions, Sports Day has been rescheduled from February 22 to March 8, 2025. We apologize for the short notice. Transportation will still be provided from the main gate. Departure time: 8:00 AM sharp. Please update your schedules accordingly.', unread: false },
  { id: 4, title: 'Q1 2025 Financial Report', audience: 'SA Advisor', date: '20 Feb 2025', preview: 'Please review the Q1 financial report and provide your approval by end of the week.', content: 'Please review the attached Q1 2025 financial summary report. Total income: RM 1,820.00. Total expenses: RM 730.00. Net balance: RM 1,090.00. Your written approval is needed by this Friday before the funds can be released for the next quarter\'s activities.', unread: false },
];

const SoFeaApp = () => {
  const [page, setPage]             = React.useState('login');
  const [role, setRole]             = React.useState('committee');
  const [modal, setModal]           = React.useState(null);
  const [modalData, setModalData]   = React.useState(null);
  const [navParams, setNavParams]   = React.useState({});
  const [activities, setActivities] = React.useState(ACTIVITIES_DATA);
  const [transactions]              = React.useState(TRANSACTIONS_DATA);
  const [announcements, setAnnouncements] = React.useState(ANNOUNCEMENTS_DATA);

  const navigate = (target, params = {}) => {
    setPage(target);
    setNavParams(params);
    setModal(null);
  };

  const openModal = (name, data = null) => {
    setModal(name);
    setModalData(data);
  };

  const closeModal = () => { setModal(null); setModalData(null); };

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    navigate('dashboard');
  };

  const userName  = role === 'advisor' ? 'Dr. Amirah Hassan' : 'Muhammad Haziq';
  const userRole  = role === 'advisor' ? 'SA Advisor' : 'High Committee';

  // ── Render current page ──────────────────────────────
  const renderPage = () => {
    if (page === 'login') {
      return <LoginPage onLogin={handleLogin} openModal={openModal} />;
    }

    const commonProps = { navigate, openModal, activities, transactions, announcements, role };

    const pageContent = (() => {
      switch (page) {
        case 'dashboard':
          return <DashboardPage {...commonProps} />;
        case 'activities':
          return <ActivityListPage {...commonProps} />;
        case 'activity-detail':
          return <ActivityDetailPage {...commonProps} activityId={navParams.activityId || 1} mode={navParams.mode} />;
        case 'attendance':
          return <AttendancePage {...commonProps} activityId={navParams.activityId || 1} />;
        case 'finance':
          return <FinancePage {...commonProps} />;
        case 'record-transaction':
          return <RecordTransactionPage {...commonProps} initialMode={navParams.mode || 'income'} />;
        case 'audit-report':
          return <AuditReportPage {...commonProps} />;
        case 'announcements':
          return <AnnouncementsPage {...commonProps} setAnnouncements={setAnnouncements} />;
        default:
          return <DashboardPage {...commonProps} />;
      }
    })();

    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: '#F0F4F8' }}>
        <Sidebar
          currentPage={page}
          navigate={navigate}
          role={role}
          userName={userName}
          userRole={userRole}
        />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {pageContent}
        </div>
      </div>
    );
  };

  // ── Render modals ────────────────────────────────────
  const renderModal = () => {
    switch (modal) {
      case 'forgot-password':
        return <ForgotPasswordModal onClose={closeModal} />;

      case 'edit-activity':
        return (
          <EditActivityModal
            activity={activities.find(a => a.id === (navParams.activityId || 1))}
            onClose={closeModal}
            onSave={updated => {
              setActivities(as => as.map(a => a.id === (navParams.activityId || 1) ? { ...a, ...updated } : a));
            }}
          />
        );

      case 'reg-success':
        return (
          <RegistrationSuccessModal
            activityTitle={activities.find(a => a.id === navParams.activityId)?.title || 'Activity'}
            onClose={closeModal}
          />
        );

      case 'reg-closed':
        return (
          <RegistrationClosedModal onClose={closeModal} isFull={true} />
        );

      case 'create-activity-success':
        return (
          <CreateActivitySuccessModal
            onViewActivity={() => navigate('activity-detail', { activityId: 1 })}
            onBackToList={() => navigate('activities')}
          />
        );

      case 'transaction-saved':
        return <TransactionSavedModal onBackToFinance={() => navigate('finance')} />;

      case 'announcement-published':
        return <AnnouncementPublishedModal onClose={closeModal} />;

      case 'announcement-detail':
        return <AnnouncementDetailModal announcement={modalData} onClose={closeModal} />;

      case 'notifications':
        return <NotificationPanel announcements={announcements} onClose={closeModal} navigate={navigate} />;

      case 'participants-list':
        return (
          <ParticipantsListModal
            participants={[
              { id: 1, name: 'Ahmad Faris', matric: 'A23CS0001', initials: 'AF', date: '10 Feb 2025', status: 'Present' },
              { id: 2, name: 'Nurul Ain', matric: 'A23CS0002', initials: 'NA', date: '11 Feb 2025', status: 'Present' },
              { id: 3, name: 'Muhammad Haziq', matric: 'A23CS0003', initials: 'MH', date: '11 Feb 2025', status: 'Absent' },
              { id: 4, name: 'Siti Rahmah', matric: 'A23CS0004', initials: 'SR', date: '12 Feb 2025', status: 'Present' },
              { id: 5, name: 'Amir Zulkifli', matric: 'A23CS0005', initials: 'AZ', date: '13 Feb 2025', status: null },
              { id: 6, name: 'Farah Nadia', matric: 'A23CS0006', initials: 'FN', date: '13 Feb 2025', status: 'Present' },
            ]}
            activityTitle={activities.find(a => a.id === (navParams.activityId || 1))?.title || 'Activity'}
            onClose={closeModal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderPage()}
      {renderModal()}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SoFeaApp />);

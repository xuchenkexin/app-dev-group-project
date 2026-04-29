// SoFea — All modal overlays

const ModalOverlay = ({ onClose, children, width = 460 }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 24, boxSizing: 'border-box',
  }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: '#fff', borderRadius: 16, width: '100%', maxWidth: width,
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)', animation: 'modalIn 0.2s ease',
      maxHeight: '90vh', overflowY: 'auto',
    }}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, onClose }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 0',
  }}>
    <div style={{ fontSize: 15, fontWeight: 600, color: '#0C447C' }}>{title}</div>
    <button onClick={onClose} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#6888A0', padding: 4, display: 'flex', borderRadius: 6,
    }}>
      <Icon name="x" size={18} />
    </button>
  </div>
);

const ModalBody = ({ children }) => (
  <div style={{ padding: '16px 24px' }}>{children}</div>
);

const ModalFooter = ({ children }) => (
  <div style={{
    padding: '12px 24px 20px',
    display: 'flex', gap: 8, justifyContent: 'flex-end',
  }}>{children}</div>
);

// Success icon
const SuccessIcon = () => (
  <div style={{
    width: 56, height: 56, borderRadius: '50%',
    background: '#EAF3DE', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 16px',
  }}>
    <Icon name="check" size={28} color="#27500A" />
  </div>
);

// ── Forgot Password Modal ──────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState('');

  const handleSend = () => {
    if (!email) { setErr('Please enter your email address.'); return; }
    setSent(true);
  };

  return (
    <ModalOverlay onClose={onClose} width={400}>
      <ModalHeader title="Forgot Password" onClose={onClose} />
      <ModalBody>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <SuccessIcon />
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1A2A3A' }}>Reset link sent!</div>
            <div style={{ fontSize: 13, color: '#6888A0', marginTop: 6 }}>
              Check your email inbox for instructions to reset your password.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: '#6888A0', marginBottom: 16 }}>
              Enter your email address and we'll send you a reset link.
            </div>
            <FormField label="Email Address" error={err}>
              <SofInput
                type="email" placeholder="you@university.edu.my"
                value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
                error={!!err}
              />
            </FormField>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {sent ? (
          <PrimaryBtn onClick={onClose} style={{ width: '100%' }}>Back to Login</PrimaryBtn>
        ) : (
          <>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: '#185FA5',
              fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>Back to Login</button>
            <PrimaryBtn onClick={handleSend}>Send Reset Link</PrimaryBtn>
          </>
        )}
      </ModalFooter>
    </ModalOverlay>
  );
};

// ── Edit Activity Modal ────────────────────────────────
const EditActivityModal = ({ activity, onClose, onSave }) => {
  const [form, setForm] = React.useState({
    title: activity?.title || '',
    date: activity?.date || '',
    time: activity?.time || '',
    venue: activity?.venue || '',
    maxSlots: activity?.maxSlots || '',
    description: activity?.description || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <ModalOverlay onClose={onClose} width={520}>
      <ModalHeader title="Edit Activity" onClose={onClose} />
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Activity Name">
            <SofInput value={form.title} onChange={e => set('title', e.target.value)} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date">
              <SofInput type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </FormField>
            <FormField label="Time">
              <SofInput type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Venue">
              <SofInput value={form.venue} onChange={e => set('venue', e.target.value)} />
            </FormField>
            <FormField label="Max Slots">
              <SofInput type="number" value={form.maxSlots} onChange={e => set('maxSlots', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Description">
            <SofTextarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
          </FormField>
        </div>
      </ModalBody>
      <ModalFooter>
        <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
        <PrimaryBtn onClick={() => { onSave && onSave(form); onClose(); }}>Save Changes</PrimaryBtn>
      </ModalFooter>
    </ModalOverlay>
  );
};

// ── Registration Success Modal ─────────────────────────
const RegistrationSuccessModal = ({ activityTitle, onClose }) => (
  <ModalOverlay onClose={onClose} width={380}>
    <ModalBody>
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <SuccessIcon />
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2A3A' }}>Registered Successfully!</div>
        <div style={{ fontSize: 13, color: '#6888A0', marginTop: 8 }}>
          You have registered for <strong>{activityTitle}</strong>.
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <PrimaryBtn onClick={onClose} style={{ width: '100%' }}>Close</PrimaryBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Registration Closed Modal ──────────────────────────
const RegistrationClosedModal = ({ onClose, isFull }) => (
  <ModalOverlay onClose={onClose} width={380}>
    <ModalBody>
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#FCEBEB', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Icon name="x" size={28} color="#791F1F" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2A3A' }}>
          {isFull ? 'Activity is Full' : 'Registration Closed'}
        </div>
        <div style={{ fontSize: 13, color: '#6888A0', marginTop: 8 }}>
          {isFull
            ? 'All slots have been filled. Please check other activities.'
            : 'Registration for this activity is no longer available.'}
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <OutlineBtn onClick={onClose} style={{ width: '100%' }}>Close</OutlineBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Create Activity Success Modal ──────────────────────
const CreateActivitySuccessModal = ({ onViewActivity, onBackToList }) => (
  <ModalOverlay onClose={onBackToList} width={380}>
    <ModalBody>
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <SuccessIcon />
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2A3A' }}>Activity Created!</div>
        <div style={{ fontSize: 13, color: '#6888A0', marginTop: 8 }}>
          Your new activity has been created successfully.
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <OutlineBtn onClick={onBackToList}>Back to List</OutlineBtn>
      <PrimaryBtn onClick={onViewActivity}>View Activity</PrimaryBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Transaction Saved Modal ────────────────────────────
const TransactionSavedModal = ({ onBackToFinance }) => (
  <ModalOverlay onClose={onBackToFinance} width={380}>
    <ModalBody>
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <SuccessIcon />
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2A3A' }}>Transaction Saved!</div>
        <div style={{ fontSize: 13, color: '#6888A0', marginTop: 8 }}>
          The transaction has been recorded successfully.
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <PrimaryBtn onClick={onBackToFinance} style={{ width: '100%' }}>Back to Finance</PrimaryBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Announcement Published Modal ───────────────────────
const AnnouncementPublishedModal = ({ onClose }) => (
  <ModalOverlay onClose={onClose} width={400}>
    <ModalBody>
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <SuccessIcon />
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2A3A' }}>Announcement Published!</div>
        <div style={{ fontSize: 13, color: '#6888A0', marginTop: 8 }}>
          Notifications have been sent to all selected users.
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <PrimaryBtn onClick={onClose} style={{ width: '100%' }}>OK</PrimaryBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Announcement Detail Modal ──────────────────────────
const AnnouncementDetailModal = ({ announcement, onClose }) => (
  <ModalOverlay onClose={onClose} width={520}>
    <ModalHeader title={announcement?.title} onClose={onClose} />
    <ModalBody>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
        <Badge label={announcement?.audience} />
        <span style={{ fontSize: 12, color: '#8AA0B0' }}>{announcement?.date}</span>
      </div>
      <Divider style={{ marginBottom: 14 }} />
      <p style={{ fontSize: 13, color: '#1A2A3A', lineHeight: 1.7, margin: 0 }}>
        {announcement?.content}
      </p>
    </ModalBody>
    <ModalFooter>
      <OutlineBtn onClick={onClose}>Close</OutlineBtn>
    </ModalFooter>
  </ModalOverlay>
);

// ── Notification Panel ─────────────────────────────────
const NotificationPanel = ({ announcements, onClose, navigate }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 1000,
  }} onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: 360,
      background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '20px 20px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '0.5px solid #D0DDE8',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#0C447C' }}>Notifications</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6888A0' }}>
          <Icon name="x" size={18} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {announcements.filter(a => a.unread).map(a => (
          <button key={a.id} onClick={() => { onClose(); navigate('announcements'); }} style={{
            display: 'flex', gap: 12, padding: '14px 20px',
            borderBottom: '0.5px solid #F0F4F8', background: 'none',
            border: 'none', borderBottomColor: '#F0F4F8', cursor: 'pointer',
            textAlign: 'left', width: '100%', borderBottomWidth: '0.5px',
            borderBottomStyle: 'solid',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#185FA5', flexShrink: 0, marginTop: 4 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2A3A' }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#6888A0', marginTop: 3 }}>{a.preview}</div>
              <div style={{ fontSize: 11, color: '#8AA0B0', marginTop: 4 }}>{a.date}</div>
            </div>
          </button>
        ))}
        {announcements.filter(a => a.unread).length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#8AA0B0', fontSize: 13 }}>
            No unread notifications
          </div>
        )}
      </div>
    </div>
  </div>
);

// ── Participants List Modal ────────────────────────────
const ParticipantsListModal = ({ participants, activityTitle, onClose }) => (
  <ModalOverlay onClose={onClose} width={500}>
    <ModalHeader title={`Participants — ${activityTitle}`} onClose={onClose} />
    <ModalBody>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {participants.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: '0.5px solid #F0F4F8',
          }}>
            <Avatar initials={p.initials} size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2A3A' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#8AA0B0' }}>{p.matric} · Registered {p.date}</div>
            </div>
            {p.status && <Badge label={p.status} />}
          </div>
        ))}
      </div>
    </ModalBody>
    <ModalFooter>
      <OutlineBtn onClick={onClose}>Close</OutlineBtn>
    </ModalFooter>
  </ModalOverlay>
);

Object.assign(window, {
  ModalOverlay, ModalHeader, ModalBody, ModalFooter,
  ForgotPasswordModal, EditActivityModal,
  RegistrationSuccessModal, RegistrationClosedModal,
  CreateActivitySuccessModal, TransactionSavedModal,
  AnnouncementPublishedModal, AnnouncementDetailModal,
  NotificationPanel, ParticipantsListModal,
});

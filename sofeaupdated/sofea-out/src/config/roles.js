export const ROLE_ROUTES = {
  sa_advisor:     ['/', '/dashboard', '/activities', '/checkin', '/finance', '/announcements', '/users', '/audit'],
  high_committee: ['/', '/dashboard', '/activities', '/checkin', '/finance', '/announcements'],
}

export const ROLE_PERMISSIONS = {
  sa_advisor: {
    canCreateActivity:     true,
    canEditActivity:       true,
    canRegisterActivity:   false,
    canGenerateCheckinCode: true,
    canMarkAttendance:     false,
    canViewAttendanceList: true,
    canRecordTransaction:  true,
    canCreateAnnouncement: true,
    canManageUsers:        true,
    canViewAudit:          true,
    canExportAudit:        true,
  },
  high_committee: {
    canCreateActivity:     false,
    canEditActivity:       false,
    canRegisterActivity:   true,
    canGenerateCheckinCode: false,
    canMarkAttendance:     false,
    canViewAttendanceList: false,
    canRecordTransaction:  true,
    canCreateAnnouncement: false,
    canManageUsers:        false,
    canViewAudit:          false,
    canExportAudit:        false,
  },
}

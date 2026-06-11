-- ============================================================
--  SoFea Management System — Complete Database Schema + Seed
--  Database : sofea_db
--  Charset  : utf8mb4
--  All test accounts use password: password123
-- ============================================================

CREATE DATABASE IF NOT EXISTS sofea_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sofea_db;

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password      VARCHAR(255)    NOT NULL,
  role          ENUM('sa_advisor','high_committee') NOT NULL DEFAULT 'high_committee',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 2. activities
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title            VARCHAR(200)  NOT NULL,
  description      TEXT,
  date             DATE          NOT NULL,
  venue            VARCHAR(200)  NOT NULL,
  status           ENUM('open','closed','cancelled') NOT NULL DEFAULT 'open',
  max_participants INT UNSIGNED  DEFAULT NULL,
  created_by       INT UNSIGNED  DEFAULT NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 3. registrations
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  activity_id   INT UNSIGNED  NOT NULL,
  user_id       INT UNSIGNED  NOT NULL,
  status        ENUM('registered','cancelled') NOT NULL DEFAULT 'registered',
  registered_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_activity_user (activity_id, user_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 4. attendance
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  registration_id INT UNSIGNED  NOT NULL UNIQUE,
  status          ENUM('present','absent') NOT NULL DEFAULT 'present',
  marked_by       INT UNSIGNED  DEFAULT NULL,
  marked_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by)       REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 5. transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  type        ENUM('income','expense') NOT NULL,
  amount      DECIMAL(12,2)   NOT NULL,
  description TEXT,
  activity_id INT UNSIGNED    DEFAULT NULL,
  recorded_by INT UNSIGNED    DEFAULT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id)      ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 6. audit_reports
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_reports (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title        VARCHAR(200)  NOT NULL,
  content      LONGTEXT      NOT NULL,
  generated_by INT UNSIGNED  DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 7. announcements
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title      VARCHAR(200)  NOT NULL,
  content    TEXT          NOT NULL,
  created_by INT UNSIGNED  DEFAULT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 8. notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  message    TEXT          NOT NULL,
  is_read    TINYINT(1)    NOT NULL DEFAULT 0,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- SAMPLE DATA
-- All passwords are: password123
-- Hash: $2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u
-- ============================================================

-- ── users ────────────────────────────────────────────────────
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Ahmad Faris',   'ahmad.faris@sofea.edu.my',   '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'sa_advisor',     '2025-01-05 08:00:00'),
(2, 'Nurul Ain',     'nurul.ain@sofea.edu.my',     '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'sa_advisor',     '2025-01-06 09:00:00'),
(3, 'Hafiz Rahim',   'hafiz.rahim@sofea.edu.my',   '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-01-10 10:00:00'),
(4, 'Siti Nabilah',  'siti.nabilah@sofea.edu.my',  '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-01-12 10:30:00'),
(5, 'Amirul Hakim',  'amirul.hakim@sofea.edu.my',  '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-01-15 11:00:00'),
(6, 'Farah Nadia',   'farah.nadia@sofea.edu.my',   '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-01-18 11:30:00'),
(7, 'Zulaikha Yusof','zulaikha.yusof@sofea.edu.my','$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-02-01 09:00:00'),
(8, 'Danial Irfan',  'danial.irfan@sofea.edu.my',  '$2a$10$mCg3qTWTKmJuweiAQozGfOa0dQ0QUgLJI.A3XGnNrUxz.uhEcBj6u', 'high_committee', '2025-02-05 09:30:00');

-- ── activities ───────────────────────────────────────────────
INSERT INTO activities (id, title, description, date, venue, status, max_participants, created_by, created_at) VALUES
(1, 'Orientation Week 2025',
   'Welcome programme for new high committee members. Includes icebreakers, goal-setting sessions, and a campus tour.',
   '2025-03-10', 'Dewan Utama, Block A', 'closed', 80, 1, '2025-02-20 10:00:00'),

(2, 'Community Clean-Up Drive',
   'Monthly community service initiative to clean the surrounding neighbourhood and campus grounds.',
   '2025-04-05', 'Main Entrance Carpark', 'closed', 50, 1, '2025-03-15 09:00:00'),

(3, 'Leadership Workshop — Semester 1',
   'Half-day interactive workshop covering leadership styles, conflict resolution, and team dynamics.',
   '2025-05-17', 'Seminar Room 3, Block B', 'closed', 40, 2, '2025-04-25 14:00:00'),

(4, 'Annual Charity Dinner 2025',
   'Fundraising dinner to support underprivileged students. Dress code: smart casual.',
   '2025-06-28', 'Grand Ballroom, Student Centre', 'open', 150, 1, '2025-05-30 11:00:00'),

(5, 'Sports Day 2025',
   'Inter-department sports competition featuring futsal, badminton, and 4x100m relay.',
   '2025-07-12', 'Sports Complex, Block D', 'open', 200, 2, '2025-06-01 10:00:00'),

(6, 'Financial Literacy Talk',
   'Guest speaker session on personal budgeting, investment basics, and student loan management.',
   '2025-07-25', 'Lecture Hall LT-01', 'open', 100, 1, '2025-06-20 09:00:00'),

(7, 'Hari Raya Celebration',
   'Cultural celebration for all members to experience traditional Malay customs and food.',
   '2025-04-20', 'Multipurpose Hall', 'cancelled', 120, 2, '2025-03-28 08:30:00');

-- ── registrations ────────────────────────────────────────────
INSERT INTO registrations (id, activity_id, user_id, status, registered_at) VALUES
-- Activity 1: Orientation (closed)
(1,  1, 3, 'registered', '2025-02-22 08:00:00'),
(2,  1, 4, 'registered', '2025-02-23 09:15:00'),
(3,  1, 5, 'registered', '2025-02-24 10:00:00'),
(4,  1, 6, 'registered', '2025-02-24 11:30:00'),
(5,  1, 7, 'registered', '2025-02-25 14:00:00'),
(6,  1, 8, 'cancelled',  '2025-02-25 15:00:00'),
-- Activity 2: Clean-Up Drive (closed)
(7,  2, 3, 'registered', '2025-03-17 09:00:00'),
(8,  2, 4, 'registered', '2025-03-18 10:00:00'),
(9,  2, 5, 'registered', '2025-03-19 08:30:00'),
(10, 2, 7, 'registered', '2025-03-20 09:45:00'),
-- Activity 3: Leadership Workshop (closed)
(11, 3, 3, 'registered', '2025-04-28 11:00:00'),
(12, 3, 4, 'registered', '2025-04-29 09:00:00'),
(13, 3, 6, 'registered', '2025-04-30 14:00:00'),
(14, 3, 8, 'registered', '2025-05-01 10:00:00'),
-- Activity 4: Charity Dinner (open)
(15, 4, 3, 'registered', '2025-06-01 09:00:00'),
(16, 4, 4, 'registered', '2025-06-02 10:30:00'),
(17, 4, 5, 'registered', '2025-06-03 11:00:00'),
(18, 4, 6, 'registered', '2025-06-04 08:45:00'),
(19, 4, 7, 'registered', '2025-06-05 13:00:00'),
-- Activity 5: Sports Day (open)
(20, 5, 3, 'registered', '2025-06-10 09:00:00'),
(21, 5, 5, 'registered', '2025-06-11 10:00:00'),
(22, 5, 8, 'registered', '2025-06-12 11:30:00');

-- ── attendance ───────────────────────────────────────────────
INSERT INTO attendance (id, registration_id, status, marked_by, marked_at) VALUES
-- Activity 1 attendance
(1,  1,  'present', 1, '2025-03-10 09:00:00'),
(2,  2,  'present', 1, '2025-03-10 09:05:00'),
(3,  3,  'absent',  1, '2025-03-10 09:10:00'),
(4,  4,  'present', 1, '2025-03-10 09:12:00'),
(5,  5,  'present', 1, '2025-03-10 09:15:00'),
-- Activity 2 attendance
(6,  7,  'present', 1, '2025-04-05 08:30:00'),
(7,  8,  'present', 1, '2025-04-05 08:35:00'),
(8,  9,  'present', 1, '2025-04-05 08:40:00'),
(9,  10, 'absent',  1, '2025-04-05 08:45:00'),
-- Activity 3 attendance
(10, 11, 'present', 2, '2025-05-17 09:00:00'),
(11, 12, 'present', 2, '2025-05-17 09:05:00'),
(12, 13, 'present', 2, '2025-05-17 09:10:00'),
(13, 14, 'absent',  2, '2025-05-17 09:15:00');

-- ── transactions ─────────────────────────────────────────────
INSERT INTO transactions (id, type, amount, description, activity_id, recorded_by, created_at) VALUES
-- Income
(1,  'income',  500.00,  'Membership dues — Semester 1 2025',              NULL, 1, '2025-01-20 10:00:00'),
(2,  'income',  1200.00, 'Sponsorship from Campus Bookstore',               NULL, 1, '2025-02-14 11:00:00'),
(3,  'income',  350.00,  'Ticket sales — Orientation Week',                 1,    1, '2025-03-10 17:00:00'),
(4,  'income',  800.00,  'Donation — Community Clean-Up Drive',             2,    1, '2025-04-05 18:00:00'),
(5,  'income',  2500.00, 'Charity Dinner ticket sales (pre-registration)',  4,    1, '2025-06-10 14:00:00'),
(6,  'income',  300.00,  'Merchandise sales — SoFea merchandise booth',    NULL, 2, '2025-05-20 15:00:00'),
-- Expenses
(7,  'expense', 280.00,  'Printing — banners and brochures for Orientation', 1,  1, '2025-03-08 09:00:00'),
(8,  'expense', 450.00,  'Refreshments — Orientation Week',                  1,  1, '2025-03-10 12:00:00'),
(9,  'expense', 120.00,  'Cleaning supplies — Clean-Up Drive',               2,  1, '2025-04-04 10:00:00'),
(10, 'expense', 600.00,  'Workshop facilitator fee — Leadership Workshop',   3,  2, '2025-05-17 08:00:00'),
(11, 'expense', 200.00,  'Stationery and module printing — Leadership',      3,  2, '2025-05-15 14:00:00'),
(12, 'expense', 1800.00, 'Venue deposit — Charity Dinner',                   4,  1, '2025-06-01 09:00:00'),
(13, 'expense', 95.00,   'Office supplies — Q1 2025',                       NULL, 1, '2025-03-31 16:00:00'),
(14, 'expense', 180.00,  'Transportation reimbursement — April events',     NULL, 2, '2025-04-30 17:00:00');

-- ── audit_reports ────────────────────────────────────────────
INSERT INTO audit_reports (id, title, content, generated_by, created_at) VALUES
(1, 'Q1 2025 Financial Audit Report',
   'SOFEA MANAGEMENT SYSTEM — Q1 2025 FINANCIAL AUDIT\n\nPeriod: 1 January 2025 – 31 March 2025\nPrepared by: Ahmad Faris (SA Advisor)\n\nSUMMARY\nTotal Income  : RM 2,350.00\nTotal Expenses: RM 1,773.00\nNet Balance   : RM 577.00\n\nINCOME BREAKDOWN\n- Membership dues (Jan): RM 500.00\n- Sponsorship (Feb):     RM 1,200.00\n- Orientation tickets:   RM 350.00\n- Merchandise sales:     RM 300.00\n\nEXPENSE BREAKDOWN\n- Orientation banners/print: RM 280.00\n- Orientation refreshments:  RM 450.00\n- Office supplies (Mar):     RM 95.00\n- Transportation (Apr):      RM 180.00 (accrual)\n- Clean-up supplies:         RM 120.00 (accrual)\n\nCONCLUSION\nAll transactions verified against receipts. No discrepancies found.',
   1, '2025-04-02 10:00:00'),

(2, 'Activity Participation Report — Semester 1',
   'SOFEA MANAGEMENT SYSTEM — ACTIVITY PARTICIPATION REPORT\n\nPeriod: January 2025 – June 2025\nPrepared by: Nurul Ain (SA Advisor)\n\nACTIVITY SUMMARY\n1. Orientation Week (10 Mar): 5 registered, 4 present (80% attendance)\n2. Community Clean-Up (5 Apr): 4 registered, 3 present (75% attendance)\n3. Leadership Workshop (17 May): 4 registered, 3 present (75% attendance)\n\nOVERALL ATTENDANCE RATE: 77%\n\nRECOMMENDATIONS\n- Send reminder notifications 48 hours before each event.\n- Introduce attendance incentive programme for Q3.\n- Consider hybrid format for workshops to increase participation.',
   2, '2025-06-05 14:00:00');

-- ── announcements ────────────────────────────────────────────
INSERT INTO announcements (id, title, content, created_by, created_at) VALUES
(1, 'Welcome to SoFea 2025!',
   'Assalamualaikum and greetings to all members. The Student Affairs (SoFea) team would like to warmly welcome everyone to the 2025 academic year. We have an exciting lineup of activities planned — stay tuned for updates via this platform. Together, let us make this year impactful!',
   1, '2025-01-07 08:00:00'),

(2, 'Registration Open: Annual Charity Dinner 2025',
   'Registration for the Annual Charity Dinner 2025 is now OPEN. Date: 28 June 2025 | Venue: Grand Ballroom, Student Centre | Dress Code: Smart Casual. Proceeds go towards the Underprivileged Students Scholarship Fund. Seats are limited to 150 — register early to avoid disappointment!',
   1, '2025-06-01 09:00:00'),

(3, 'Sports Day 2025 — Team Registration',
   'Sports Day 2025 is happening on 12 July 2025 at the Sports Complex. We are looking for participants in Futsal, Badminton, and 4x100m Relay. Please form teams and register by 30 June 2025. Contact your committee head for the team registration form.',
   2, '2025-06-05 10:30:00'),

(4, 'Reminder: Leadership Workshop Certificates',
   'Congratulations to all who attended the Leadership Workshop on 17 May 2025. Your e-certificates have been processed and will be emailed within 7 working days. If you have not received yours by 1 June 2025, please contact the SA office.',
   2, '2025-05-25 14:00:00'),

(5, 'Important: Updated Meeting Schedule — June 2025',
   'Please note that the monthly committee meeting originally scheduled for 15 June has been rescheduled to 18 June 2025 at 3:00 PM in Meeting Room 2, Block B. Attendance is compulsory for all committee members. Please inform your section leaders accordingly.',
   1, '2025-06-08 11:00:00');

-- ── notifications ────────────────────────────────────────────
INSERT INTO notifications (id, user_id, message, is_read, created_at) VALUES
(1,  3, 'Your registration for "Orientation Week 2025" has been confirmed.',           1, '2025-02-22 08:01:00'),
(2,  4, 'Your registration for "Orientation Week 2025" has been confirmed.',           1, '2025-02-23 09:16:00'),
(3,  5, 'Your registration for "Orientation Week 2025" has been confirmed.',           1, '2025-02-24 10:01:00'),
(4,  3, 'Reminder: "Community Clean-Up Drive" is tomorrow at 8:00 AM.',               1, '2025-04-04 08:00:00'),
(5,  4, 'Reminder: "Community Clean-Up Drive" is tomorrow at 8:00 AM.',               1, '2025-04-04 08:00:00'),
(6,  3, 'Your attendance for "Orientation Week 2025" has been marked: Present.',       1, '2025-03-10 09:01:00'),
(7,  5, 'Your attendance for "Orientation Week 2025" has been marked: Absent.',        1, '2025-03-10 09:11:00'),
(8,  3, 'New announcement: "Registration Open: Annual Charity Dinner 2025"',           0, '2025-06-01 09:01:00'),
(9,  4, 'New announcement: "Registration Open: Annual Charity Dinner 2025"',           0, '2025-06-01 09:01:00'),
(10, 5, 'New announcement: "Registration Open: Annual Charity Dinner 2025"',           0, '2025-06-01 09:01:00'),
(11, 6, 'New announcement: "Registration Open: Annual Charity Dinner 2025"',           0, '2025-06-01 09:01:00'),
(12, 7, 'New announcement: "Registration Open: Annual Charity Dinner 2025"',           1, '2025-06-01 09:01:00'),
(13, 3, 'Your registration for "Annual Charity Dinner 2025" has been confirmed.',      0, '2025-06-01 09:01:00'),
(14, 4, 'Your registration for "Annual Charity Dinner 2025" has been confirmed.',      0, '2025-06-02 10:31:00'),
(15, 5, 'New announcement: "Sports Day 2025 — Team Registration"',                    0, '2025-06-05 10:31:00'),
(16, 6, 'New announcement: "Sports Day 2025 — Team Registration"',                    0, '2025-06-05 10:31:00'),
(17, 7, 'New announcement: "Sports Day 2025 — Team Registration"',                    0, '2025-06-05 10:31:00'),
(18, 8, 'New announcement: "Sports Day 2025 — Team Registration"',                    0, '2025-06-05 10:31:00'),
(19, 3, 'Reminder: "Sports Day 2025" registration closes in 7 days.',                 0, '2025-06-23 08:00:00'),
(20, 5, 'Your registration for "Sports Day 2025" has been confirmed.',                 0, '2025-06-11 10:01:00');

-- ============================================================
-- END OF SEED
-- ============================================================

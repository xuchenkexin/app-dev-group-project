# app-dev-group-project
# Application Development Project

## Team Members
- ZHANG YIHAN(leader)
- YANG DENGKAI
- XU CHENKEXIN

## Project Title
 SoFea Management System（Management Domain）

## Project Description 
This project aims to develop a  SoFea Management System to support daily administrative work, covering event coordination, financial control and other related business processes. 
By building an integrated management platform, it will standardize work processes, reduce repetitive manual operations, improve overall operational efficiency, and make various data easier to organize, store and query.
## System Prototype

Live Demo: waiting for deployment | [Source Code](sofeaupdated/sofea-out)
## Source Code

### Module to Frontend & Backend Script Mapping

#### Xu Chenkexin

| Module | Frontend | Backend |
|--------|----------|---------|
| Activity Management | [ActivitiesPage.jsx](sofeaupdated/sofea-out/src/pages/activities/ActivitiesPage.jsx) | [activityController.js](sofeaupdated/sofea-backend/src/controllers/activityController.js) / [activityModel.js](sofeaupdated/sofea-backend/src/models/activityModel.js) / [activities.js](sofeaupdated/sofea-backend/src/routes/activities.js) |
| Announcement Management | [AnnouncementsPage.jsx](sofeaupdated/sofea-out/src/pages/announcements/AnnouncementsPage.jsx) | [announcementController.js](sofeaupdated/sofea-backend/src/controllers/announcementController.js) / [announcementModel.js](sofeaupdated/sofea-backend/src/models/announcementModel.js) / [announcements.js](sofeaupdated/sofea-backend/src/routes/announcements.js) |

#### Zhang Yihan

| Module | Frontend | Backend |
|--------|----------|---------|
| Authentication | [LoginPage.jsx](sofeaupdated/sofea-out/src/pages/LoginPage.jsx) | [authController.js](sofeaupdated/sofea-backend/src/controllers/authController.js) / [userModel.js](sofeaupdated/sofea-backend/src/models/userModel.js) / [auth.js](sofeaupdated/sofea-backend/src/routes/auth.js) |
| User Management & Dashboard | [UsersPage.jsx](sofeaupdated/sofea-out/src/pages/users/UsersPage.jsx) / [Dashboard.jsx](sofeaupdated/sofea-out/src/pages/Dashboard.jsx) | [registrationController.js](sofeaupdated/sofea-backend/src/controllers/registrationController.js) / [dashboardController.js](sofeaupdated/sofea-backend/src/controllers/dashboardController.js) / [users.js](sofeaupdated/sofea-backend/src/routes/users.js) / [dashboard.js](sofeaupdated/sofea-backend/src/routes/dashboard.js) |

#### Yang Dengkai

| Module | Frontend | Backend |
|--------|----------|---------|
| Financial Management | [FinancePage.jsx](sofeaupdated/sofea-out/src/pages/finance/FinancePage.jsx) | [financialController.js](sofeaupdated/sofea-backend/src/controllers/financialController.js) <br> [transactionModel.js](sofeaupdated/sofea-backend/src/models/transactionModel.js) <br> [financial.js](sofeaupdated/sofea-backend/src/routes/financial.js) |
| Attendance / Check-in | [CheckinPage.jsx](sofeaupdated/sofea-out/src/pages/checkin/CheckinPage.jsx) | [attendanceController.js](sofeaupdated/sofea-backend/src/controllers/attendanceController.js) <br> [attendanceModel.js](sofeaupdated/sofea-backend/src/models/attendanceModel.js) <br> [attendance.js](sofeaupdated/sofea-backend/src/routes/attendance.js) <br> [checkin.js](sofeaupdated/sofea-backend/src/routes/checkin.js) |
| Audit | [AuditPage.jsx](sofeaupdated/sofea-out/src/pages/audit/AuditPage.jsx) | — |



## Company Profile 

### Background 
It is an organization responsible for managing activities, financial records, and daily administrative tasks.  

Currently, these tasks are often done manually or using different platforms, which leads to low efficiency and makes management difficult.  

---

### Vision 
Improve the efficiency and organization of the management process.  

---

### Mission 
- Manage activities and financial records in one system  

- Reduce manual operations  

- Improve data organization  

---

### Services 
- Event Management 
- Financial Management  
- Record Management 

## Project Structure
- Proposal
- Requirement
- Design
- Prototype

## Progress
- Team formed
- GitHub repository created
- Members added as collaborators
- Waiting for project topic

### Pre-SDLC Findings

#### Similar Systems

1. Event Management System 
This system is used to manage events, including registration, scheduling, and coordination.  

2. Google Drive
This system is used to store and share files online.   

---

#### Advantages

Event Management System:  
- Helps manage event information in one place  

- Supports scheduling and coordination  

Google Drive:  
- Easy to use  

- Accessible anywhere  

---

#### Disadvantages

Event Management System:  
- Focus only on events  

- Does not include financial management   

Google Drive:  
- Only for file storage  

- Not suitable for full management system  

- No workflow or automation  

---

#### Our Improvement

- Combine event management and financial management in one system  

- Provide a more complete management platform  

- Improve efficiency by reducing manual work  

- Make data easier to manage and track

  ### Initial Framework

---

#### Who Will Use the System 
- Administrative staff  

- Event organizers  

- Finance staff   

- Students or users  
---

#### System Idea
The system will be a web-based platform where users can manage activities, financial records, and administrative tasks in one place.   

Users can log in to the system, create activities, record financial data, and view information easily.  

The system will help improve efficiency and reduce manual work.  


# 🏗️ System Architecture

## Overview

The Student Reminder System follows a modern three-tier architecture with automated scheduling capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite + Tailwind)                 │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Students │  │Attendance│  │   Fees   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────┐  ┌──────────┐                                 │
│  │Reminders │  │  Login   │                                 │
│  └──────────┘  └──────────┘                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
                        │ (Axios)
┌───────────────────────▼─────────────────────────────────────┐
│                         BACKEND                              │
│                    (Node.js + Express)                       │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API Routes Layer                       │     │
│  │  /api/auth  /api/students  /api/attendance         │     │
│  │  /api/fees  /api/reminders                         │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Business Logic Layer                      │     │
│  │  • Authentication (JWT)                             │     │
│  │  • Attendance Calculation                           │     │
│  │  • Fee Tracking                                     │     │
│  │  • Email Notifications                              │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Cron Scheduler (node-cron)                │     │
│  │  • Weekly Attendance Reminders (Mon 9 AM)           │     │
│  │  • Monthly Fee Reminders (1st, 15th, 25th)         │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DATABASE   │ │    EMAIL     │ │     AUTH     │
│  (Supabase)  │ │ (Nodemailer) │ │    (JWT)     │
│              │ │              │ │              │
│ • students   │ │ • SMTP       │ │ • Token      │
│ • attendance │ │ • Gmail      │ │ • Verify     │
│ • fees       │ │ • Templates  │ │ • Refresh    │
│ • admins     │ │              │ │              │
│ • logs       │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Component Details

### Frontend Layer

**Technology Stack:**
- React 18 (UI Framework)
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Router (Navigation)
- Axios (HTTP Client)
- React Hot Toast (Notifications)

**Key Components:**
1. **Dashboard**: Overview statistics and quick actions
2. **Students**: CRUD operations for student management
3. **Attendance**: Track and monitor attendance records
4. **Fees**: Manage fee payments and pending amounts
5. **Reminders**: Manual trigger for email notifications
6. **Login**: Authentication interface

### Backend Layer

**Technology Stack:**
- Node.js (Runtime)
- Express.js (Web Framework)
- Supabase Client (Database)
- Nodemailer (Email Service)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- node-cron (Task Scheduling)

**API Structure:**
```
/api
├── /auth
│   ├── POST /login
│   └── GET /verify
├── /students
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── /attendance
│   ├── GET /
│   ├── GET /student/:id
│   ├── GET /low-attendance
│   └── POST /
├── /fees
│   ├── GET /
│   ├── GET /student/:id
│   ├── GET /pending
│   ├── POST /
│   └── PUT /:id
└── /reminders
    ├── POST /attendance
    ├── POST /fees
    └── GET /logs
```

### Database Layer (Supabase/PostgreSQL)

**Schema:**

```sql
students
├── id (UUID, PK)
├── student_id (VARCHAR, UNIQUE)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── phone (VARCHAR)
├── parent_email (VARCHAR)
├── parent_phone (VARCHAR)
├── department (VARCHAR)
├── semester (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

attendance
├── id (UUID, PK)
├── student_id (UUID, FK → students)
├── date (DATE)
├── status (ENUM: present, absent, late)
├── subject (VARCHAR)
├── remarks (TEXT)
└── created_at (TIMESTAMP)

fees
├── id (UUID, PK)
├── student_id (UUID, FK → students)
├── amount (DECIMAL)
├── paid_amount (DECIMAL)
├── due_date (DATE)
├── status (ENUM: pending, partial, paid)
├── fee_type (VARCHAR)
├── semester (INTEGER)
├── academic_year (VARCHAR)
├── payment_date (DATE)
├── transaction_id (VARCHAR)
├── remarks (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

admins
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, HASHED)
├── role (VARCHAR)
└── created_at (TIMESTAMP)

reminder_logs
├── id (UUID, PK)
├── student_id (UUID, FK → students)
├── type (ENUM: attendance, fee)
├── sent_at (TIMESTAMP)
└── status (VARCHAR)
```

## Data Flow

### 1. Student Management Flow
```
User Action → Frontend Form → API Request → Backend Validation
→ Database Insert/Update → Response → UI Update
```

### 2. Attendance Tracking Flow
```
Mark Attendance → API Call → Calculate Percentage
→ Check Threshold (75%) → Update Database
→ Flag Low Attendance → Return Stats
```

### 3. Fee Management Flow
```
Create Fee Record → Store in Database → Track Payments
→ Calculate Pending → Check Due Date
→ Flag Overdue → Return Status
```

### 4. Automated Reminder Flow
```
Cron Trigger → Fetch Eligible Students
→ Generate Email Content → Send via SMTP
→ Log Activity → Update Status
```

## Security Architecture

### Authentication Flow
```
Login Request → Validate Credentials → Hash Password Check
→ Generate JWT Token → Return Token
→ Store in LocalStorage → Include in API Headers
→ Verify Token Middleware → Grant Access
```

### Security Measures
- JWT-based authentication
- Password hashing with bcryptjs
- Environment variable protection
- CORS configuration
- Input validation
- SQL injection prevention (Supabase)
- XSS protection

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Database connection pooling
- Load balancer ready
- Containerized deployment (Docker)

### Vertical Scaling
- Efficient database queries
- Indexed columns
- Pagination support
- Caching strategies

### Performance Optimization
- Frontend code splitting
- Lazy loading components
- API response compression
- Database query optimization
- CDN for static assets

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel (Frontend)                   │
│  • Static hosting                                │
│  • CDN distribution                              │
│  • Automatic HTTPS                               │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 │
┌────────────────▼────────────────────────────────┐
│         Railway/Render (Backend)                 │
│  • Node.js runtime                               │
│  • Automatic deployments                         │
│  • Environment variables                         │
│  • Cron job execution                            │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼──────┐
│   Supabase   │  │    Gmail    │
│  (Database)  │  │   (SMTP)    │
└──────────────┘  └─────────────┘
```

## Monitoring & Logging

### Application Logs
- API request/response logs
- Error tracking
- Cron job execution logs
- Email delivery status

### Database Monitoring
- Query performance
- Connection pool status
- Storage usage
- Backup status

### Email Monitoring
- Delivery success rate
- Bounce tracking
- Open rates (optional)

## Future Enhancements

1. **SMS Integration**: Add SMS notifications via Twilio
2. **Mobile App**: React Native mobile application
3. **Analytics Dashboard**: Advanced reporting and charts
4. **Bulk Operations**: Import/export via CSV
5. **Multi-language**: i18n support
6. **Role-based Access**: Multiple admin levels
7. **Payment Gateway**: Online fee payment
8. **Biometric Integration**: Fingerprint attendance
9. **Parent Portal**: Separate parent login
10. **AI Predictions**: Attendance and performance predictions

---

This architecture ensures scalability, maintainability, and security while providing a robust foundation for future enhancements.
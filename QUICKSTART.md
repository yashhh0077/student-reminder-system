# ⚡ Quick Start Guide

Get the Student Reminder System running in 10 minutes!

## 🎯 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Gmail account

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yashhh0077/student-reminder-system.git
cd student-reminder-system
```

### 2. Setup Database

1. Go to [supabase.com](https://supabase.com) and create a project
2. Copy the SQL from `database/schema.sql`
3. Paste in Supabase SQL Editor and run
4. Note your Project URL and API Key

### 3. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_random_secret_string
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Get Gmail App Password:**
1. Enable 2FA on Gmail
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use the 16-character code

Start backend:
```bash
npm start
```

Backend runs at `http://localhost:5000`

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## 🎉 First Login

1. Open `http://localhost:3000`
2. Login with:
   - **Email**: admin@school.com
   - **Password**: admin123
3. **Change password immediately!**

## 🚀 Quick Test

### Add a Student
1. Go to "Students" tab
2. Click "Add Student"
3. Fill in details:
   - Student ID: ST001
   - Name: John Doe
   - Email: john@example.com
   - Parent Email: parent@example.com
   - Department: Computer Science
   - Semester: 1

### Mark Attendance
1. Go to "Attendance" tab
2. Mark some attendance records
3. Check if student appears in low attendance list

### Create Fee Record
1. Go to "Fees" tab
2. Create a fee record
3. Check pending fees list

### Send Reminders
1. Go to "Reminders" tab
2. Click "Send Attendance Reminders"
3. Check email inbox

## 📊 Features Overview

| Feature | Description |
|---------|-------------|
| Dashboard | Real-time stats and quick actions |
| Students | Add, edit, delete student records |
| Attendance | Track attendance, identify low performers |
| Fees | Manage payments, track pending amounts |
| Reminders | Manual and automated email notifications |

## 🔄 Automated Reminders

Once running, the system automatically sends:

- **Monday 9 AM**: Attendance reminders
- **1st of month**: Fee reminders
- **15th of month**: Mid-month fee reminders
- **25th of month**: Final fee warnings

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is free
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Database connection error
- Verify Supabase URL and Key
- Check if schema is created
- Ensure project is active

### Email not sending
- Verify Gmail App Password
- Check 2FA is enabled
- Test with a different email

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API proxy in vite.config.js

## 📚 Next Steps

1. **Read Full Documentation**: Check `README.md`
2. **Deploy to Production**: Follow `DEPLOYMENT.md`
3. **Understand Architecture**: Review `ARCHITECTURE.md`
4. **Customize**: Modify code for your needs

## 🆘 Need Help?

- Check GitHub Issues
- Review error logs
- Test with sample data first
- Verify all environment variables

## 🎓 Sample Data

Want to test with sample data? Run this in Supabase SQL Editor:

```sql
-- Insert sample students
INSERT INTO students (student_id, name, email, phone, parent_email, department, semester) VALUES
('ST001', 'John Doe', 'john@example.com', '1234567890', 'parent1@example.com', 'Computer Science', 1),
('ST002', 'Jane Smith', 'jane@example.com', '1234567891', 'parent2@example.com', 'Electronics', 2),
('ST003', 'Bob Johnson', 'bob@example.com', '1234567892', 'parent3@example.com', 'Mechanical', 3);

-- Insert sample attendance (low attendance for ST001)
INSERT INTO attendance (student_id, date, status, subject) 
SELECT id, CURRENT_DATE - (n || ' days')::interval, 
  CASE WHEN random() < 0.6 THEN 'absent' ELSE 'present' END, 'Math'
FROM students, generate_series(1, 20) n
WHERE student_id = 'ST001';

-- Insert sample fees
INSERT INTO fees (student_id, amount, paid_amount, due_date, status, fee_type, semester, academic_year)
SELECT id, 50000, 0, CURRENT_DATE + interval '30 days', 'pending', 'Tuition Fee', 1, '2024-25'
FROM students;
```

---

**You're all set!** 🎉 Start managing your institution efficiently!
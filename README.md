# 🎓 Student Reminder System

An automated reminder system for educational institutions to manage student attendance and fee payments efficiently.

## ✨ Features

### 📊 Dashboard
- Real-time statistics overview
- Total students count
- Low attendance alerts (<75%)
- Pending fee payments tracking
- Quick action buttons

### 👥 Student Management
- Add, edit, and delete students
- Store student and parent contact information
- Department and semester tracking
- Comprehensive student profiles

### 📅 Attendance Tracking
- Monitor student attendance
- Automatic calculation of attendance percentage
- Identify students below 75% threshold
- Calculate required classes to meet minimum attendance

### 💰 Fee Management
- Track fee payments and pending amounts
- Multiple fee types support
- Due date monitoring
- Overdue payment alerts
- Payment history tracking

### 🔔 Automated Reminders
- **Attendance Reminders**: Weekly (Every Monday 9 AM)
- **Fee Reminders**: Monthly (1st and 15th at 10 AM)
- **Final Warnings**: Monthly (25th at 10 AM)
- Email notifications to students and parents

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **Supabase** (PostgreSQL database)
- **Nodemailer** for email notifications
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Heroicons** for icons
- **React Hot Toast** for notifications

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Supabase account
- Gmail account (for email notifications)

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create \`.env\` file:
\`\`\`env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
\`\`\`

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from \`database/schema.sql\`

5. Start the server:
\`\`\`bash
npm start
\`\`\`

### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open browser at \`http://localhost:3000\`

## 🗄️ Database Schema

### Tables
- **students**: Student information and contact details
- **attendance**: Daily attendance records
- **fees**: Fee payment tracking
- **admins**: Admin user accounts
- **reminder_logs**: Email reminder history

## 🔐 Default Admin Credentials

- **Email**: admin@school.com
- **Password**: admin123

⚠️ **Important**: Change these credentials after first login!

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in \`.env\` file

## 🚀 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: \`npm run build\`
4. Set output directory: \`dist\`
5. Deploy

## 📱 API Endpoints

### Authentication
- POST \`/api/auth/login\` - Admin login
- GET \`/api/auth/verify\` - Verify token

### Students
- GET \`/api/students\` - Get all students
- POST \`/api/students\` - Create student
- PUT \`/api/students/:id\` - Update student
- DELETE \`/api/students/:id\` - Delete student

### Attendance
- GET \`/api/attendance\` - Get all attendance
- GET \`/api/attendance/student/:id\` - Get student attendance
- GET \`/api/attendance/low-attendance\` - Get low attendance students
- POST \`/api/attendance\` - Mark attendance

### Fees
- GET \`/api/fees\` - Get all fees
- GET \`/api/fees/student/:id\` - Get student fees
- GET \`/api/fees/pending\` - Get pending fees
- POST \`/api/fees\` - Create fee record
- PUT \`/api/fees/:id\` - Update fee payment

### Reminders
- POST \`/api/reminders/attendance\` - Send attendance reminders
- POST \`/api/reminders/fees\` - Send fee reminders
- GET \`/api/reminders/logs\` - Get reminder logs

## 🎯 Usage

1. **Login** with admin credentials
2. **Add Students** with their details
3. **Mark Attendance** regularly
4. **Create Fee Records** for each semester
5. **Send Reminders** manually or let automation handle it
6. **Monitor Dashboard** for quick insights

## 🔄 Automated Workflows

The system automatically:
- Calculates attendance percentages
- Identifies students below 75% attendance
- Tracks overdue fee payments
- Sends scheduled email reminders
- Logs all reminder activities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your institution!

## 👨‍💻 Author

Created with ❤️ by Bhindi AI

## 🐛 Issues

Found a bug? Please open an issue on GitHub.

## 📞 Support

For support, email support@yourinstitution.com

---

**Note**: This system is designed for educational institutions to maintain discipline and regularity among students through automated reminders for attendance and fee management.
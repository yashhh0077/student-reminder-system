# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Supabase account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- Gmail account with App Password

## Step 1: Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the contents of `database/schema.sql`
5. Execute the SQL
6. Go to Settings → API
7. Copy your:
   - Project URL
   - Anon/Public Key

## Step 2: Backend Deployment (Railway)

### Option A: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `student-reminder-system` repository
4. Set root directory to `backend`
5. Add environment variables:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_random_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
6. Deploy
7. Copy the deployment URL

### Option B: Render

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: student-reminder-backend
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as above)
6. Deploy
7. Copy the deployment URL

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import `student-reminder-system` repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist
5. Add environment variable:
   ```
   VITE_API_URL=your_backend_url
   ```
6. Update `frontend/vite.config.js`:
   ```javascript
   proxy: {
     '/api': {
       target: process.env.VITE_API_URL || 'http://localhost:5000',
       changeOrigin: true
     }
   }
   ```
7. Deploy

## Step 4: Gmail App Password Setup

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Use this in EMAIL_PASS environment variable

## Step 5: Update Frontend API URL

Update `frontend/src/App.jsx` or create `.env`:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

## Step 6: Test the Deployment

1. Visit your Vercel URL
2. Login with default credentials:
   - Email: admin@school.com
   - Password: admin123
3. Change admin password immediately
4. Test all features:
   - Add students
   - Mark attendance
   - Create fee records
   - Send reminders

## Alternative: Docker Deployment

### Using Docker Compose

1. Clone repository:
   ```bash
   git clone https://github.com/yashhh0077/student-reminder-system.git
   cd student-reminder-system
   ```

2. Create `.env` file in root:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. Run:
   ```bash
   docker-compose up -d
   ```

4. Access:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Automated Reminders Schedule

Once deployed, the system will automatically send:

- **Attendance Reminders**: Every Monday at 9:00 AM
- **Fee Reminders**: 1st of every month at 10:00 AM
- **Mid-month Fee Reminders**: 15th of every month at 10:00 AM
- **Final Fee Warnings**: 25th of every month at 10:00 AM

## Monitoring

### Backend Health Check
```bash
curl https://your-backend-url.com/health
```

### Check Logs
- Railway: Dashboard → Logs
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → Logs

## Troubleshooting

### Email Not Sending
- Verify Gmail App Password
- Check EMAIL_HOST and EMAIL_PORT
- Ensure 2FA is enabled on Gmail

### Database Connection Issues
- Verify Supabase URL and Key
- Check if database schema is created
- Ensure Supabase project is active

### Frontend Not Loading
- Check if backend URL is correct
- Verify CORS settings in backend
- Check browser console for errors

### Cron Jobs Not Running
- Verify server timezone
- Check server logs for cron execution
- Ensure server doesn't sleep (use Railway/Render paid plan)

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable Supabase Row Level Security
- [ ] Set up database backups
- [ ] Monitor API usage

## Scaling Considerations

### For Large Institutions (1000+ students)

1. **Database**: Upgrade Supabase plan
2. **Backend**: Use Railway Pro or Render Standard
3. **Email**: Consider SendGrid or AWS SES
4. **Caching**: Add Redis for session management
5. **CDN**: Use Cloudflare for frontend

## Support

For deployment issues:
- Check GitHub Issues
- Review logs in deployment platform
- Verify all environment variables
- Test locally first with Docker

---

**Congratulations!** 🎉 Your Student Reminder System is now live!
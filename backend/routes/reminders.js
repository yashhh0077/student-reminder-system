const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send attendance reminder
router.post('/attendance', async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*');

    if (error) throw error;

    const reminders = [];

    for (const student of students) {
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', student.id);

      const totalClasses = attendance.length;
      const presentClasses = attendance.filter(r => r.status === 'present').length;
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      if (attendancePercentage < 75 && totalClasses > 0) {
        const requiredClasses = Math.ceil((0.75 * totalClasses - presentClasses) / 0.25);
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: student.email,
          cc: student.parent_email,
          subject: 'Low Attendance Alert - Action Required',
          html: `
            <h2>Attendance Alert</h2>
            <p>Dear ${student.name},</p>
            <p>Your current attendance is <strong>${attendancePercentage.toFixed(2)}%</strong>, which is below the required 75%.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li>Total Classes: ${totalClasses}</li>
              <li>Classes Attended: ${presentClasses}</li>
              <li>Classes Required: ${requiredClasses} more classes to reach 75%</li>
            </ul>
            <p>Please ensure regular attendance to meet the minimum requirement.</p>
            <p>Best regards,<br>Academic Department</p>
          `
        };

        await transporter.sendMail(mailOptions);
        
        reminders.push({
          student_id: student.id,
          type: 'attendance',
          sent_at: new Date()
        });
      }
    }

    // Log reminders
    if (reminders.length > 0) {
      await supabase.from('reminder_logs').insert(reminders);
    }

    res.json({ 
      success: true, 
      message: `Sent ${reminders.length} attendance reminders`,
      count: reminders.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send fee reminder
router.post('/fees', async (req, res) => {
  try {
    const { data: pendingFees, error } = await supabase
      .from('fees')
      .select(`
        *,
        students (
          id,
          student_id,
          name,
          email,
          phone,
          parent_email
        )
      `)
      .eq('status', 'pending');

    if (error) throw error;

    const reminders = [];
    const currentDate = new Date();

    for (const fee of pendingFees) {
      const dueDate = new Date(fee.due_date);
      const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: fee.students.email,
        cc: fee.students.parent_email,
        subject: daysOverdue > 0 ? 'Overdue Fee Payment - Urgent' : 'Fee Payment Reminder',
        html: `
          <h2>Fee Payment ${daysOverdue > 0 ? 'Overdue Notice' : 'Reminder'}</h2>
          <p>Dear ${fee.students.name},</p>
          <p>This is a reminder regarding your pending fee payment.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Amount: ₹${fee.amount}</li>
            <li>Paid: ₹${fee.paid_amount}</li>
            <li>Pending: ₹${fee.amount - fee.paid_amount}</li>
            <li>Due Date: ${new Date(fee.due_date).toLocaleDateString()}</li>
            ${daysOverdue > 0 ? `<li style="color: red;">Days Overdue: ${daysOverdue}</li>` : ''}
          </ul>
          <p>${daysOverdue > 0 ? 'Please make the payment immediately to avoid penalties.' : 'Please ensure timely payment before the due date.'}</p>
          <p>For payment queries, contact the accounts department.</p>
          <p>Best regards,<br>Accounts Department</p>
        `
      };

      await transporter.sendMail(mailOptions);
      
      reminders.push({
        student_id: fee.students.id,
        type: 'fee',
        sent_at: new Date()
      });
    }

    // Log reminders
    if (reminders.length > 0) {
      await supabase.from('reminder_logs').insert(reminders);
    }

    res.json({ 
      success: true, 
      message: `Sent ${reminders.length} fee reminders`,
      count: reminders.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reminder logs
router.get('/logs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reminder_logs')
      .select(`
        *,
        students (
          student_id,
          name,
          email
        )
      `)
      .order('sent_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        students (
          student_id,
          name,
          email,
          phone
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get attendance by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', req.params.studentId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Calculate attendance percentage
    const totalClasses = data.length;
    const presentClasses = data.filter(record => record.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    res.json({ 
      success: true, 
      data,
      stats: {
        totalClasses,
        presentClasses,
        absentClasses: totalClasses - presentClasses,
        attendancePercentage: attendancePercentage.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get students with low attendance (below 75%)
router.get('/low-attendance', async (req, res) => {
  try {
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*');

    if (studentsError) throw studentsError;

    const lowAttendanceStudents = [];

    for (const student of students) {
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', student.id);

      if (attendanceError) continue;

      const totalClasses = attendance.length;
      const presentClasses = attendance.filter(record => record.status === 'present').length;
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      if (attendancePercentage < 75 && totalClasses > 0) {
        lowAttendanceStudents.push({
          ...student,
          attendancePercentage: attendancePercentage.toFixed(2),
          totalClasses,
          presentClasses,
          requiredClasses: Math.ceil((0.75 * totalClasses - presentClasses) / 0.25)
        });
      }
    }

    res.json({ success: true, data: lowAttendanceStudents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
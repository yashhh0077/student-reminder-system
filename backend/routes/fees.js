const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

// Get all fee records
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fees')
      .select(`
        *,
        students (
          student_id,
          name,
          email,
          phone
        )
      `)
      .order('due_date', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get fees by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', req.params.studentId)
      .order('due_date', { ascending: false });

    if (error) throw error;

    const totalAmount = data.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = data.reduce((sum, fee) => sum + fee.paid_amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    res.json({ 
      success: true, 
      data,
      stats: {
        totalAmount,
        paidAmount,
        pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create fee record
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fees')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update fee payment
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fees')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get students with pending fees
router.get('/pending', async (req, res) => {
  try {
    const { data, error } = await supabase
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
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;

    const currentDate = new Date();
    const pendingFees = data.map(fee => {
      const dueDate = new Date(fee.due_date);
      const daysOverdue = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      
      return {
        ...fee,
        daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
        isOverdue: daysOverdue > 0
      };
    });

    res.json({ success: true, data: pendingFees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
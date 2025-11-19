const cron = require('node-cron');
const axios = require('axios');

// Weekly attendance reminder - Every Monday at 9:00 AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Running weekly attendance reminder...');
  try {
    await axios.post('http://localhost:5000/api/reminders/attendance');
    console.log('Attendance reminders sent successfully');
  } catch (error) {
    console.error('Failed to send attendance reminders:', error.message);
  }
});

// Monthly fee reminder - 1st of every month at 10:00 AM
cron.schedule('0 10 1 * *', async () => {
  console.log('Running monthly fee reminder...');
  try {
    await axios.post('http://localhost:5000/api/reminders/fees');
    console.log('Fee reminders sent successfully');
  } catch (error) {
    console.error('Failed to send fee reminders:', error.message);
  }
});

// Mid-month fee reminder - 15th of every month at 10:00 AM
cron.schedule('0 10 15 * *', async () => {
  console.log('Running mid-month fee reminder...');
  try {
    await axios.post('http://localhost:5000/api/reminders/fees');
    console.log('Mid-month fee reminders sent successfully');
  } catch (error) {
    console.error('Failed to send mid-month fee reminders:', error.message);
  }
});

// Final fee warning - 25th of every month at 10:00 AM
cron.schedule('0 10 25 * *', async () => {
  console.log('Running final fee warning...');
  try {
    await axios.post('http://localhost:5000/api/reminders/fees');
    console.log('Final fee warnings sent successfully');
  } catch (error) {
    console.error('Failed to send final fee warnings:', error.message);
  }
});

console.log('Cron jobs initialized successfully');

module.exports = cron;
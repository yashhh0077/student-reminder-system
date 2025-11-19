import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BellAlertIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Reminders() {
  const [sending, setSending] = useState({ attendance: false, fees: false });

  const sendAttendanceReminders = async () => {
    setSending({ ...sending, attendance: true });
    try {
      const response = await axios.post('/api/reminders/attendance');
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to send attendance reminders');
    } finally {
      setSending({ ...sending, attendance: false });
    }
  };

  const sendFeeReminders = async () => {
    setSending({ ...sending, fees: true });
    try {
      const response = await axios.post('/api/reminders/fees');
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to send fee reminders');
    } finally {
      setSending({ ...sending, fees: false });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Send Reminders</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center mb-4">
            <BellAlertIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Attendance Reminders
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Send email reminders to students with attendance below 75% and their parents.
          </p>
          <button
            onClick={sendAttendanceReminders}
            disabled={sending.attendance}
            className="w-full rounded-md bg-yellow-600 px-4 py-3 text-white font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            {sending.attendance ? 'Sending...' : 'Send Attendance Reminders'}
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Fee Payment Reminders
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Send email reminders to students with pending fee payments and their parents.
          </p>
          <button
            onClick={sendFeeReminders}
            disabled={sending.fees}
            className="w-full rounded-md bg-red-600 px-4 py-3 text-white font-semibold hover:bg-red-500 disabled:opacity-50"
          >
            {sending.fees ? 'Sending...' : 'Send Fee Reminders'}
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Automated Reminder Schedule
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>• <strong>Attendance Reminders:</strong> Every Monday at 9:00 AM</p>
          <p>• <strong>Fee Reminders:</strong> 1st and 15th of every month at 10:00 AM</p>
          <p>• <strong>Final Fee Warning:</strong> 25th of every month at 10:00 AM</p>
        </div>
      </div>
    </div>
  );
}
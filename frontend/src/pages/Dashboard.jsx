import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    lowAttendance: 0,
    pendingFees: 0,
    totalPending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, attendanceRes, feesRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/attendance/low-attendance'),
        axios.get('/api/fees/pending')
      ]);

      const totalPending = feesRes.data.data.reduce(
        (sum, fee) => sum + (fee.amount - fee.paid_amount), 
        0
      );

      setStats({
        totalStudents: studentsRes.data.data.length,
        lowAttendance: attendanceRes.data.data.length,
        pendingFees: feesRes.data.data.length,
        totalPending
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Low Attendance (<75%)',
      value: stats.lowAttendance,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pending Fee Students',
      value: stats.pendingFees,
      icon: CurrencyDollarIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Total Pending Amount',
      value: `₹${stats.totalPending.toLocaleString()}`,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-green-500'
    }
  ];

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {stat.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-500">
              Send Attendance Reminders
            </button>
            <button className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500">
              Send Fee Reminders
            </button>
            <button className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500">
              Generate Reports
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Attendance Reminder</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Fee Reminder</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Status</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
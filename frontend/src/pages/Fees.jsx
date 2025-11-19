import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Fees() {
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingFees();
  }, []);

  const fetchPendingFees = async () => {
    try {
      const response = await axios.get('/api/fees/pending');
      setPendingFees(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch fee data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Pending Fee Payments
      </h1>

      {pendingFees.length === 0 ? (
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <p className="text-green-800 font-medium">
            Excellent! No pending fee payments
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pendingFees.map((fee) => (
                <tr key={fee.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {fee.students.student_id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {fee.students.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {fee.fee_type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    ₹{fee.amount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-red-600">
                    ₹{(fee.amount - fee.paid_amount).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(fee.due_date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {fee.isOverdue ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                        Overdue ({fee.daysOverdue} days)
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
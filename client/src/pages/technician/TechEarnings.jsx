import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';

const TechEarnings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const completed = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completed.reduce((sum, b) => sum + b.totalAmount, 0);
  const thisMonth = completed.filter(b => {
    const d = new Date(b.completedAt || b.updatedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthEarnings = thisMonth.reduce((sum, b) => sum + b.totalAmount, 0);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-panel h-28 animate-pulse"></div>)}</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Earnings</h1>
        <p className="text-text-muted">Track your completed jobs and income.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 border-b-4 border-b-accent-emerald">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-accent-emerald" />
            <h3 className="text-text-secondary text-sm font-medium">Total Earnings</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">Rs. {totalEarnings.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-6 border-b-4 border-b-info">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-info" />
            <h3 className="text-text-secondary text-sm font-medium">This Month</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">Rs. {thisMonthEarnings.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-6 border-b-4 border-b-success">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="text-text-secondary text-sm font-medium">Completed Jobs</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">{completed.length}</div>
        </div>
      </div>

      {/* Completed Jobs Table */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-6 border-b border-border-glass">
          <h2 className="text-xl font-semibold text-text-primary">Completed Jobs</h2>
        </div>
        {completed.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Service</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-text-muted">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {completed.map(b => (
                  <tr key={b._id} className="hover:bg-bg-tertiary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getAvatarUrl(b.user?.avatar, b.user?.name)} alt="" className="w-8 h-8 rounded-full object-cover border border-border-glass" />
                        <span className="font-medium text-text-primary">{b.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{b.service?.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{new Date(b.completedAt || b.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-accent-emerald">Rs. {b.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No completed jobs yet. Complete a job to see your earnings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechEarnings;

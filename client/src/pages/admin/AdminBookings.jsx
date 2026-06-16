import React, { useState, useEffect } from 'react';
import { Calendar, Search, MapPin, Clock } from 'lucide-react';
import { api } from '../../contexts/AuthContext';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/admin/bookings?search=${search}&status=${statusFilter}`);
        setBookings(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [search, statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      accepted: 'bg-info/10 text-info border-info/20',
      technician_on_way: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
      in_progress: 'bg-info/10 text-info border-info/20',
      completed: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-danger/10 text-danger border-danger/20',
      disputed: 'bg-dark text-white border-dark',
      refunded: 'bg-bg-tertiary text-text-secondary border-border-glass'
    };
    return colors[status] || 'bg-bg-tertiary text-text-secondary border-border-glass';
  };

  const getStatusLabel = (s) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">All Bookings</h1>
        <p className="text-text-muted">Monitor and track all service requests across the platform.</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by booking number..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-9 w-full" />
        </div>
        <div className="w-full md:w-48">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base appearance-none bg-bg-tertiary">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Booking No.</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Service & Customer</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Technician</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Schedule</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Status</th>
                  <th className="text-right px-6 py-4 font-medium text-text-muted">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-bg-tertiary/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-text-secondary">{b.bookingNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">{b.service?.name}</div>
                      <div className="text-xs text-text-muted mt-1">{b.user?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{b.technician?.user?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(b.bookingDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.bookingTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(b.status)}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-accent-emerald">Rs. {b.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

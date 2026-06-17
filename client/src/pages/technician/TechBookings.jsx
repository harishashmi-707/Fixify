import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const TechBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
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

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status, notes: `Status changed to ${status}` });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning bg-warning/10 border-warning/20',
      accepted: 'text-info bg-info/10 border-info/20',
      technician_on_way: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
      in_progress: 'text-info bg-info/10 border-info/20',
      completed: 'text-success bg-success/10 border-success/20',
      cancelled: 'text-danger bg-danger/10 border-danger/20',
    };
    return colors[status] || 'text-text-secondary bg-bg-tertiary border-border-glass';
  };

  const getStatusLabel = (s) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="glass-panel h-24 animate-pulse"></div>)}</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Job Requests</h1>
        <p className="text-text-muted">Manage incoming bookings and update their status.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${filter === s ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald font-medium' : 'bg-bg-tertiary border-border-glass text-text-secondary hover:bg-bg-secondary'}`}
          >
            {s === 'all' ? 'All' : getStatusLabel(s)} ({s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking._id} className="glass-panel p-6 hover:border-border-glass-hover transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-grow">
                  <img
                    src={getAvatarUrl(booking.user?.avatar, booking.user?.name)}
                    alt={booking.user?.name}
                    className="w-12 h-12 rounded-full object-cover border border-border-glass shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold">{booking.user?.name}</h4>
                      <span className="text-xs text-text-muted">#{booking.bookingNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.bookingTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.address}, {booking.city}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{booking.service?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right pr-4 border-r border-border-glass">
                    <div className="text-xs text-text-muted">Amount</div>
                    <div className="font-bold text-accent-cyan">Rs. {booking.totalAmount}</div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusUpdate(booking._id, 'accepted')} className="bg-accent-emerald hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Accept
                      </button>
                    </div>
                  )}
                  {booking.status === 'accepted' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'technician_on_way')} className="bg-info hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1">
                      <ChevronRight className="w-4 h-4" /> On My Way
                    </button>
                  )}
                  {booking.status === 'technician_on_way' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'in_progress')} className="bg-info hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1">
                      <ChevronRight className="w-4 h-4" /> Start Work
                    </button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'completed')} className="bg-success hover:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-text-muted text-sm">{filter === 'all' ? 'No job requests yet.' : 'No bookings with this status.'}</p>
        </div>
      )}
    </div>
  );
};

export default TechBookings;

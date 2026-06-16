import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Wrench, Filter, Search } from 'lucide-react';
import { api } from '../../contexts/AuthContext';

const UserBookings = () => {
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

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning bg-warning/10 border-warning/20',
      accepted: 'text-info bg-info/10 border-info/20',
      completed: 'text-success bg-success/10 border-success/20',
      cancelled: 'text-danger bg-danger/10 border-danger/20',
    };
    return colors[status] || 'text-text-secondary bg-bg-tertiary border-border-glass';
  };

  const getStatusLabel = (s) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-panel h-24 animate-pulse"></div>)}</div>;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-1">My Bookings</h1>
          <p className="text-text-muted text-sm">Track all your service bookings here.</p>
        </div>
        <Link to="/services" className="bg-accent-emerald hover:bg-emerald-400 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm shadow-glow whitespace-nowrap">
          + New Booking
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map(s => (
          <button 
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${filter === s ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald font-medium' : 'bg-bg-tertiary border-border-glass text-text-secondary hover:bg-bg-secondary'}`}
          >
            {s === 'all' ? 'All' : getStatusLabel(s)} {s === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map(booking => (
            <div key={booking._id} className="glass-panel p-6 hover:border-border-glass-hover transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-bg-tertiary border border-border-glass flex items-center justify-center shrink-0">
                    <Wrench className="w-6 h-6 text-text-muted" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold">{booking.service?.name || 'Service'}</h4>
                      <span className="text-xs text-text-muted">#{booking.bookingNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.bookingTime}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">Rs. {booking.totalAmount}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center">
          <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-text-muted text-sm">{filter === 'all' ? 'You haven\'t made any bookings yet.' : 'No bookings with this status.'}</p>
        </div>
      )}
    </div>
  );
};

export default UserBookings;

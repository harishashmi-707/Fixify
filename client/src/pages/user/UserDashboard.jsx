import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, MapPin, Wrench } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/bookings');
        const allBookings = res.data.data;
        
        setStats({
          total: allBookings.length,
          pending: allBookings.filter(b => ['pending', 'accepted', 'technician_on_way', 'in_progress'].includes(b.status)).length,
          completed: allBookings.filter(b => b.status === 'completed').length,
        });

        setRecentBookings(allBookings.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-warning bg-warning/10 border-warning/20',
      accepted: 'text-info bg-info/10 border-info/20',
      technician_on_way: 'text-info bg-info/10 border-info/20',
      in_progress: 'text-info bg-info/10 border-info/20',
      completed: 'text-success bg-success/10 border-success/20',
      cancelled: 'text-danger bg-danger/10 border-danger/20',
    };
    return colors[status] || 'text-text-secondary bg-bg-tertiary border-border-glass';
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) return <div className="animate-pulse flex gap-6 flex-col">
    <div className="h-32 bg-bg-tertiary rounded-xl w-full"></div>
    <div className="h-64 bg-bg-tertiary rounded-xl w-full"></div>
  </div>;

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-text-muted">Manage your home service bookings and account settings here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 border-l-4 border-l-accent-cyan">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary font-medium">Total Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.total}</div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-warning">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary font-medium">Active Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.pending}</div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-success">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary font-medium">Completed Jobs</h3>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.completed}</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-6 border-b border-border-glass flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Recent Bookings</h2>
          <Link to="/user/bookings" className="text-sm font-medium text-accent-cyan hover:underline">View All</Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="divide-y divide-border-glass">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="p-6 hover:bg-bg-tertiary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-tertiary border border-border-glass flex items-center justify-center shrink-0">
                      <Wrench className="w-6 h-6 text-text-muted" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-text-primary">{booking.service?.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)} font-medium`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="text-sm text-text-secondary flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:justify-end">
                    <div className="text-right">
                      <div className="text-sm text-text-muted">Total Amount</div>
                      <div className="font-bold text-text-primary">Rs. {booking.totalAmount}</div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>You haven't made any bookings yet.</p>
            <Link to="/services" className="inline-block mt-4 bg-accent-emerald hover:bg-emerald-400 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium">
              Explore Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

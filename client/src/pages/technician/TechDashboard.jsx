import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Activity, Star, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';

const TechDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalJobs: 0, pendingRequests: 0, earnings: 0, rating: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario without DB we would use mock data, but we'll wire it to the API 
    // and let it fail gracefully or show empty state if API is unreachable.
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, techRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/auth/me') // tech profile is returned here based on controller logic
        ]);
        
        const allBookings = bookingsRes.data.data || [];
        const techProfile = techRes.data.data.technicianProfile || {};
        
        setStats({
          totalJobs: techProfile.totalJobs || 0,
          pendingRequests: allBookings.filter(b => b.status === 'pending').length,
          earnings: allBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalAmount, 0),
          rating: techProfile.avgRating || 0
        });

        setRecentRequests(allBookings.filter(b => b.status === 'pending' || b.status === 'accepted').slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.put(`/bookings/${id}/status`, { status: 'accepted', notes: 'Accepted by technician' });
      // update state locally
      setRecentRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'accepted' } : r));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="animate-pulse flex gap-6 flex-col">
    <div className="h-32 bg-bg-tertiary rounded-xl w-full"></div>
    <div className="h-64 bg-bg-tertiary rounded-xl w-full"></div>
  </div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Technician Dashboard</h1>
          <p className="text-text-muted">Manage your job requests, schedule, and earnings.</p>
        </div>
        <div className="flex items-center gap-2 bg-bg-tertiary px-4 py-2 rounded-lg border border-border-glass">
          <Activity className="w-4 h-4 text-success" />
          <span className="text-sm font-medium">Status: <span className="text-success">Available</span></span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 border-b-4 border-b-info">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-info" />
            <h3 className="text-text-secondary text-sm font-medium">Pending Requests</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.pendingRequests}</div>
        </div>

        <div className="glass-panel p-6 border-b-4 border-b-success">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="text-text-secondary text-sm font-medium">Completed Jobs</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.totalJobs}</div>
        </div>

        <div className="glass-panel p-6 border-b-4 border-b-accent-emerald">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-accent-emerald" />
            <h3 className="text-text-secondary text-sm font-medium">Total Earnings</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">Rs. {stats.earnings}</div>
        </div>

        <div className="glass-panel p-6 border-b-4 border-b-warning">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-warning fill-warning" />
            <h3 className="text-text-secondary text-sm font-medium">Average Rating</h3>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.rating.toFixed(1)}</div>
        </div>
      </div>

      {/* Recent Job Requests */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-6 border-b border-border-glass flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Recent Job Requests</h2>
          <Link to="/technician/bookings" className="text-sm font-medium text-accent-cyan hover:underline">View All</Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="divide-y divide-border-glass">
            {recentRequests.map((request) => (
              <div key={request._id} className="p-6 hover:bg-bg-tertiary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4 flex-grow">
                    <img 
                      src={getAvatarUrl(request.user?.avatar, request.user?.name || 'User')} 
                      alt={request.user?.name || 'User'} 
                      className="w-12 h-12 rounded-full object-cover border border-border-glass shrink-0 bg-bg-tertiary" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user?.name || 'User')}&background=0D9488&color=fff`;
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text-primary">{request.user?.name}</h4>
                        <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border-glass">
                          {request.service?.name}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(request.bookingDate).toLocaleDateString()} at {request.bookingTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {request.address}, {request.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <div className="text-right sm:pr-4 sm:border-r border-border-glass">
                      <div className="text-xs text-text-muted">Estimated Pay</div>
                      <div className="font-bold text-accent-cyan">Rs. {request.totalAmount}</div>
                    </div>
                    {request.status === 'pending' ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                         <button onClick={() => handleAccept(request._id)} className="flex-1 sm:flex-none bg-accent-emerald hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-glow">
                           Accept
                         </button>
                      </div>
                    ) : (
                       <span className="text-sm font-medium text-info bg-info/10 px-3 py-1.5 rounded-lg border border-info/20">Accepted</span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No pending job requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechDashboard;

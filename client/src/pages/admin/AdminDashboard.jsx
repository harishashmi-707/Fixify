import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fillMissingMonths = (rawData) => {
  if (!rawData) return [];
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthStr = `${year}-${month}`;
    const monthName = d.toLocaleString('default', { month: 'short' });
    
    const existing = rawData.find(item => item._id === monthStr);
    result.push({
      name: monthName,
      revenue: existing ? existing.revenue : 0,
      jobs: existing ? existing.count : 0
    });
  }
  return result;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, techs: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        const data = res.data.data;
        setStats({
          users: data.totalUsers || 0,
          techs: data.totalTechnicians || 0,
          bookings: data.totalBookings || 0,
          revenue: data.totalRevenue || 0,
          pending: data.pendingApprovals || 0,
          disputed: data.disputedBookings || 0,
          messages: data.unreadMessages || 0,
          chart: data.monthlyRevenue || []
        });
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = fillMissingMonths(stats.chart);

  if (loading) return <div className="animate-pulse flex gap-6 flex-col">
    <div className="h-32 bg-bg-tertiary rounded-xl w-full"></div>
    <div className="h-64 bg-bg-tertiary rounded-xl w-full"></div>
  </div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">System Overview</h1>
        <p className="text-text-muted">Monitor platform performance, users, and revenue.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/10 rounded-full blur-[30px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-text-secondary font-medium">Total Users</h3>
            <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">{stats.users.toLocaleString()}</div>
          <div className="text-xs text-success mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="w-3 h-3" /> +12% this month</div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-info/10 rounded-full blur-[30px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-text-secondary font-medium">Technicians</h3>
            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-info" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">{stats.techs.toLocaleString()}</div>
          <div className="text-xs text-success mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="w-3 h-3" /> +5% this month</div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-[30px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-text-secondary font-medium">Total Bookings</h3>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">{stats.bookings.toLocaleString()}</div>
          <div className="text-xs text-success mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="w-3 h-3" /> +18% this month</div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-emerald/10 rounded-full blur-[30px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-text-secondary font-medium">Gross Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-accent-emerald/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-emerald" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary relative z-10">Rs. {(stats.revenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-success mt-2 flex items-center gap-1 relative z-10"><TrendingUp className="w-3 h-3" /> +22% this month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview (Last 6 Months)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff" tick={{fill: '#ffffff'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff" tick={{fill: '#ffffff'}} tickFormatter={(value) => `Rs.${value/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#ffffff'}}
                  itemStyle={{color: '#ffffff'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Needed */}
        <div className="lg:col-span-1 glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-warning">
            <AlertTriangle className="w-5 h-5" /> Action Needed
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-bg-tertiary border border-border-glass rounded-lg flex justify-between items-center">
               <div>
                 <div className="font-medium text-sm">Pending Approvals</div>
                 <div className="text-xs text-text-muted">{stats.pending || 0} technicians waiting</div>
               </div>
               <Link to="/admin/technicians" className="text-accent-cyan text-sm hover:underline">Review</Link>
            </div>
            <div className="p-3 bg-bg-tertiary border border-border-glass rounded-lg flex justify-between items-center">
               <div>
                 <div className="font-medium text-sm text-danger">Disputed Bookings</div>
                 <div className="text-xs text-text-muted">{stats.disputed || 0} active disputes</div>
               </div>
               <Link to="/admin/bookings" className="text-accent-cyan text-sm hover:underline">Resolve</Link>
            </div>
            <div className="p-3 bg-bg-tertiary border border-border-glass rounded-lg flex justify-between items-center">
               <div>
                 <div className="font-medium text-sm">Contact Messages</div>
                 <div className="text-xs text-text-muted">{stats.messages || 0} unread messages</div>
               </div>
               <Link to="/admin/messages" className="text-accent-cyan text-sm hover:underline">View</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

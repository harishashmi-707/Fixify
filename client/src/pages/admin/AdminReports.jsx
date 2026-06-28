import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp } from 'lucide-react';
import { api } from '../../contexts/AuthContext';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-12 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>;

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

  const chartData = fillMissingMonths(stats?.monthlyRevenue);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Reports & Analytics</h1>
          <p className="text-text-muted">Platform performance and revenue analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary font-medium">All-Time Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-accent-emerald/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-emerald" />
            </div>
          </div>
          <div className="text-4xl font-bold text-text-primary mb-2">Rs. {stats?.totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-secondary font-medium">Platform Success Rate</h3>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-4xl font-bold text-text-primary mb-2">
             {stats?.totalBookings > 0 ? ((stats.totalBookings - stats.disputedBookings) / stats.totalBookings * 100).toFixed(1) : 0}%
          </div>
          <div className="text-sm text-text-muted">Based on undisputed vs total bookings</div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-6">Revenue History (Last 6 Months)</h3>
        <div className="h-96 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-glass)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-secondary)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{fill: 'var(--color-text-secondary)'}} tickFormatter={(val) => `Rs.${val/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-glass)', borderRadius: '8px', color: 'var(--color-text-primary)'}}
                  itemStyle={{color: '#10b981'}}
                  labelStyle={{color: 'var(--color-text-primary)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueReport)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-text-muted">No revenue data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

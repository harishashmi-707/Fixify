import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const UserMessages = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div className="p-12 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Messages & Alerts</h1>
          <p className="text-text-muted">Stay updated on your booking status and account activity.</p>
        </div>
        <button onClick={markAllAsRead} className="text-sm font-medium text-accent-cyan hover:underline flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border-glass">
            {notifications.map(n => (
              <div key={n._id} className={`p-6 flex items-start gap-4 transition-colors ${n.isRead ? 'opacity-70' : 'bg-bg-tertiary/20'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.isRead ? 'bg-bg-tertiary text-text-muted' : 'bg-accent-cyan/10 text-accent-cyan'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <h4 className={`text-base mb-1 ${n.isRead ? 'font-medium text-text-secondary' : 'font-bold text-text-primary'}`}>{n.title}</h4>
                  <p className="text-sm text-text-muted">{n.message}</p>
                  <div className="text-xs text-text-muted mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <button onClick={() => markAsRead(n._id)} className="text-xs bg-bg-tertiary border border-border-glass px-3 py-1.5 rounded-lg hover:bg-border-glass transition-colors whitespace-nowrap">
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>You're all caught up! No new messages.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessages;

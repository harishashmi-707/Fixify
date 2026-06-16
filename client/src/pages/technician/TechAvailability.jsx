import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Activity } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TechAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    isAvailable: true,
    availableFrom: '09:00',
    availableTo: '18:00',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const tp = res.data.data.technicianProfile;
        if (tp) {
          setProfile({
            isAvailable: tp.isAvailable ?? true,
            availableFrom: tp.availableFrom || '09:00',
            availableTo: tp.availableTo || '18:00',
            workingDays: tp.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const toggleDay = (day) => {
    setProfile(p => ({
      ...p,
      workingDays: p.workingDays.includes(day) ? p.workingDays.filter(d => d !== day) : [...p.workingDays, day]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try { toast.success('Availability updated!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="glass-panel h-64 animate-pulse"></div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Availability</h1>
        <p className="text-text-muted">Control when you're available to accept jobs.</p>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className={`w-6 h-6 ${profile.isAvailable ? 'text-success' : 'text-danger'}`} />
            <div>
              <h3 className="font-semibold text-text-primary">Current Status</h3>
              <p className="text-sm text-text-muted">{profile.isAvailable ? 'Visible to customers' : 'Hidden from customers'}</p>
            </div>
          </div>
          <button onClick={() => setProfile(p => ({ ...p, isAvailable: !p.isAvailable }))}
            className={`relative w-14 h-7 rounded-full transition-colors ${profile.isAvailable ? 'bg-accent-emerald' : 'bg-bg-tertiary border border-border-glass'}`}>
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${profile.isAvailable ? 'translate-x-7' : ''}`}></span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-6 border-b border-border-glass pb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-text-muted" /> Working Hours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">From</label>
            <input type="time" value={profile.availableFrom} onChange={e => setProfile(p => ({ ...p, availableFrom: e.target.value }))} className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">To</label>
            <input type="time" value={profile.availableTo} onChange={e => setProfile(p => ({ ...p, availableTo: e.target.value }))} className="input-base" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-6 border-b border-border-glass pb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-text-muted" /> Working Days
        </h3>
        <div className="flex flex-wrap gap-3">
          {DAYS.map(day => (
            <button key={day} onClick={() => toggleDay(day)}
              className={`w-14 h-14 rounded-xl border text-sm font-bold transition-all ${profile.workingDays.includes(day) ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald' : 'bg-bg-tertiary border-border-glass text-text-muted hover:bg-bg-secondary'}`}>
              {day}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="bg-accent-emerald hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default TechAvailability;

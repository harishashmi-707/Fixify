import React, { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, DollarSign, Camera } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const TechProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    hourlyRate: 0,
    experienceYears: 0,
    skills: '',
    serviceAreas: '',
    cnic: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const tp = res.data.data.technicianProfile;
        if (tp) {
          setFormData({
            bio: tp.bio || '',
            hourlyRate: tp.hourlyRate || 0,
            experienceYears: tp.experienceYears || 0,
            skills: tp.skills?.join(', ') || '',
            serviceAreas: tp.serviceAreas?.join(', ') || '',
            cnic: tp.cnic || ''
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // API call to update tech profile goes here.
      // E.g. await api.put('/technicians/profile', updatedData);
      toast.success('Professional profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="glass-panel h-64 animate-pulse"></div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Professional Profile</h1>
        <p className="text-text-muted">This information will be displayed to customers.</p>
      </div>

      <div className="glass-panel p-6 mb-6 flex items-center gap-6">
        <div className="relative">
            <img src={getAvatarUrl(user?.avatar, user?.name)} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-2 border-border-glass" />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-emerald rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-400 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-lg">{user?.name}</h3>
          <p className="text-text-muted text-sm capitalize">Technician Profile</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">About Me (Bio)</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell customers about your experience and expertise..." className="input-base resize-none"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Hourly Rate (Rs.)</label>
            <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="input-base pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Years of Experience</label>
            <div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className="input-base pl-10" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Skills (comma separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. AC Repair, Plumbing, Wiring" className="input-base" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Service Areas (comma separated)</label>
          <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" name="serviceAreas" value={formData.serviceAreas} onChange={handleChange} placeholder="e.g. DHA, Bahria Town, F-8" className="input-base pl-10" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">CNIC Number</label>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="XXXXX-XXXXXXX-X" className="input-base pl-10" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-accent-emerald hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechProfile;

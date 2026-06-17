import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Camera } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
  });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      return toast.error('Passwords do not match');
    }
    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.newPass
      });
      toast.success('Password changed successfully!');
      setPasswordData({ current: '', newPass: '', confirm: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-display font-bold text-text-primary mb-8">Profile Settings</h1>

      {/* Avatar Section */}
      <div className="glass-panel p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <img 
            src={getAvatarUrl(user?.avatar, user?.name)}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-border-glass"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-emerald rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-400 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-lg">{user?.name}</h3>
          <p className="text-text-muted text-sm capitalize">{user?.role} Account</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-panel p-8 mb-6">
        <h3 className="font-display font-bold text-lg mb-6 border-b border-border-glass pb-3">Personal Information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-base pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-base pl-10" disabled />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-base pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select name="city" value={formData.city} onChange={handleChange} className="input-base pl-10 appearance-none bg-bg-tertiary">
                  <option value="">Select City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address..." className="input-base" />
          </div>
          <button type="submit" disabled={saving} className="bg-accent-emerald hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg mt-2">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-panel p-8">
        <h3 className="font-display font-bold text-lg mb-6 border-b border-border-glass pb-3 flex items-center gap-2"><Lock className="w-5 h-5 text-text-muted" /> Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
            <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} className="input-base" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
              <input type="password" name="newPass" value={passwordData.newPass} onChange={handlePasswordChange} className="input-base" required minLength="6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
              <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} className="input-base" required minLength="6" />
            </div>
          </div>
          <button type="submit" className="bg-bg-tertiary hover:bg-border-glass text-text-primary border border-border-glass font-bold py-2.5 px-6 rounded-lg transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

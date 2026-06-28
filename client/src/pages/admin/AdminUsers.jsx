import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Shield, UserX, UserCheck, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '', city: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?search=${search}&role=${roleFilter}`);
      setUsers(res.data.data);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`);
      fetchUsers();
      toast.success('User status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      city: user.city || '',
      isActive: user.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/users/${editingUser._id}`, formData);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (e) {
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone and will delete all associated data.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">User Management</h1>
          <p className="text-text-muted">View and manage all registered users.</p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-9 w-full" />
        </div>
        <div className="w-full md:w-48">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-base appearance-none bg-bg-tertiary">
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="technician">Technicians</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">User</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Role</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">City</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Status</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Joined</th>
                  <th className="text-right px-6 py-4 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-bg-tertiary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getAvatarUrl(u.avatar, u.name)} className="w-10 h-10 rounded-full object-cover border border-border-glass" alt="" />
                        <div>
                          <div className="font-semibold text-text-primary">{u.name}</div>
                          <div className="text-xs text-text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full border font-medium capitalize ${u.role === 'admin' ? 'bg-danger/10 text-danger border-danger/20' : u.role === 'technician' ? 'bg-info/10 text-info border-info/20' : 'bg-bg-tertiary text-text-secondary border-border-glass'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{u.city || '-'}</td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="flex items-center gap-1 text-success text-xs font-medium"><div className="w-2 h-2 rounded-full bg-success"></div> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-danger text-xs font-medium"><div className="w-2 h-2 rounded-full bg-danger"></div> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       <button onClick={() => handleEditClick(u)} className="text-text-muted hover:text-accent-cyan transition-colors p-2">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => toggleStatus(u._id)} className="text-text-muted hover:text-text-primary transition-colors p-2" title={u.isActive ? 'Deactivate User' : 'Activate User'}>
                         {u.isActive ? <UserX className="w-4 h-4 text-danger" /> : <UserCheck className="w-4 h-4 text-success" />}
                       </button>
                       <button onClick={() => handleDeleteUser(u._id)} className="text-text-muted hover:text-danger transition-colors p-2">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border-glass">
            <div className="flex justify-between items-center p-4 border-b border-border-glass">
              <h3 className="font-semibold text-lg">Edit User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-base w-full">
                  <option value="user">User</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-base w-full">
                  <option value="">Select City</option>
                  <option value="islamabad">Islamabad</option>
                  <option value="lahore">Lahore</option>
                  <option value="karachi">Karachi</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="userActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded bg-bg-secondary border-border-glass text-accent-cyan focus:ring-accent-cyan" />
                <label htmlFor="userActive" className="text-sm font-medium text-text-primary">Active Account</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border-glass">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Update User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Shield, UserX, UserCheck } from 'lucide-react';
import { api, assetUrl } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

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
                        <img src={u.avatar ? assetUrl(`/uploads/avatars/${u.avatar}`) : `https://ui-avatars.com/api/?name=${u.name}`} className="w-10 h-10 rounded-full object-cover border border-border-glass" alt="" />
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
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => toggleStatus(u._id)} className="text-text-muted hover:text-text-primary transition-colors p-2" title={u.isActive ? 'Deactivate User' : 'Activate User'}>
                         {u.isActive ? <UserX className="w-4 h-4 text-danger" /> : <UserCheck className="w-4 h-4 text-success" />}
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
    </div>
  );
};

export default AdminUsers;

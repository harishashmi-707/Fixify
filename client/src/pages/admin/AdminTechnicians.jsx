import React, { useState, useEffect } from 'react';
import { Briefcase, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { api, assetUrl } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTechnicians = async () => {
    try {
      const res = await api.get(`/admin/technicians?search=${search}&status=${statusFilter}`);
      setTechnicians(res.data.data);
    } catch (e) {
      toast.error('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [search, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/technicians/${id}/status`, { status });
      fetchTechnicians();
      toast.success(`Technician ${status} successfully`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Technicians</h1>
          <p className="text-text-muted">Approve and manage technician applications.</p>
        </div>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-9 w-full" />
        </div>
        <div className="w-full md:w-48">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base appearance-none bg-bg-tertiary">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>
        ) : technicians.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Technician</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">CNIC</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">City</th>
                  <th className="text-left px-6 py-4 font-medium text-text-muted">Status</th>
                  <th className="text-right px-6 py-4 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {technicians.map(tech => (
                  <tr key={tech._id} className="hover:bg-bg-tertiary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={tech.user?.avatar ? assetUrl(`/uploads/avatars/${tech.user?.avatar}`) : `https://ui-avatars.com/api/?name=${tech.user?.name}`} className="w-10 h-10 rounded-full object-cover border border-border-glass" alt="" />
                        <div>
                          <div className="font-semibold text-text-primary">{tech.user?.name}</div>
                          <div className="text-xs text-text-muted">{tech.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{tech.cnic || '-'}</td>
                    <td className="px-6 py-4 text-text-secondary">{tech.user?.city || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full border font-medium capitalize ${
                        tech.status === 'approved' ? 'bg-success/10 text-success border-success/20' :
                        tech.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        tech.status === 'rejected' ? 'bg-danger/10 text-danger border-danger/20' :
                        'bg-bg-tertiary text-text-secondary border-border-glass'
                      }`}>
                        {tech.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         {tech.status === 'pending' && (
                           <>
                             <button onClick={() => updateStatus(tech._id, 'approved')} className="bg-success/10 text-success hover:bg-success hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Approve</button>
                             <button onClick={() => updateStatus(tech._id, 'rejected')} className="bg-danger/10 text-danger hover:bg-danger hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Reject</button>
                           </>
                         )}
                         {tech.status === 'approved' && (
                           <button onClick={() => updateStatus(tech._id, 'suspended')} className="bg-danger/10 text-danger hover:bg-danger hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Suspend</button>
                         )}
                         {tech.status === 'suspended' && (
                           <button onClick={() => updateStatus(tech._id, 'approved')} className="bg-success/10 text-success hover:bg-success hover:text-white px-2 py-1 rounded text-xs font-bold transition-colors">Reactivate</button>
                         )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No technicians found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTechnicians;

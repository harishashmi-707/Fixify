import React, { useState, useEffect } from 'react';
import { Briefcase, Search, CheckCircle, XCircle, AlertTriangle, Eye, Trash2, X } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // View Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);

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
      if (selectedTech && selectedTech._id === id) {
        setIsViewModalOpen(false);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this technician? This action cannot be undone and will remove their user account completely.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('Technician deleted completely');
      fetchTechnicians();
    } catch (e) {
      toast.error('Failed to delete technician');
    }
  };

  const openViewModal = (tech) => {
    setSelectedTech(tech);
    setIsViewModalOpen(true);
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
                        <img src={getAvatarUrl(tech.user?.avatar, tech.user?.name)} className="w-10 h-10 rounded-full object-cover border border-border-glass" alt="" />
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
                       <div className="flex justify-end gap-2 items-center">
                         <button onClick={() => openViewModal(tech)} className="text-text-muted hover:text-accent-cyan p-2 transition-colors" title="View Details">
                           <Eye className="w-4 h-4" />
                         </button>
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
                         <button onClick={() => handleDelete(tech.user._id)} className="text-text-muted hover:text-danger p-2 transition-colors ml-2" title="Delete Technician">
                           <Trash2 className="w-4 h-4" />
                         </button>
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

      {/* View Modal */}
      {isViewModalOpen && selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-primary rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border-glass">
            <div className="flex justify-between items-center p-4 border-b border-border-glass">
              <h3 className="font-semibold text-lg">Technician Profile Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={getAvatarUrl(selectedTech.user?.avatar, selectedTech.user?.name)} className="w-16 h-16 rounded-full object-cover border-2 border-border-glass" alt="" />
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{selectedTech.user?.name}</h2>
                  <p className="text-text-secondary">{selectedTech.user?.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full border font-medium capitalize ${
                    selectedTech.status === 'approved' ? 'bg-success/10 text-success border-success/20' :
                    selectedTech.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                    selectedTech.status === 'rejected' ? 'bg-danger/10 text-danger border-danger/20' :
                    'bg-bg-tertiary text-text-secondary border-border-glass'
                  }`}>
                    {selectedTech.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-text-muted mb-1">Phone Number</p>
                  <p className="font-medium">{selectedTech.user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">City</p>
                  <p className="font-medium">{selectedTech.user?.city || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">CNIC</p>
                  <p className="font-medium">{selectedTech.cnic || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Hourly Rate</p>
                  <p className="font-medium">Rs. {selectedTech.hourlyRate || 0}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Total Jobs Completed</p>
                  <p className="font-medium">{selectedTech.completedJobs || 0}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Rating</p>
                  <p className="font-medium">★ {selectedTech.rating ? selectedTech.rating.toFixed(1) : '0.0'} ({selectedTech.reviews || 0} reviews)</p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-text-muted mb-2 text-sm">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.skills && selectedTech.skills.length > 0 ? (
                    selectedTech.skills.map((skill, idx) => (
                      <span key={idx} className="bg-bg-tertiary px-3 py-1 rounded-full text-xs text-text-secondary border border-border-glass">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-text-muted mb-2 text-sm">Bio</p>
                <p className="text-sm bg-bg-secondary p-3 rounded-lg border border-border-glass text-text-secondary whitespace-pre-line">
                  {selectedTech.bio || 'No bio provided.'}
                </p>
              </div>
              
              <div className="mt-8 flex justify-end gap-3 border-t border-border-glass pt-4">
                {selectedTech.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(selectedTech._id, 'rejected')} className="btn-secondary text-danger">Reject</button>
                    <button onClick={() => updateStatus(selectedTech._id, 'approved')} className="btn-primary">Approve Technician</button>
                  </>
                )}
                {selectedTech.status === 'approved' && (
                  <button onClick={() => updateStatus(selectedTech._id, 'suspended')} className="btn-secondary text-warning border-warning/20">Suspend Technician</button>
                )}
                {selectedTech.status === 'suspended' && (
                  <button onClick={() => updateStatus(selectedTech._id, 'approved')} className="btn-primary">Reactivate</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTechnicians;

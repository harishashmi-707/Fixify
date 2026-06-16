import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          api.get('/categories'),
          api.get('/services')
        ]);
        setCategories(catRes.data.data);
        setServices(srvRes.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Services Configuration</h1>
          <p className="text-text-muted">Manage categories and services offered on the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Categories</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-accent-cyan hover:underline">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          <div className="glass-panel p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-bg-tertiary/30">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${cat.isActive ? 'text-success' : 'text-danger'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-text-muted hover:text-accent-cyan mr-2"><Edit2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Services</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-accent-cyan hover:underline">
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="glass-panel p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted">Base Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {services.map(srv => (
                  <tr key={srv._id} className="hover:bg-bg-tertiary/30">
                    <td className="px-4 py-3 font-medium">{srv.name}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{srv.category?.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-accent-emerald">Rs. {srv.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;

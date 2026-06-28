import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getCategoryImageUrl, getServiceImageUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSrvModalOpen, setIsSrvModalOpen] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', isActive: true });
  const [srvForm, setSrvForm] = useState({ name: '', slug: '', category: '', basePrice: '', duration: '', description: '', isActive: true });
  
  const [catImage, setCatImage] = useState(null);
  const [srvImage, setSrvImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  // --- Category Handlers ---
  const handleOpenCatModal = (cat = null) => {
    setEditingCategory(cat);
    if (cat) {
      setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', isActive: cat.isActive });
    } else {
      setCatForm({ name: '', slug: '', description: '', isActive: true });
    }
    setCatImage(null);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    Object.keys(catForm).forEach(key => formData.append(key, catForm[key]));
    if (catImage) formData.append('image', catImage);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created');
      }
      setIsCatModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchData();
    } catch (e) {
      toast.error('Error deleting category');
    }
  };

  // --- Service Handlers ---
  const handleOpenSrvModal = (srv = null) => {
    setEditingService(srv);
    if (srv) {
      setSrvForm({ 
        name: srv.name, 
        slug: srv.slug, 
        category: srv.category?._id || '', 
        basePrice: srv.basePrice, 
        duration: srv.duration || '', 
        description: srv.description || '', 
        isActive: srv.isActive 
      });
    } else {
      setSrvForm({ name: '', slug: '', category: categories[0]?._id || '', basePrice: '', duration: '', description: '', isActive: true });
    }
    setSrvImage(null);
    setIsSrvModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    Object.keys(srvForm).forEach(key => formData.append(key, srvForm[key]));
    if (srvImage) formData.append('image', srvImage);

    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData);
        toast.success('Service updated');
      } else {
        await api.post('/services', formData);
        toast.success('Service created');
      }
      setIsSrvModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error('Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchData();
    } catch (e) {
      toast.error('Error deleting service');
    }
  };

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
            <button 
              onClick={() => handleOpenCatModal()}
              className="flex items-center gap-1 text-sm font-medium text-accent-cyan hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          <div className="glass-panel p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Image</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-bg-tertiary/30">
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <img src={getCategoryImageUrl(cat.image)} className="w-10 h-10 rounded object-cover" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-bg-secondary border border-border-glass"></div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${cat.isActive ? 'text-success' : 'text-danger'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleOpenCatModal(cat)} className="text-text-muted hover:text-accent-cyan mr-3"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
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
            <button 
              onClick={() => handleOpenSrvModal()}
              className="flex items-center gap-1 text-sm font-medium text-accent-cyan hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="glass-panel p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg-tertiary/50 border-b border-border-glass">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-text-muted">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted">Price</th>
                  <th className="text-right px-4 py-3 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-glass">
                {services.map(srv => (
                  <tr key={srv._id} className="hover:bg-bg-tertiary/30">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      {srv.image ? (
                        <img src={getServiceImageUrl(srv.image)} className="w-8 h-8 rounded object-cover" alt="" />
                      ) : null}
                      {srv.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{srv.category?.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-accent-emerald">Rs. {srv.basePrice}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleOpenSrvModal(srv)} className="text-text-muted hover:text-accent-cyan mr-3"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteService(srv._id)} className="text-text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-primary rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-border-glass">
            <div className="flex justify-between items-center p-4 border-b border-border-glass">
              <h3 className="font-semibold text-lg">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                <input type="text" required value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
                <input type="text" required value={catForm.slug} onChange={e => setCatForm({...catForm, slug: e.target.value})} className="input-base w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea rows="2" value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} className="input-base w-full"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image</label>
                <input type="file" onChange={e => setCatImage(e.target.files[0])} className="input-base w-full text-sm" accept="image/*" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="catActive" checked={catForm.isActive} onChange={e => setCatForm({...catForm, isActive: e.target.checked})} className="rounded bg-bg-secondary border-border-glass text-accent-cyan focus:ring-accent-cyan" />
                <label htmlFor="catActive" className="text-sm font-medium text-text-primary">Active</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border-glass">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isSrvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-primary rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-border-glass">
            <div className="flex justify-between items-center p-4 border-b border-border-glass">
              <h3 className="font-semibold text-lg">{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setIsSrvModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                  <input type="text" required value={srvForm.name} onChange={e => setSrvForm({...srvForm, name: e.target.value})} className="input-base w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
                  <input type="text" required value={srvForm.slug} onChange={e => setSrvForm({...srvForm, slug: e.target.value})} className="input-base w-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                  <select required value={srvForm.category} onChange={e => setSrvForm({...srvForm, category: e.target.value})} className="input-base w-full">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Base Price (Rs)</label>
                  <input type="number" required value={srvForm.basePrice} onChange={e => setSrvForm({...srvForm, basePrice: e.target.value})} className="input-base w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Duration (e.g. "1 Hour")</label>
                <input type="text" value={srvForm.duration} onChange={e => setSrvForm({...srvForm, duration: e.target.value})} className="input-base w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea rows="3" value={srvForm.description} onChange={e => setSrvForm({...srvForm, description: e.target.value})} className="input-base w-full"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Image</label>
                <input type="file" onChange={e => setSrvImage(e.target.files[0])} className="input-base w-full text-sm" accept="image/*" />
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="srvActive" checked={srvForm.isActive} onChange={e => setSrvForm({...srvForm, isActive: e.target.checked})} className="rounded bg-bg-secondary border-border-glass text-accent-cyan focus:ring-accent-cyan" />
                <label htmlFor="srvActive" className="text-sm font-medium text-text-primary">Active</label>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border-glass mt-4">
                <button type="button" onClick={() => setIsSrvModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;

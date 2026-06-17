import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, MapPin, Star, Wrench } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { getServiceImageUrl } from '../../utils/uploadUrl';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          api.get(`/services?category=${categoryParam}&search=${searchParam}`),
          api.get('/categories')
        ]);
        setServices(servicesRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryParam, searchParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const searchVal = form.search.value;
    const newParams = new URLSearchParams(searchParams);
    if (searchVal) newParams.set('search', searchVal);
    else newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-bg-secondary border-b border-border-glass page-header relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-emerald/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
          <p className="text-text-muted max-w-2xl mx-auto">Browse through our comprehensive list of home maintenance and repair services provided by verified professionals.</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-1/4">
            <div className="glass-panel p-6 sticky top-[calc(var(--navbar-height)+1rem)]">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-emerald" /> Filters
              </h3>
              
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="text" 
                    name="search"
                    defaultValue={searchParam}
                    placeholder="Search services..." 
                    className="input-base pl-9"
                  />
                </div>
              </form>

              <div>
                <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Categories</h4>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => handleCategoryFilter('')}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${!categoryParam ? 'bg-accent-emerald/10 text-accent-emerald font-medium' : 'text-text-secondary hover:bg-bg-tertiary'}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <button 
                        onClick={() => handleCategoryFilter(cat._id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${categoryParam === cat._id ? 'bg-accent-emerald/10 text-accent-emerald font-medium' : 'text-text-secondary hover:bg-bg-tertiary'}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-panel h-64 animate-pulse"></div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <div className="glass-panel p-0 overflow-hidden group h-full flex flex-col">
                      <div className="h-48 bg-bg-tertiary relative overflow-hidden">
                        {service.image ? (
                          <img src={getServiceImageUrl(service.image)} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-tertiary to-bg-secondary">
                             <Wrench className="w-12 h-12 text-text-muted opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-bg-primary/80 backdrop-blur-md px-3 py-1 text-xs font-semibold rounded-full border border-border-glass text-accent-cyan">
                          {service.category?.name}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-emerald transition-colors">{service.name}</h3>
                        <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-grow">{service.description || 'Professional home service provided by verified technicians.'}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-glass">
                          <div>
                            <span className="text-xs text-text-muted block">Starting from</span>
                            <span className="text-lg font-bold text-text-primary">Rs. {service.basePrice}</span>
                          </div>
                          <Link 
                            to={`/services/${service.slug}`}
                            className="bg-bg-tertiary hover:bg-accent-emerald hover:text-white text-text-primary text-sm font-medium py-2 px-4 rounded-lg transition-colors border border-border-glass hover:border-accent-emerald"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center">
                <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-text-muted">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="mt-6 text-accent-emerald font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

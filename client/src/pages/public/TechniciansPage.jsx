import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, CheckCircle2 } from 'lucide-react';
import { api } from '../../contexts/AuthContext';

const TechniciansPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const cityParam = searchParams.get('city') || '';
  const searchParam = searchParams.get('search') || '';

  useEffect(() => {
    const fetchTechs = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/technicians?city=${cityParam}&search=${searchParam}`);
        setTechnicians(res.data.data);
      } catch (error) {
        console.error('Failed to fetch technicians', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, [cityParam, searchParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const searchVal = form.search.value;
    const cityVal = form.city.value;
    
    const newParams = new URLSearchParams();
    if (searchVal) newParams.set('search', searchVal);
    if (cityVal) newParams.set('city', cityVal);
    
    setSearchParams(newParams);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-glass page-header relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Professionals</h1>
          <p className="text-text-muted max-w-2xl mx-auto">Discover top-rated, verified home service experts in your city. Read reviews and book directly.</p>
        </div>
      </div>

      <div className="container py-12">
        {/* Filters */}
        <div className="glass-panel p-4 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-text-primary font-semibold shrink-0">
            <Filter className="w-5 h-5 text-accent-cyan" /> Filter:
          </div>
          <form onSubmit={handleSearch} className="flex-grow flex flex-col md:flex-row gap-4 w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                name="search"
                defaultValue={searchParam}
                placeholder="Search by name..." 
                className="input-base pl-9 w-full"
              />
            </div>
            <div className="relative w-full md:w-64 shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <select 
                name="city" 
                defaultValue={cityParam}
                className="input-base pl-9 w-full appearance-none bg-bg-tertiary"
              >
                <option value="">All Cities</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Rawalpindi">Rawalpindi</option>
              </select>
            </div>
            <button type="submit" className="bg-accent-cyan hover:bg-cyan-400 text-bg-primary font-bold px-6 py-2 rounded-lg transition-colors shrink-0">
              Apply
            </button>
          </form>
        </div>

        {/* Tech Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel h-80 animate-pulse"></div>
            ))}
          </div>
        ) : technicians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech, idx) => (
              <motion.div
                key={tech._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel p-6 flex flex-col hover:shadow-glow hover:border-accent-cyan transition-all"
              >
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border-glass">
                  <div className="relative">
                    <img src={tech.user?.avatar ? `/uploads/avatars/${tech.user.avatar}` : 'https://ui-avatars.com/api/?name='+tech.user?.name} alt={tech.user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-border-glass" />
                    <div className="absolute -bottom-1 -right-1 bg-bg-primary rounded-full p-0.5">
                      <CheckCircle2 className="w-5 h-5 text-accent-cyan" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tech.user?.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
                      <MapPin className="w-3 h-3" /> {tech.user?.city}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-grow">{tech.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tech.skills.slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="text-xs bg-bg-tertiary border border-border-glass px-2 py-1 rounded text-text-secondary">
                      {skill}
                    </span>
                  ))}
                  {tech.skills.length > 3 && <span className="text-xs text-text-muted self-center">+{tech.skills.length - 3} more</span>}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span className="font-bold text-text-primary">{tech.avgRating.toFixed(1)}</span>
                    <span className="text-xs text-text-muted">({tech.totalReviews})</span>
                  </div>
                  <Link 
                    to={`/technicians/${tech._id}`}
                    className="text-sm font-medium text-accent-cyan hover:text-cyan-400 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center">
             <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
             <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
             <p className="text-text-muted">Try a different search term or city.</p>
             <button 
                onClick={() => setSearchParams({})}
                className="mt-4 text-accent-cyan hover:underline"
              >
                Clear all filters
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechniciansPage;

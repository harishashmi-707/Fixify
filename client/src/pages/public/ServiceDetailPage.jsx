import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, CheckCircle2, MapPin, Star, ArrowLeft } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [service, setService] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await api.get(`/services/${slug}`);
        setService(res.data.data);
        
        // Fetch technicians offering this service
        // In a real app, this would be a specific endpoint. 
        // For now, we fetch all and filter client-side or assume backend handles it.
        const techsRes = await api.get(`/technicians`);
        const matchingTechs = techsRes.data.data.filter(t => 
          t.services.some(s => s.service._id === res.data.data._id)
        );
        setTechnicians(matchingTechs);
      } catch (error) {
        console.error('Failed to fetch service', error);
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchServiceDetails();
  }, [slug, navigate]);

  if (loading) return <div className="w-full min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-emerald"></div></div>;
  if (!service) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-glass page-header">
        <div className="container">
          <Link to="/services" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/3">
              <div className="inline-block px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium rounded-full mb-4">
                {service.category?.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{service.name}</h1>
              <p className="text-lg text-text-muted mb-6">{service.description || 'Professional home service provided by verified technicians.'}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-text-secondary bg-bg-tertiary px-4 py-2 rounded-lg border border-border-glass">
                  <Clock className="w-4 h-4 text-accent-emerald" /> Approx. {service.durationMinutes} mins
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary bg-bg-tertiary px-4 py-2 rounded-lg border border-border-glass">
                  <ShieldCheck className="w-4 h-4 text-accent-emerald" /> Verified Professionals
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="glass-panel p-6 border-accent-emerald/30 shadow-glow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/10 blur-[50px] rounded-full"></div>
                <h3 className="text-text-muted text-sm uppercase tracking-wider mb-2 font-semibold">Starting Price</h3>
                <div className="text-4xl font-bold text-text-primary mb-6">Rs. {service.basePrice}</div>
                
                {isAuthenticated ? (
                   <button 
                     onClick={() => document.getElementById('technicians-section').scrollIntoView({ behavior: 'smooth' })}
                     className="w-full bg-accent-emerald hover:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
                   >
                     Select Technician to Book
                   </button>
                ) : (
                  <Link 
                    to="/login"
                    className="block w-full text-center bg-bg-primary border border-border-glass hover:border-accent-emerald text-text-primary font-bold py-3 rounded-lg transition-colors"
                  >
                    Log in to Book
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technicians List */}
      <div id="technicians-section" className="container py-16">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 flex items-center gap-3">
          Available Technicians <span className="text-sm font-normal text-text-muted bg-bg-tertiary px-3 py-1 rounded-full">{technicians.length} found</span>
        </h2>
        
        {technicians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech, idx) => {
              const techServicePrice = tech.services.find(s => s.service._id === service._id)?.customPrice || service.basePrice;
              return (
                <motion.div
                  key={tech._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="glass-panel p-6 flex flex-col hover:border-accent-cyan transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img src={getAvatarUrl(tech.user?.avatar, tech.user?.name)} alt={tech.user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-border-glass" />
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {tech.user?.name}
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-warning mb-1">
                        <Star className="w-4 h-4 fill-warning" />
                        <span className="font-medium text-text-primary">{tech.avgRating.toFixed(1)}</span>
                        <span className="text-text-muted">({tech.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-text-muted">
                        <MapPin className="w-3 h-3" /> {tech.user?.city}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary line-clamp-2 mb-6 flex-grow">{tech.bio}</p>
                  
                  <div className="flex items-center justify-between border-t border-border-glass pt-4 mt-auto">
                    <div>
                      <div className="text-xs text-text-muted">Price Quote</div>
                      <div className="text-lg font-bold">Rs. {techServicePrice}</div>
                    </div>
                    {isAuthenticated ? (
                       <Link 
                         to={`/book?service=${service._id}&tech=${tech._id}`}
                         className="bg-accent-cyan/10 hover:bg-accent-cyan text-accent-cyan hover:text-bg-primary px-4 py-2 rounded-lg font-medium transition-colors border border-accent-cyan/30"
                       >
                         Book Now
                       </Link>
                    ) : (
                      <Link to="/login" className="text-sm text-accent-cyan hover:underline">Login to book</Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">No technicians currently available</h3>
            <p className="text-text-muted mb-6">Sorry, we don't have any technicians offering this service right now. Please check back later.</p>
            <Link to="/services" className="text-accent-emerald hover:underline font-medium">Browse other services</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailPage;

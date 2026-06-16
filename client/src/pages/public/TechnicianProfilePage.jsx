import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ShieldCheck, Clock, CheckCircle2, Award, ArrowLeft, Mail, Phone } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';

const TechnicianProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [tech, setTech] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techRes, reviewsRes] = await Promise.all([
          api.get(`/technicians/${id}`),
          api.get(`/reviews/technician/${id}`) // Assuming this route exists
        ]);
        setTech(techRes.data.data);
        setReviews(reviewsRes.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        // Only redirect if tech fetch fails
        if(error.config.url.includes('/technicians/')) {
            navigate('/technicians');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, navigate]);

  if (loading) return <div className="w-full min-h-[50vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-cyan"></div></div>;
  if (!tech) return null;

  return (
    <div className="w-full">
      {/* Profile Header Block */}
      <div className="bg-bg-secondary border-b border-border-glass page-header">
        <div className="container max-w-5xl">
          <Link to="/technicians" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8">
             <ArrowLeft className="w-4 h-4" /> Back to Professionals
          </Link>
          
          <div className="glass-panel p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <img 
              src={tech.user?.avatar ? `/uploads/avatars/${tech.user.avatar}` : 'https://ui-avatars.com/api/?name='+tech.user?.name} 
              alt={tech.user?.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-bg-secondary shadow-lg z-10 relative" 
            />
            
            <div className="flex-grow z-10 relative w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-3">
                    {tech.user?.name}
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </h1>
                  <div className="flex items-center gap-4 text-text-secondary mt-2 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {tech.user?.city}</span>
                    <span className="flex items-center gap-1 text-warning font-medium">
                      <Star className="w-4 h-4 fill-warning" /> {tech.avgRating.toFixed(1)} ({tech.totalReviews} Reviews)
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                   {isAuthenticated ? (
                     <button className="bg-accent-cyan hover:bg-cyan-400 text-bg-primary font-bold px-6 py-2 rounded-lg transition-colors shadow-glow whitespace-nowrap">
                       Book Now
                     </button>
                   ) : (
                     <Link to="/login" className="bg-bg-tertiary border border-border-glass hover:border-accent-cyan text-text-primary font-medium px-6 py-2 rounded-lg transition-colors">
                       Log in to Book
                     </Link>
                   )}
                </div>
              </div>
              
              <div className="bg-bg-primary/50 border border-border-glass rounded-xl p-4 flex flex-wrap gap-6 mb-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Completed Jobs</div>
                  <div className="font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-accent-emerald" /> {tech.totalJobs}+</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Experience</div>
                  <div className="font-bold flex items-center gap-1"><Award className="w-4 h-4 text-accent-emerald" /> {tech.experienceYears} Years</div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Base Rate</div>
                  <div className="font-bold text-accent-cyan">Rs. {tech.hourlyRate}/hr</div>
                </div>
              </div>

              <div className="text-text-secondary">
                <h3 className="text-text-primary font-semibold mb-1">About</h3>
                <p className="text-sm leading-relaxed">{tech.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="font-display font-semibold mb-4 text-lg border-b border-border-glass pb-2">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, idx) => (
                  <span key={idx} className="bg-bg-tertiary border border-border-glass px-3 py-1 rounded-full text-sm text-text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-display font-semibold mb-4 text-lg border-b border-border-glass pb-2">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <Clock className="w-4 h-4 text-accent-cyan" />
                  <span>{tech.availableFrom} - {tech.availableTo}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span key={day} className={`text-xs w-8 h-8 rounded-full flex items-center justify-center border ${tech.workingDays.includes(day) ? 'bg-accent-emerald/20 border-accent-emerald/30 text-accent-emerald' : 'bg-bg-tertiary border-border-glass text-text-muted'}`}>
                      {day.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Services & Reviews */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tech.services.map((s, idx) => (
                  <div key={idx} className="glass-panel p-4 flex justify-between items-center hover:border-accent-cyan transition-colors group">
                    <div>
                      <h4 className="font-semibold group-hover:text-accent-cyan transition-colors">{s.service?.name}</h4>
                      <div className="text-xs text-text-muted mt-1">Custom rate applied</div>
                    </div>
                    <div className="font-bold text-accent-cyan">
                      Rs. {s.customPrice || s.service?.basePrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Customer Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review._id} className="glass-panel p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-bold text-text-muted">
                            {review.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{review.user?.name}</div>
                            <div className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-warning' : 'text-border-glass'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">{review.comment}</p>
                      
                      {review.reply && (
                        <div className="mt-4 bg-bg-primary/50 border-l-2 border-accent-cyan p-3 text-sm">
                          <span className="font-semibold text-accent-cyan block mb-1">Reply from {tech.user?.name}:</span>
                          <span className="text-text-muted">{review.reply}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 text-center text-text-muted">
                  <Star className="w-8 h-8 text-border-glass mx-auto mb-2" />
                  <p>No reviews yet for this professional.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfilePage;

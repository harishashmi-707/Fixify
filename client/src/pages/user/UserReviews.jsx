import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api, assetUrl } from '../../contexts/AuthContext';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/me');
        setReviews(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <div className="p-12 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">My Reviews</h1>
        <p className="text-text-muted">Reviews you have written for technicians.</p>
      </div>

      <div className="glass-panel p-0 overflow-hidden">
        {reviews.length > 0 ? (
          <div className="divide-y divide-border-glass">
            {reviews.map(r => (
              <div key={r._id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-64 shrink-0 border-r border-border-glass pr-6">
                    <div className="text-sm text-text-muted mb-2">Technician</div>
                    <div className="flex items-center gap-3">
                      <img src={r.technician?.user?.avatar ? assetUrl(`/uploads/avatars/${r.technician.user.avatar}`) : `https://ui-avatars.com/api/?name=${r.technician?.user?.name}`} className="w-10 h-10 rounded-full object-cover" alt="" />
                      <div className="font-semibold">{r.technician?.user?.name}</div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= r.rating ? 'fill-warning text-warning' : 'text-border-glass'}`} />
                        ))}
                      </div>
                      <div className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{r.comment || 'No comment provided.'}</p>
                    {r.reply && (
                      <div className="mt-4 bg-bg-tertiary/50 p-4 rounded-lg border border-border-glass relative">
                        <div className="absolute top-0 left-4 w-3 h-3 bg-bg-tertiary border-l border-t border-border-glass -mt-[7px] rotate-45"></div>
                        <div className="font-semibold text-xs mb-1">Technician Reply</div>
                        <p className="text-sm text-text-secondary">{r.reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>You haven't written any reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviews;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Wrench } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [role, setRole] = useState('user'); // 'user' or 'technician'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    cnic: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      const dataToSubmit = { ...formData, role };
      const user = await register(dataToSubmit);
      toast.success('Registration successful!');
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center relative py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-accent-emerald/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="glass-panel w-full max-w-lg p-8 relative z-10 border-accent-cyan/20 shadow-glow">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-accent-emerald/10 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-accent-emerald" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Create an Account</h1>
          <p className="text-text-muted text-sm">Join Fixify today</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-bg-tertiary rounded-lg mb-8 border border-border-glass">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'user' ? 'bg-bg-secondary shadow-md text-text-primary border border-border-glass' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setRole('user')}
          >
            I need services
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'technician' ? 'bg-bg-secondary shadow-md text-text-primary border border-border-glass' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setRole('technician')}
          >
            I am a professional
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Doe" className="input-base pl-10" required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select name="city" value={formData.city} onChange={handleChange} className="input-base pl-10 appearance-none bg-bg-tertiary" required>
                  <option value="">Select City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-base pl-10" required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="0300 1234567" className="input-base pl-10" required
                />
              </div>
            </div>
          </div>

          {role === 'technician' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">CNIC Number</label>
              <div className="relative">
                <input 
                  type="text" name="cnic" value={formData.cnic} onChange={handleChange}
                  placeholder="12345-1234567-1" className="input-base" required
                />
              </div>
              <p className="text-xs text-text-muted mt-1">Required for background verification.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" className="input-base pl-10" required minLength="6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="••••••••" className="input-base pl-10" required minLength="6"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent-cyan hover:bg-cyan-400 disabled:opacity-50 text-bg-primary font-bold py-3 rounded-lg transition-colors shadow-lg mt-6"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted border-t border-border-glass pt-6">
          Already have an account? <Link to="/login" className="text-accent-emerald hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

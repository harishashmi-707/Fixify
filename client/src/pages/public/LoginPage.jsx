import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Wrench } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(email, password);
      toast.success('Successfully logged in!');
      
      // Navigate based on role if no specific redirect
      if (from === '/') {
        navigate(`/${user.role}/dashboard`);
      } else {
        navigate(from);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (role) => {
    let demoEmail = '';
    const demoPassword = 'password';

    if (role === 'admin') {
      demoEmail = 'admin@fixithub.pk';
    } else if (role === 'user') {
      demoEmail = 'ahmed@example.com';
    } else {
      demoEmail = 'usman@example.com';
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Automatically log in
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      toast.success('Successfully logged in!');
      
      if (from === '/') {
        navigate(`/${user.role}/dashboard`);
      } else {
        navigate(from);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-emerald/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="glass-panel w-full max-w-md p-8 relative z-10 border-accent-emerald/20 shadow-glow">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-accent-emerald/10 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-accent-emerald" />
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm">Sign in to your Fixify account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base pl-10"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <Link to="/forgot-password" className="text-xs text-accent-cyan hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base pl-10"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent-emerald hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors shadow-lg mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-accent-cyan hover:underline font-medium">Sign up</Link>
        </div>

        {/* Demo Accounts Wrapper */}
        <div className="mt-8 pt-6 border-t border-border-glass">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-text-muted">
            <AlertCircle className="w-4 h-4" /> Demo Credentials
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => fillDemo('user')} className="text-xs py-2 bg-bg-tertiary border border-border-glass rounded hover:border-accent-cyan transition-colors text-text-secondary">User</button>
            <button type="button" onClick={() => fillDemo('tech')} className="text-xs py-2 bg-bg-tertiary border border-border-glass rounded hover:border-accent-cyan transition-colors text-text-secondary">Technician</button>
            <button type="button" onClick={() => fillDemo('admin')} className="text-xs py-2 bg-bg-tertiary border border-border-glass rounded hover:border-accent-cyan transition-colors text-text-secondary">Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

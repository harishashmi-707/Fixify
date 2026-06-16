import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Wrench, Menu, X, Sun, Moon, Bell, User, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/technicians', label: 'Technicians' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact Us' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path) =>
    `text-sm font-medium transition-colors ${isLinkActive(path) ? 'text-accent-emerald' : 'text-text-secondary hover:text-accent-cyan'}`;

  const getMobileLinkClass = (path) =>
    `py-2 border-b border-border-glass ${isLinkActive(path) ? 'text-accent-emerald' : 'text-text-secondary hover:text-accent-cyan'}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-bg-primary/80 backdrop-blur-md border-b border-border-glass shadow-glass' 
        : 'py-4 bg-transparent'
    }`}>
      <div className="container flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent-emerald/10 p-2 rounded-lg group-hover:bg-accent-emerald/20 transition-colors">
            <Wrench className="w-6 h-6 text-accent-emerald" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-text-primary">
            Fixify
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={getLinkClass(link.to)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-text-secondary hover:text-text-primary transition-colors bg-bg-tertiary rounded-full border border-border-glass"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
              </button>
              
              <Link to={`/${user?.role}/dashboard`} className="flex items-center gap-2 bg-bg-tertiary border border-border-glass py-1.5 px-3 rounded-full hover:border-accent-emerald transition-colors">
                <div className="w-6 h-6 rounded-full bg-accent-emerald/20 flex items-center justify-center text-accent-emerald">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-text-primary">{user?.name?.split(' ')[0]}</span>
              </Link>

              <button 
                onClick={logout} 
                className="p-2 text-text-secondary hover:text-danger transition-colors bg-bg-tertiary rounded-full border border-border-glass"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Log In</Link>
              <Link to="/register" className="text-sm font-medium bg-accent-emerald text-black px-4 py-2 rounded-full shadow-glow hover:bg-emerald-400 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-secondary border-b border-border-glass shadow-glass py-4 px-6 flex flex-col gap-4 max-h-[calc(100vh-var(--navbar-height))] overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={getMobileLinkClass(link.to)}>
              {link.label}
            </Link>
          ))}
          
          <div className="flex items-center justify-between py-2 border-b border-border-glass">
            <span className="text-text-secondary">Theme</span>
            <button onClick={toggleTheme} className="p-2 bg-bg-tertiary rounded-full border border-border-glass">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-text-primary" /> : <Moon className="w-4 h-4 text-text-primary" />}
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link to={`/${user?.role}/dashboard`} className="bg-bg-tertiary text-center py-2 rounded-lg text-text-primary border border-border-glass">Dashboard</Link>
              <button onClick={logout} className="text-danger py-2">Log Out</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" className="bg-bg-tertiary text-center py-2 rounded-lg text-text-primary border border-border-glass">Log In</Link>
              <Link to="/register" className="text-center py-2 rounded-lg text-white shadow-glow bg-accent-emerald hover:bg-emerald-400 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

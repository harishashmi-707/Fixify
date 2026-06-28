import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Wrench, Menu, X, Sun, Moon, Bell, User, LogOut, Check } from 'lucide-react';
import { api } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import toast from 'react-hot-toast';

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
  const { socket } = useSocket();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
      toast(notification.message, { icon: '🔔' });
    };

    socket.on('new_notification', handleNewNotification);
    return () => socket.off('new_notification', handleNewNotification);
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

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
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-danger rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-bg-primary">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-border-glass rounded-xl shadow-glass overflow-hidden z-50">
                    <div className="p-3 border-b border-border-glass flex justify-between items-center bg-bg-tertiary">
                      <h3 className="font-semibold text-text-primary">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-accent-cyan hover:underline flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map(notif => (
                          <div key={notif._id} className={`p-3 border-b border-border-glass last:border-0 hover:bg-bg-tertiary transition-colors ${!notif.isRead ? 'bg-bg-tertiary/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-accent-cyan' : 'bg-transparent'}`}></div>
                              <div>
                                <p className="text-sm text-text-primary">{notif.message}</p>
                                <span className="text-xs text-text-muted mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-text-muted text-sm">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
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

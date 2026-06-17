import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, assetUrl } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, Calendar, MessageSquare, Star, User, 
  Settings, DollarSign, Users, Briefcase, FileText, Activity, LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;
  let links = [];

  if (role === 'user') {
    links = [
      { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/user/bookings', icon: Calendar, label: 'My Bookings' },
      { to: '/user/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/user/reviews', icon: Star, label: 'Reviews' },
      { to: '/user/profile', icon: User, label: 'Profile Settings' },
    ];
  } else if (role === 'technician') {
    links = [
      { to: '/technician/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/technician/bookings', icon: Calendar, label: 'Job Requests' },
      { to: '/technician/earnings', icon: DollarSign, label: 'Earnings' },
      { to: '/technician/availability', icon: Activity, label: 'Availability' },
      { to: '/technician/profile', icon: User, label: 'Professional Profile' },
    ];
  } else if (role === 'admin') {
    links = [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/technicians', icon: Briefcase, label: 'Technicians' },
      { to: '/admin/bookings', icon: Calendar, label: 'All Bookings' },
      { to: '/admin/services', icon: Settings, label: 'Services Config' },
      { to: '/admin/reports', icon: FileText, label: 'Reports' },
    ];
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
      isActive 
        ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20' 
        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 ${
      isActive 
        ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20' 
        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
    }`;

  return (
    <>
      {/* Mobile navigation */}
      <nav className="md:hidden sticky top-[var(--navbar-height)] z-20 bg-bg-secondary border-b border-border-glass overflow-x-auto">
        <div className="flex gap-1 px-3 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className={mobileLinkClass}>
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-bg-secondary border-r border-border-glass sticky top-[var(--navbar-height)] self-start h-[calc(100vh-var(--navbar-height))] overflow-y-auto z-10">
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-bg-tertiary border-2 border-border-glass overflow-hidden mb-3">
            <img src={user.avatar ? assetUrl(`/uploads/avatars/${user.avatar}`) : 'https://ui-avatars.com/api/?name='+user.name} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <h4 className="font-semibold text-text-primary">{user.name}</h4>
          <p className="text-xs text-text-muted capitalize">{role}</p>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <Icon className="w-5 h-5 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-glass mt-auto">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-danger hover:bg-danger/10"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { useAuth } from './contexts/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import TechniciansPage from './pages/public/TechniciansPage';
import TechnicianProfilePage from './pages/public/TechnicianProfilePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';

// User Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import UserProfile from './pages/user/UserProfile';
import UserMessages from './pages/user/UserMessages';
import UserReviews from './pages/user/UserReviews';

// Technician Dashboard Pages
import TechDashboard from './pages/technician/TechDashboard';
import TechBookings from './pages/technician/TechBookings';
import TechEarnings from './pages/technician/TechEarnings';
import TechAvailability from './pages/technician/TechAvailability';
import TechProfile from './pages/technician/TechProfile';
import TechMessages from './pages/technician/TechMessages';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTechnicians from './pages/admin/AdminTechnicians';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminReports from './pages/admin/AdminReports';

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isDashboard = /^\/(user|technician|admin)\//.test(location.pathname);

  if (loading) {
    return null;
  }

  return (
    <div className="app-wrapper flex flex-col min-h-screen">
      <Navbar />
      
      <main className={`flex-grow ${isDashboard ? '' : 'pt-20'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/technicians/:id" element={<TechnicianProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/bookings" element={<UserBookings />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/messages" element={<UserMessages />} />
              <Route path="/user/reviews" element={<UserReviews />} />
            </Route>
          </Route>

          {/* Technician Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['technician']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/technician/dashboard" element={<TechDashboard />} />
              <Route path="/technician/bookings" element={<TechBookings />} />
              <Route path="/technician/messages" element={<TechMessages />} />
              <Route path="/technician/earnings" element={<TechEarnings />} />
              <Route path="/technician/availability" element={<TechAvailability />} />
              <Route path="/technician/profile" element={<TechProfile />} />
            </Route>
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/technicians" element={<AdminTechnicians />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isDashboard && <Footer />}
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-glass)',
          }
        }}
      />
    </div>
  );
}

export default App;

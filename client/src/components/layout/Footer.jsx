import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-border-glass pt-16 pb-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Wrench className="w-6 h-6 text-accent-emerald" />
              <span className="font-display font-bold text-xl text-text-primary">
                Fixify
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-xs">
              Pakistan's most trusted platform for booking verified home service professionals. Quality service at your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan transition-colors">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">All Services</Link></li>
              <li><Link to="/technicians" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Our Technicians</Link></li>
              <li><Link to="/faq" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">FAQ's</Link></li>
              <li><Link to="/contact" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Top Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services?category=mobile-repair" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Mobile Repair</Link></li>
              <li><Link to="/services?category=ac-services" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">AC Installation & Repair</Link></li>
              <li><Link to="/services?category=electrician" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Electrical Works</Link></li>
              <li><Link to="/services?category=plumbing" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Plumbing Services</Link></li>
              <li><Link to="/services?category=home-maintenance" className="text-sm text-text-secondary hover:text-accent-emerald transition-colors">Home Maintenance</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-text-primary mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">Blue Area, Islamabad,<br/> Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-emerald shrink-0" />
                <span className="text-sm text-text-secondary">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-emerald shrink-0" />
                <span className="text-sm text-text-secondary">support@fixify.pk</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-border-glass pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted text-center md:text-left">
            &copy; {new Date().getFullYear()} Fixify Pakistan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-text-muted hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-text-muted hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

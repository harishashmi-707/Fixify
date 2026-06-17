import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      const data = res.data;
      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-bg-secondary border-b border-border-glass page-header relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-emerald/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
          <p className="text-text-muted max-w-2xl mx-auto">Have questions? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="font-display font-bold text-lg mb-6 border-b border-border-glass pb-3">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-emerald/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent-emerald" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Office Address</h4>
                    <p className="text-text-secondary text-sm">Blue Area, Jinnah Avenue,<br />Islamabad, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Phone</h4>
                    <p className="text-text-secondary text-sm">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Email</h4>
                    <p className="text-text-secondary text-sm">support@fixify.pk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-8">
              <h3 className="font-display font-bold text-lg mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="input-base" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-base" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="0300 1234567" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" className="input-base" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Your message..." className="input-base resize-none" required></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-accent-emerald hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

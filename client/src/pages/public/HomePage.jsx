import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Wrench, Zap, Droplets, Snowflake, Laptop, ChevronRight, Star, ShieldCheck, Clock } from 'lucide-react';
import HeroAnimation from '../../components/HeroAnimation';

const categories = [
  { id: 1, name: 'Mobile Repair', icon: Wrench, count: 120, slug: 'mobile-repair' },
  { id: 2, name: 'Laptop Repair', icon: Laptop, count: 85, slug: 'laptop-repair' },
  { id: 3, name: 'Electrician', icon: Zap, count: 210, slug: 'electrician' },
  { id: 4, name: 'Plumbing', icon: Droplets, count: 150, slug: 'plumbing' },
  { id: 5, name: 'AC Services', icon: Snowflake, count: 320, slug: 'ac-services' },
];

const steps = [
  { title: "Search & Select", desc: "Find the exact service you need from our verified professionals.", icon: Search },
  { title: "Book a Time", desc: "Choose a convenient date and time for the technician to visit.", icon: Clock },
  { title: "Get it Fixed", desc: "Our expert arrives, completes the job, and you pay securely.", icon: ShieldCheck },
];

const HomePage = () => {
  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-accent-emerald rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute top-20 left-40 w-96 h-96 bg-accent-cyan rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-glass bg-bg-tertiary/50 backdrop-blur-md mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                <span className="text-sm font-medium text-text-secondary">Pakistan's #1 Home Services Platform</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight"
              >
                Expert Home Services, <br />
                <span className="text-gradient">Just a Click Away.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-text-muted mb-10 max-w-2xl"
              >
                From AC repairs to deep cleaning, book trusted professionals at transparent prices. We bring convenience to your doorstep.
              </motion.p>

              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-panel p-2 flex flex-col sm:flex-row gap-2 relative z-20 shadow-glow"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="What do you need help with?" 
                    className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-text-primary focus:outline-none placeholder:text-text-muted"
                  />
                </div>
                <div className="w-px bg-border-glass hidden sm:block my-2"></div>
                <div className="flex-1 relative border-t border-border-glass sm:border-none">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <select className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-text-primary focus:outline-none appearance-none cursor-pointer">
                    <option value="" className="text-black">Select City</option>
                    <option value="islamabad" className="text-black">Islamabad</option>
                    <option value="lahore" className="text-black">Lahore</option>
                    <option value="karachi" className="text-black">Karachi</option>
                  </select>
                </div>
                <button className="bg-accent-emerald hover:bg-emerald-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg">
                  Search
                </button>
              </motion.div>
            </div>

            {/* Right Column - Animation */}
            <div className="hidden lg:block w-full">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-bg-secondary/50 border-y border-border-glass">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-3">Explore Categories</h2>
              <p className="text-text-muted">Find the right professional for your specific needs.</p>
            </div>
            <Link to="/services" className="flex items-center gap-1 text-accent-cyan hover:text-accent-emerald font-medium transition-colors shrink-0">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link 
                    to={`/services?category=${cat.slug}`}
                    className="glass-panel p-6 flex flex-col items-center text-center group hover:border-accent-emerald transition-all duration-300 hover:-translate-y-1 h-full block"
                  >
                    <div className="w-14 h-14 rounded-full bg-bg-tertiary flex items-center justify-center mb-4 group-hover:bg-accent-emerald/20 transition-colors">
                      <Icon className="w-7 h-7 text-text-primary group-hover:text-accent-emerald transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-accent-emerald transition-colors">{cat.name}</h3>
                    <p className="text-sm text-text-muted">{cat.count}+ Pros</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">How Fixify Works</h2>
            <p className="text-text-muted">Booking a trusted professional has never been this simple.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-accent-emerald/20 via-accent-cyan/20 to-accent-emerald/20 z-0"></div>

            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="relative z-10 text-center px-4"
                >
                  <div className="w-24 h-24 mx-auto bg-bg-tertiary border-2 border-border-glass rounded-full flex items-center justify-center mb-6 shadow-glass relative group">
                    <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                    <Icon className="w-10 h-10 text-accent-emerald" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-bg-secondary border border-border-glass flex items-center justify-center text-sm font-bold text-text-primary z-10">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-text-muted text-sm">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden border-t border-border-glass">
        <div className="absolute inset-0 bg-accent-emerald/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Fix Your Home?</h2>
          <p className="text-lg text-text-muted mb-8">Join thousands of satisfied customers who trust Fixify for their home maintenance needs.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/services" className="w-full sm:w-auto bg-accent-emerald hover:bg-emerald-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-glow">
              Book a Service Now
            </Link>
            <Link to="/register?role=technician" className="w-full sm:w-auto bg-bg-tertiary hover:bg-border-glass text-text-primary border border-border-glass font-semibold py-3 px-8 rounded-lg transition-colors">
              Join as a Professional
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

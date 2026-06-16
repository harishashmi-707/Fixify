import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, Heart, Target, Rocket } from 'lucide-react';

const stats = [
  { value: '5,000+', label: 'Bookings Completed' },
  { value: '350+', label: 'Verified Professionals' },
  { value: '15+', label: 'Cities Covered' },
  { value: '4.8', label: 'Average Rating' },
];

const values = [
  { icon: Shield, title: 'Trust & Safety', desc: 'All our professionals undergo background verification and skill assessments before joining.' },
  { icon: Heart, title: 'Customer First', desc: 'We prioritize your satisfaction with transparent pricing and quality guarantees.' },
  { icon: Target, title: 'Reliability', desc: 'On-time arrivals, professional conduct, and consistent service quality across Pakistan.' },
  { icon: Rocket, title: 'Innovation', desc: 'We leverage technology to make booking home services as easy as ordering food online.' },
];

const AboutPage = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-glass page-header relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Fixify</h1>
          <p className="text-text-muted max-w-2xl mx-auto">Pakistan's most trusted platform for booking verified home service professionals.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20">
        <div className="container max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-glass bg-bg-tertiary/50 backdrop-blur-md mb-6">
              <span className="text-sm font-medium text-accent-emerald">OUR MISSION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Making Home Services <span className="text-gradient">Accessible</span> to Every Pakistani</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Fixify was born from a simple observation: finding reliable home service professionals in Pakistan is unnecessarily difficult. 
              We built a platform that connects homeowners with verified, skilled professionals — making it easy to get your AC fixed, 
              plumbing sorted, or electrical work done, all with transparent pricing and quality assurance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-bg-secondary/50 border-y border-border-glass">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Core Values</h2>
            <p className="text-text-muted">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="glass-panel p-8 flex gap-5 items-start hover:border-accent-emerald/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-accent-emerald" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-2">{v.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

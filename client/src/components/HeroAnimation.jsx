import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Zap, Droplets, Snowflake } from 'lucide-react';

const HeroAnimation = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 10 }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background glow effects */}
      <motion.div 
        variants={pulseVariants}
        animate="animate"
        className="absolute w-[300px] h-[300px] bg-accent-emerald/20 rounded-full blur-[80px]" 
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[400px] aspect-square flex items-center justify-center"
      >
        {/* Central House SVG */}
        <motion.div variants={itemVariants} className="relative z-20">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20L20 100H40V180H160V100H180L100 20Z" fill="var(--color-bg-tertiary)" stroke="var(--color-border-glass)" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M80 180V120H120V180" fill="var(--color-bg-secondary)" stroke="var(--color-accent-emerald)" strokeWidth="3" strokeLinejoin="round"/>
            <rect x="60" y="80" width="30" height="30" rx="4" fill="var(--color-accent-cyan)" fillOpacity="0.2" stroke="var(--color-accent-cyan)" strokeWidth="2"/>
            <rect x="110" y="80" width="30" height="30" rx="4" fill="var(--color-accent-emerald)" fillOpacity="0.2" stroke="var(--color-accent-emerald)" strokeWidth="2"/>
            
            {/* Animated glowing windows */}
            <motion.rect 
              animate={{ opacity: [0.2, 0.8, 0.2] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              x="62" y="82" width="26" height="26" rx="2" fill="var(--color-accent-cyan)" 
            />
            <motion.rect 
              animate={{ opacity: [0.2, 0.8, 0.2] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              x="112" y="82" width="26" height="26" rx="2" fill="var(--color-accent-emerald)" 
            />
          </svg>
        </motion.div>

        {/* Orbiting Icons */}
        <div className="absolute inset-0">
          {/* Top Left */}
          <motion.div variants={itemVariants} className="absolute top-[10%] left-[10%]">
            <motion.div variants={floatVariants} animate="animate" style={{ animationDelay: '0s' }}>
              <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-glass shadow-glow flex items-center justify-center relative">
                <Wrench className="w-8 h-8 text-accent-cyan" />
                <svg className="absolute -right-8 top-1/2 w-8 h-8 -translate-y-1/2 opacity-50" viewBox="0 0 40 40">
                  <path d="M0,20 Q20,20 40,20" stroke="var(--color-accent-cyan)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Top Right */}
          <motion.div variants={itemVariants} className="absolute top-[10%] right-[10%]">
            <motion.div variants={floatVariants} animate="animate" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-glass shadow-glow flex items-center justify-center relative">
                <Zap className="w-8 h-8 text-warning" />
                <svg className="absolute -left-8 top-1/2 w-8 h-8 -translate-y-1/2 opacity-50" viewBox="0 0 40 40">
                  <path d="M40,20 Q20,20 0,20" stroke="var(--color-warning)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Left */}
          <motion.div variants={itemVariants} className="absolute bottom-[10%] left-[10%]">
            <motion.div variants={floatVariants} animate="animate" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-glass shadow-glow flex items-center justify-center relative">
                <Droplets className="w-8 h-8 text-info" />
                <svg className="absolute -right-8 bottom-1/2 w-8 h-8 translate-y-1/2 opacity-50" viewBox="0 0 40 40">
                  <path d="M0,20 Q20,20 40,20" stroke="var(--color-info)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Right */}
          <motion.div variants={itemVariants} className="absolute bottom-[10%] right-[10%]">
            <motion.div variants={floatVariants} animate="animate" style={{ animationDelay: '1.5s' }}>
              <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-glass shadow-glow flex items-center justify-center relative">
                <Snowflake className="w-8 h-8 text-accent-emerald" />
                <svg className="absolute -left-8 bottom-1/2 w-8 h-8 translate-y-1/2 opacity-50" viewBox="0 0 40 40">
                  <path d="M40,20 Q20,20 0,20" stroke="var(--color-accent-emerald)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroAnimation;

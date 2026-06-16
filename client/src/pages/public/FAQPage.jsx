import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  { q: 'How do I book a service on Fixify?', a: 'Simply browse our services, select the one you need, choose an available technician, pick a date and time, and confirm your booking. You can pay via cash, JazzCash, or EasyPaisa.' },
  { q: 'Are the technicians verified?', a: 'Yes! Every professional on our platform goes through a thorough background check including CNIC verification, skill assessment, and reference checks before being approved.' },
  { q: 'What if I am not satisfied with the service?', a: 'We have a dispute resolution process. If you\'re unsatisfied, you can raise a dispute within 24 hours of service completion and our team will investigate and resolve it.' },
  { q: 'How is the pricing determined?', a: 'Each service has a base price set by Fixify. Technicians may offer custom pricing based on complexity. The final price is always shown before you confirm your booking — no hidden charges.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a booking before the technician is on their way. Cancellations after the technician has departed may be subject to a small fee. Check our cancellation policy for details.' },
  { q: 'How do I become a technician on Fixify?', a: 'Register on our platform as a professional, submit your CNIC and skill details, and our team will review your application. Once approved, you can start receiving job requests in your area.' },
  { q: 'What cities does Fixify operate in?', a: 'We currently operate in Islamabad, Lahore, Karachi, Rawalpindi, Peshawar, Faisalabad, and Multan. We are expanding to more cities soon!' },
  { q: 'What payment methods are accepted?', a: 'We accept Cash on Delivery, JazzCash, EasyPaisa, and bank transfers. Credit/debit card support is coming soon.' },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full">
      <div className="bg-bg-secondary border-b border-border-glass page-header relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-cyan/5 pointer-events-none"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-text-muted max-w-2xl mx-auto">Everything you need to know about Fixify.</p>
        </div>
      </div>

      <div className="container py-16 max-w-3xl">
        <div className="space-y-3">
          {faqData.map((faq, idx) => (
            <div key={idx} className="glass-panel overflow-hidden">
              <button 
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-bg-tertiary/30"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-accent-cyan shrink-0" />
                  <span className="font-semibold text-text-primary">{faq.q}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-4 text-text-secondary text-sm leading-relaxed border-t border-border-glass">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

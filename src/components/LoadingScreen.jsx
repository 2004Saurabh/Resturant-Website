import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(() => {
    // Show only once per browser session
    return !sessionStorage.getItem('nocturne_intro_seen');
  });

  useEffect(() => {
    if (!visible) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('nocturne_intro_seen', 'true');
      if (onComplete) onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] bg-[#0A0A0C] flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={() => {
            setVisible(false);
            sessionStorage.setItem('nocturne_intro_seen', 'true');
            if (onComplete) onComplete();
          }}
        >
          {/* Subtle background ambient pulse */}
          <div className="absolute w-96 h-96 rounded-full bg-[#881A2D]/10 blur-[120px] pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

          {/* Luxury Monogram */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative flex items-center justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
              <span className="font-serif text-3xl font-bold tracking-widest text-gold-gradient">N</span>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full border border-dashed border-[#D4AF37]/20"
            />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-cinzel text-3xl sm:text-5xl tracking-[0.3em] font-semibold text-[#F7F4EE] uppercase text-center"
          >
            NOCTURNE
          </motion.h1>

          {/* Subheading / Tagline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-3 text-xs sm:text-sm text-[#D4AF37] font-medium uppercase tracking-[0.35em]"
          >
            Taste Beyond Imagination
          </motion.p>

          {/* Loading bar */}
          <div className="w-48 h-[1px] bg-white/10 mt-10 overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ delay: 0.8, duration: 1.5, repeat: Infinity }}
            className="mt-6 text-[10px] tracking-[0.25em] text-[#8E8E99] uppercase"
          >
            Click anywhere to enter
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

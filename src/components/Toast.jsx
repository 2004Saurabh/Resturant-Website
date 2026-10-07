import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { title, message, type = 'success', image } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev.slice(-3), { id, title, message, type, image }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    window.addEventListener('nocturne_toast', handleToast);
    return () => window.removeEventListener('nocturne_toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#141418]/95 border border-[#D4AF37]/30 shadow-2xl shadow-black/80 backdrop-blur-xl rounded-xl p-4 flex items-center gap-3.5"
          >
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/20 flex-shrink-0"
              />
            ) : toast.type === 'success' ? (
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center flex-shrink-0 border border-[#10B981]/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="w-10 h-10 rounded-lg bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center flex-shrink-0 border border-[#EF4444]/30">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center flex-shrink-0 border border-[#D4AF37]/30">
                <Info className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#F7F4EE] tracking-wide truncate">
                {toast.title}
              </h4>
              <p className="text-xs text-[#8E8E99] mt-0.5 line-clamp-2">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8E8E99] hover:text-[#F7F4EE] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

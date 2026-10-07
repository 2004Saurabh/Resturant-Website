import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

export default function FloatingCartBar() {
  const { totalItemCount, grandTotal } = useCart();
  const location = useLocation();

  // Hide on checkout, cart, and payment pages where full cart/order details are already shown
  const hiddenRoutes = ['/cart', '/checkout', '/payment', '/order-success', '/invoice'];
  const isHidden = hiddenRoutes.includes(location.pathname) || totalItemCount === 0;

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="fixed bottom-5 inset-x-0 z-40 px-4 pointer-events-none"
        >
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className="bg-[#141418]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/90 flex items-center justify-between gap-4 ring-1 ring-[#D4AF37]/20">
              
              {/* Left Item Count & Grand Total */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA8010] flex items-center justify-center text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#881A2D] text-white text-[10px] font-black border border-white/20 flex items-center justify-center">
                    {totalItemCount}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0AA]">
                      {totalItemCount} {totalItemCount === 1 ? 'Item Added' : 'Items Added'}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-gold-gradient">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E8E99] truncate hidden sm:block">
                    Ready to savor? View dining cart or proceed to checkout
                  </p>
                </div>
              </div>

              {/* Right CTA Button */}
              <Link
                to="/cart"
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C766] to-[#D4AF37] hover:brightness-110 text-[#0A0A0C] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/30 flex-shrink-0 active:scale-95 transition-all"
              >
                <span>VIEW CART & PAY</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

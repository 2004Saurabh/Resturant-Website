import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Receipt, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CreditCard, 
  Home, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/price';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastOrder } = useOrder();

  const order = location.state?.order || lastOrder;

  useEffect(() => {
    // Fire luxury gold and ruby confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#881A2D', '#FFFFFF', '#E8C766']
      });
    } catch {
      // fallback safe
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen pt-36 pb-20 bg-[#0A0A0C] text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">No Recent Order Found</h2>
        <Link to="/" className="text-xs text-[#D4AF37] hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="p-8 sm:p-12 rounded-3xl bg-[#121215] border border-[#D4AF37]/30 shadow-2xl text-center space-y-8 relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] mx-auto shadow-2xl shadow-[#10B981]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Michelin Kitchen Confirmed</span>
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-[#F7F4EE]">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-[#8E8E99]">
              Thank you, <span className="text-[#F7F4EE] font-semibold">{order.customer?.name}</span>. Your courses are now entered into our live culinary pipeline.
            </p>
          </div>

          {/* Key Order Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs text-left">
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Order Identifier</span>
              <span className="font-bold text-[#D4AF37] font-mono">{order.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Status</span>
              <span className="font-bold text-[#10B981] uppercase">{order.status || 'NEW'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Estimated Prep</span>
              <span className="font-bold text-[#F7F4EE]">{order.estimatedTime || '25-35 mins'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Total Amount</span>
              <span className="font-bold text-gold-gradient font-serif">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Live Delivery GPS Map (Only for delivery orders) */}
          {order.orderType === 'delivery' && (
            <div className="text-left space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#10B981]" />
                  <span>Live Fleet GPS Tracking</span>
                </span>
                <span className="text-[11px] text-[#8E8E99]">
                  Dispatched from NOCTURNE Kitchen (Saurabh Kumar)
                </span>
              </div>
              <LiveDeliveryMap order={order} />
            </div>
          )}

          {/* Course Items List */}
          <div className="text-left space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-wider text-[#8E8E99] font-semibold">
              Course Details ({order.items?.length || 0})
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <img src={item.dish?.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <span className="font-semibold text-[#F7F4EE]">{item.quantity}x {item.dish?.name}</span>
                      <p className="text-[10px] text-[#8E8E99]">{item.dish?.category}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-[#D4AF37]">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/5">
            <Link
              to="/dashboard/user/orders"
              className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <Clock className="w-4 h-4" />
              <span>Track in User Dashboard</span>
            </Link>

            <Link
              to={`/invoice?id=${order.id}`}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7F4EE] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-white/10"
            >
              <Receipt className="w-4 h-4" />
              <span>View & Print Invoice</span>
            </Link>

            <Link
              to="/"
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8E8E99] hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>

        </motion.div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Receipt, CheckCircle, Package, Truck, ArrowRight, AlertCircle, MapPin } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/price';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function UserOrders() {
  const { orders } = useOrder();
  const { currentUser } = useAuth();
  const [expandedMapId, setExpandedMapId] = useState(null);

  // Filter orders for current user
  const userOrders = orders.filter(
    o => !o.customer?.email || o.customer?.email.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const statusColors = {
    NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ACCEPTED: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    PREPARING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    READY: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    OUT_FOR_DELIVERY: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    COMPLETED: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30',
    CANCELLED: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'NEW': return 15;
      case 'ACCEPTED': return 35;
      case 'PREPARING': return 60;
      case 'READY': return 80;
      case 'OUT_FOR_DELIVERY': return 90;
      case 'COMPLETED': return 100;
      case 'CANCELLED': return 0;
      default: return 50;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">Order History & Live Tracking</h2>
          <p className="text-xs text-[#8E8E99]">Real-time synchronization with Nocturne Executive Kitchen.</p>
        </div>
        <Link
          to="/menu"
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Order More Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 space-y-3">
          <Package className="w-10 h-10 text-[#8E8E99] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">No Orders Yet</h3>
          <p className="text-xs text-[#8E8E99]">Explore our menu and place your first culinary tasting order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => {
            const progress = getStepProgress(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-[#121215] border border-white/5 hover:border-white/10 transition-all space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-lg border border-[#D4AF37]/20">
                      #{order.id}
                    </span>
                    <span className="text-xs text-[#8E8E99]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.orderType === 'delivery' && (
                      <button
                        onClick={() => setExpandedMapId(expandedMapId === order.id ? null : order.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          expandedMapId === order.id
                            ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/30'
                            : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{expandedMapId === order.id ? 'Hide Live Map' : 'Track on Map'}</span>
                      </button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-white/10 text-white'}`}>
                      {order.status}
                    </span>
                    <Link
                      to={`/invoice?id=${order.id}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E99] hover:text-[#F7F4EE] transition-colors"
                      title="View Invoice"
                    >
                      <Receipt className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Expandable Live Delivery Map */}
                <AnimatePresence>
                  {expandedMapId === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <div className="p-1 rounded-3xl bg-black/50 border border-white/10">
                        <LiveDeliveryMap order={order} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Live Progress Bar */}
                {order.status !== 'CANCELLED' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-[#8E8E99]">
                      <span>Preparation Stage: <strong className="text-[#F7F4EE] uppercase">{order.status}</strong></span>
                      <span>ETA: {order.estimatedTime || '20-30 mins'}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#881A2D] via-[#D4AF37] to-[#10B981]"
                      />
                    </div>
                  </div>
                )}

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                      <img src={item.dish?.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#F7F4EE] truncate">{item.dish?.name}</p>
                        <p className="text-[10px] text-[#8E8E99]">{item.quantity}x • {formatPrice(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer specs */}
                <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-white/5 text-[#8E8E99] gap-3">
                  <div>
                    <span>Fulfillment: </span>
                    <strong className="text-[#F7F4EE] uppercase">
                      {order.orderType === 'dine-in' ? `Dine-In • Table ${order.table || 'T01'}` : order.orderType}
                    </strong>
                    <span className="mx-2">•</span>
                    <span>Payment: <strong className="text-[#F7F4EE]">{order.paymentMethod}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Total Amount:</span>
                    <span className="font-serif text-base font-bold text-gold-gradient">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

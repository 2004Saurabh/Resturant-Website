import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Search, Filter, MapPin, Bike } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/price';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function OwnerOrders() {
  const { orders, updateOrderStatus } = useOrder();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedMapId, setExpandedMapId] = useState(null);

  const validStatuses = ['NEW', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'ALL' && order.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCust = order.customer?.name.toLowerCase().includes(q);
      if (!matchId && !matchCust) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Live Kitchen Order Pipeline
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Update preparation statuses in real-time. Changes immediately reflect on the user order tracking dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Order # or Guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/5">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
            filterStatus === 'ALL' ? 'bg-[#D4AF37] text-[#0A0A0C]' : 'bg-white/5 text-[#8E8E99] hover:text-white'
          }`}
        >
          All ({orders.length})
        </button>
        {validStatuses.map(st => {
          const count = orders.filter(o => o.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                filterStatus === st ? 'bg-[#D4AF37] text-[#0A0A0C]' : 'bg-white/5 text-[#8E8E99] hover:text-white'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 text-xs text-[#8E8E99]">
          No orders found matching status "{filterStatus}".
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-[#121215] border border-white/5 hover:border-white/10 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                      #{order.id}
                    </span>
                    <span className="font-bold text-sm text-[#F7F4EE]">{order.customer?.name}</span>
                    <span className="text-xs text-[#8E8E99]">({order.customer?.phone})</span>
                  </div>
                  <p className="text-[11px] text-[#8E8E99] mt-1">
                    {new Date(order.createdAt).toLocaleTimeString()} • {order.orderType === 'dine-in' ? `Dine-In • Table ${order.table || 'T01'}` : order.orderType}
                  </p>
                </div>

                {/* Status Switcher & Map Button */}
                <div className="flex items-center gap-2">
                  {order.orderType === 'delivery' && (
                    <button
                      onClick={() => setExpandedMapId(expandedMapId === order.id ? null : order.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        expandedMapId === order.id
                          ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{expandedMapId === order.id ? 'Close Map' : 'View Delivery Map'}</span>
                    </button>
                  )}
                  <span className="text-xs text-[#8E8E99]">Pipeline:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="bg-black/60 border border-[#D4AF37]/50 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] focus:outline-none cursor-pointer"
                  >
                    {validStatuses.map(s => (
                      <option key={s} value={s} className="bg-[#141418] text-[#F7F4EE]">
                        {s}
                      </option>
                    ))}
                  </select>
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
                    <div className="p-1 rounded-3xl bg-black/60 border border-cyan-500/30">
                      <LiveDeliveryMap order={order} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Items in Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                    <img src={item.dish?.image} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F7F4EE] truncate">{item.dish?.name}</p>
                      <p className="text-[11px] text-[#8E8E99]">{item.quantity}x @ {formatPrice(item.unitPrice)}</p>
                      {item.customizations && Object.values(item.customizations).some(Boolean) && (
                        <p className="text-[10px] text-[#D4AF37] truncate">Customized</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Quick Status Action Buttons */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-white/5 gap-3">
                <div className="text-[#8E8E99]">
                  Total: <strong className="font-serif text-sm font-bold text-gold-gradient">{formatPrice(order.total)}</strong>
                  <span className="mx-2">•</span>
                  <span>Payment: {order.paymentMethod}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {order.status === 'NEW' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-semibold"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold"
                    >
                      Mark Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-semibold"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      className="px-3 py-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/30 text-xs font-semibold"
                    >
                      Complete & Deliver
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

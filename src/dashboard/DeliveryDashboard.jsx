import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  UtensilsCrossed, 
  Package, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/price';
import { RESTAURANT_ORIGIN, DELIVERY_PARTNERS } from '../data/delivery';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function DeliveryDashboard() {
  const { orders, updateOrderStatus, advanceDeliveryProgress } = useOrder();
  const { currentUser } = useAuth();
  
  const [partnerOnline, setPartnerOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'

  // Filter delivery orders
  const deliveryOrders = orders.filter(o => o.orderType === 'delivery');
  const activeOrders = deliveryOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const completedOrders = deliveryOrders.filter(o => o.status === 'COMPLETED');

  const [selectedOrderId, setSelectedOrderId] = useState(activeOrders[0]?.id || deliveryOrders[0]?.id);
  const selectedOrder = deliveryOrders.find(o => o.id === selectedOrderId) || deliveryOrders[0];

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* FLEET PARTNER HERO HEADER */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0C1A24] via-[#10141C] to-[#121215] border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bike className="w-8 h-8" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                partnerOnline ? 'bg-[#10B981]' : 'bg-[#EF4444]'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase font-bold text-cyan-400">
                  Nocturne Fleet Telematics Portal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  4.9 ★ Rating
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                {currentUser?.name || 'Vikram Singh'} (Delivery Fleet Partner)
              </h1>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Vehicle: {currentUser?.vehicle || 'Nocturne Express EV (DL-09-EV-4412)'} • Hub #01 Central Delhi
              </p>
            </div>
          </div>

          {/* Quick Metrics & Duty Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPartnerOnline(!partnerOnline)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                partnerOnline
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                  : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${partnerOnline ? 'bg-[#10B981] animate-ping' : 'bg-neutral-500'}`} />
              <span>{partnerOnline ? 'Online (Ready for Orders)' : 'Offline (On Break)'}</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Active Assigned Runs</span>
            <p className="font-serif text-2xl font-bold text-cyan-400">
              {activeOrders.length} Deliveries
            </p>
            <span className="text-[10px] text-[#10B981] block">Real-time GPS routing active</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Today's Deliveries</span>
            <p className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {completedOrders.length + 8} Drops
            </p>
            <span className="text-[10px] text-[#D4AF37] block">Average drop time: 21 mins</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Fleet Payout Today</span>
            <p className="font-serif text-2xl font-bold text-gold-gradient">
              ₹1,850.00
            </p>
            <span className="text-[10px] text-[#10B981] block">Includes Michelin prompt tips</span>
          </div>

          <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Kitchen Dispatcher</span>
            <p className="font-serif text-lg font-bold text-[#F7F4EE] truncate">
              Saurabh Kumar
            </p>
            <span className="text-[10px] text-[#8E8E99] block">NOCTURNE Central Flagship</span>
          </div>
        </div>

        {/* MAIN DELIVERY WORKSPACE: Split Queue & Live Map Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 cols): Orders Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'active'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-[#8E8E99] hover:text-white'
                  }`}
                >
                  Active ({activeOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-[#8E8E99] hover:text-white'
                  }`}
                >
                  Completed ({completedOrders.length})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {(activeTab === 'active' ? activeOrders : completedOrders).map(order => {
                const isSelected = selectedOrderId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-[#161B24] border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                        : 'bg-[#121215] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg">
                          #{order.id}
                        </span>
                        <span className="font-bold text-xs text-[#F7F4EE]">
                          {order.customer?.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        {order.status}
                      </span>
                    </div>

                    {/* Route brief */}
                    <div className="text-xs space-y-1.5 bg-black/40 p-3 rounded-2xl border border-white/5">
                      <div className="flex items-start gap-2 text-[#A0A0AA]">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#EF4444] mt-0.5 flex-shrink-0" />
                        <span className="truncate"><strong>From:</strong> NOCTURNE Kitchen (Saurabh Kumar)</span>
                      </div>
                      <div className="flex items-start gap-2 text-[#A0A0AA]">
                        <MapPin className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                        <span className="truncate"><strong>To:</strong> {order.deliveryLocation?.address || order.customer?.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#8E8E99]">
                        {order.items?.length || 0} Courses • <strong>{formatPrice(order.total)}</strong>
                      </span>
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <span>Inspect Route</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {(activeTab === 'active' ? activeOrders : completedOrders).length === 0 && (
                <div className="p-8 text-center rounded-3xl bg-[#121215] border border-white/5 text-xs text-[#8E8E99]">
                  No orders in this category.
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 cols): Selected Order Deep Dive & Live Route Map */}
          <div className="lg:col-span-7 space-y-6">
            {selectedOrder ? (
              <div className="space-y-6">
                
                {/* Order Summary & Status Control Card */}
                <div className="p-6 rounded-3xl bg-[#121215] border border-white/10 shadow-2xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#D4AF37]">
                          #{selectedOrder.id}
                        </span>
                        <span className="font-serif text-lg font-bold text-[#F7F4EE]">
                          {selectedOrder.customer?.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8E99] mt-0.5">
                        Payment: <strong className="text-white">{selectedOrder.paymentMethod}</strong> • Total: <strong className="text-gold-gradient font-serif">{formatPrice(selectedOrder.total)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedOrder.customer?.phone || '+919876543210'}`}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F7F4EE] flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Call Customer</span>
                      </a>
                      <a
                        href={`tel:${RESTAURANT_ORIGIN.phone}`}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F7F4EE] flex items-center gap-1.5 transition-colors"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5 text-[#EF4444]" />
                        <span>Call Kitchen</span>
                      </a>
                    </div>
                  </div>

                  {/* Pick & Drop Location Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" />
                        <span>1. Pick Up Location (Kitchen)</span>
                      </span>
                      <p className="font-bold text-sm text-[#F7F4EE]">NOCTURNE Flagship Kitchen</p>
                      <p className="text-[#8E8E99]">{RESTAURANT_ORIGIN.address}</p>
                      <p className="text-[11px] text-[#D4AF37] pt-1">Kitchen Contact: Saurabh Kumar ({RESTAURANT_ORIGIN.phone})</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>2. Drop Off Location (Customer)</span>
                      </span>
                      <p className="font-bold text-sm text-[#F7F4EE]">{selectedOrder.customer?.name}</p>
                      <p className="text-[#8E8E99]">{selectedOrder.deliveryLocation?.address || selectedOrder.customer?.address}</p>
                      <p className="text-[11px] text-[#10B981] pt-1">Customer Phone: {selectedOrder.customer?.phone}</p>
                    </div>
                  </div>

                  {/* Delivery Partner Step Action Buttons */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <span className="text-xs text-[#8E8E99] block">
                      Update Order Delivery Pipeline:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'ACCEPTED')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedOrder.status === 'ACCEPTED'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-white/5 text-[#8E8E99] hover:text-white border border-white/5'
                        }`}
                      >
                        1. Accept Order
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'READY')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedOrder.status === 'READY'
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                            : 'bg-white/5 text-[#8E8E99] hover:text-white border border-white/5'
                        }`}
                      >
                        2. Picked Up from Kitchen
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'OUT_FOR_DELIVERY')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedOrder.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                            : 'bg-white/5 text-[#8E8E99] hover:text-white border border-white/5'
                        }`}
                      >
                        3. Out for Delivery (Live Route)
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedOrder.status === 'COMPLETED'
                            ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/30'
                            : 'bg-white/5 text-[#8E8E99] hover:text-[#10B981] border border-white/5'
                        }`}
                      >
                        4. Mark Delivered ✓
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Live Navigation Map */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#F7F4EE] flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-cyan-400" />
                      <span>Live GPS Navigation Route</span>
                    </h3>
                    <span className="text-xs text-[#8E8E99]">
                      Origin: NOCTURNE Flagship ➔ Drop: {selectedOrder.customer?.name}
                    </span>
                  </div>

                  <LiveDeliveryMap order={selectedOrder} />
                </div>

              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 text-[#8E8E99]">
                Select an order from the list to view live navigation route.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

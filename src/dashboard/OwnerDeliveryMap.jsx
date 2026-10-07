import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bike, 
  MapPin, 
  UtensilsCrossed, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Compass, 
  User, 
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { RESTAURANT_ORIGIN, DELIVERY_PARTNERS } from '../data/delivery';
import { formatPrice } from '../utils/price';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function OwnerDeliveryMap() {
  const { orders, updateOrderStatus, assignDeliveryPartner } = useOrder();
  const [search, setSearch] = useState('');

  const deliveryOrders = orders.filter(o => o.orderType === 'delivery');
  const activeDeliveries = deliveryOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const [selectedOrderId, setSelectedOrderId] = useState(activeDeliveries[0]?.id || deliveryOrders[0]?.id);

  const selectedOrder = deliveryOrders.find(o => o.id === selectedOrderId) || deliveryOrders[0];

  const filtered = deliveryOrders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.id.toLowerCase().includes(q) || o.customer?.name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Fleet Dispatch & Live Map Tracking
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Kitchen Dispatcher: <strong>Saurabh Kumar</strong> • Real-time GPS overview of where orders originate and where they are delivered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search order or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Kitchen Origin</span>
          <p className="font-bold text-sm text-[#F7F4EE] truncate">{RESTAURANT_ORIGIN.name}</p>
          <span className="text-[11px] text-[#D4AF37]">Owner: Saurabh Kumar (Connaught Place)</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Out on Road</span>
          <p className="font-serif text-2xl font-bold text-cyan-400">{activeDeliveries.length} Active</p>
          <span className="text-[11px] text-[#10B981]">Real-time telemetry stream</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Fleet Squad</span>
          <p className="font-serif text-2xl font-bold text-[#F7F4EE]">{DELIVERY_PARTNERS.length} Partners</p>
          <span className="text-[11px] text-[#8E8E99]">EV Couriers & Thermal pods</span>
        </div>
      </div>

      {/* Split View: Order List & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Orders List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[#8E8E99]">
            Online Delivery Orders ({filtered.length})
          </h3>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filtered.map(order => {
              const isSelected = selectedOrderId === order.id;
              const partner = order.deliveryPartner || DELIVERY_PARTNERS[0];
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-[#18181E] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
                      : 'bg-[#121215] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#D4AF37]">#{order.id}</span>
                      <span className="font-bold text-xs text-[#F7F4EE]">{order.customer?.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8E8E99] space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <p className="truncate">
                      <strong>From:</strong> NOCTURNE Kitchen (Saurabh Kumar)
                    </p>
                    <p className="truncate">
                      <strong>To:</strong> {order.deliveryLocation?.address || order.customer?.address}
                    </p>
                    <p className="text-cyan-400 font-semibold truncate pt-0.5">
                      <strong>Rider:</strong> {partner.name} ({partner.vehicle})
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#8E8E99] font-serif font-bold text-gold-gradient">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                      <span>View Route Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Map View */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#8E8E99] font-bold block">Selected Order</span>
                  <span className="font-serif font-bold text-sm text-[#F7F4EE]">
                    #{selectedOrder.id} • {selectedOrder.customer?.name} ({formatPrice(selectedOrder.total)})
                  </span>
                </div>

                {/* Partner Reassignment Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[#8E8E99]">Assign Fleet Rider:</span>
                  <select
                    value={selectedOrder.deliveryPartner?.id || 'DP-01'}
                    onChange={(e) => {
                      const found = DELIVERY_PARTNERS.find(p => p.id === e.target.value);
                      if (found) assignDeliveryPartner(selectedOrder.id, found);
                    }}
                    className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-[#D4AF37] outline-none"
                  >
                    {DELIVERY_PARTNERS.map(dp => (
                      <option key={dp.id} value={dp.id} className="bg-[#141418] text-[#F7F4EE]">
                        {dp.name} ({dp.vehicle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Map */}
              <LiveDeliveryMap order={selectedOrder} />
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 text-[#8E8E99]">
              Select an order to view dispatch route.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

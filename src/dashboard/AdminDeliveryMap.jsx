import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bike, 
  MapPin, 
  ShieldCheck, 
  Search, 
  Phone, 
  UtensilsCrossed, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Compass,
  ChevronRight
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { RESTAURANT_ORIGIN, DELIVERY_PARTNERS, PRESET_DELIVERY_HUBS } from '../data/delivery';
import { formatPrice } from '../utils/price';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

export default function AdminDeliveryMap() {
  const { orders, assignDeliveryPartner, updateOrderStatus } = useOrder();
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
            Platform City-Wide Logistics & Fleet Grid
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Super Admin global oversight of all customer dispatch orders, fleet couriers, and kitchen origins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search order ref, guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Kitchen Nodes</span>
          <p className="font-bold text-sm text-[#F7F4EE]">NOCTURNE Central Flagship</p>
          <span className="text-[11px] text-[#D4AF37]">Managing Partner: Saurabh Kumar</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">On-Road Deliveries</span>
          <p className="font-serif text-2xl font-bold text-blue-400">{activeDeliveries.length} Live Runs</p>
          <span className="text-[11px] text-[#10B981]">GPS tracking streams active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Registered Couriers</span>
          <p className="font-serif text-2xl font-bold text-[#F7F4EE]">{DELIVERY_PARTNERS.length} Active</p>
          <span className="text-[11px] text-[#8E8E99]">EV & Thermal POD fleet</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase text-[#8E8E99] font-bold">Total Delivery GMV</span>
          <p className="font-serif text-2xl font-bold text-gold-gradient">
            {formatPrice(deliveryOrders.reduce((acc, o) => acc + (o.total || 0), 0))}
          </p>
          <span className="text-[11px] text-[#10B981]">{deliveryOrders.length} orders total</span>
        </div>
      </div>

      {/* Split Map View & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Order Queue */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs uppercase font-bold tracking-wider text-[#8E8E99]">
            Active Logistics Ledger ({filtered.length})
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(order => {
              const isSelected = selectedOrderId === order.id;
              const partner = order.deliveryPartner || DELIVERY_PARTNERS[0];
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-[#141A24] border-blue-500 shadow-xl shadow-blue-500/10'
                      : 'bg-[#121215] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#D4AF37]">#{order.id}</span>
                      <span className="font-bold text-xs text-[#F7F4EE]">{order.customer?.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8E8E99] space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <p className="truncate">
                      <strong>Origin:</strong> NOCTURNE Kitchen (Saurabh Kumar)
                    </p>
                    <p className="truncate">
                      <strong>Destination:</strong> {order.deliveryLocation?.address || order.customer?.address}
                    </p>
                    <p className="text-cyan-400 font-semibold truncate pt-0.5">
                      <strong>Assigned Rider:</strong> {partner.name} ({partner.phone})
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#8E8E99] font-serif font-bold text-gold-gradient">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                      <span>Inspect Telemetry</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Selected Order Map View */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#8E8E99] font-bold block">Audited Order</span>
                  <span className="font-serif font-bold text-sm text-[#F7F4EE]">
                    #{selectedOrder.id} • {selectedOrder.customer?.name} ({formatPrice(selectedOrder.total)})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#8E8E99]">Courier:</span>
                  <select
                    value={selectedOrder.deliveryPartner?.id || 'DP-01'}
                    onChange={(e) => {
                      const found = DELIVERY_PARTNERS.find(p => p.id === e.target.value);
                      if (found) assignDeliveryPartner(selectedOrder.id, found);
                    }}
                    className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-blue-400 outline-none"
                  >
                    {DELIVERY_PARTNERS.map(dp => (
                      <option key={dp.id} value={dp.id} className="bg-[#141418] text-[#F7F4EE]">
                        {dp.name} ({dp.vehicle})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <LiveDeliveryMap order={selectedOrder} />
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 text-[#8E8E99]">
              Select an order to inspect GPS delivery path.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

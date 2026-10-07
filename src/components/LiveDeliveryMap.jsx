import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Sparkles,
  UtensilsCrossed,
  Bike,
  Compass
} from 'lucide-react';
import { RESTAURANT_ORIGIN, DELIVERY_PARTNERS } from '../data/delivery';

export default function LiveDeliveryMap({ order, interactive = true, showControls = true }) {
  const [zoom, setZoom] = useState(1);
  const [simulatedProgress, setSimulatedProgress] = useState(order?.deliveryProgress || 60);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fallback defaults if order props are sparse
  const pickup = order?.pickupLocation || RESTAURANT_ORIGIN;
  const drop = order?.deliveryLocation || {
    address: order?.customer?.address || '742 Evergreen Terrace, Penthouse B, Central Delhi',
    area: 'Mayfair Presidential Suites',
    distanceKm: 3.8,
    coords: { x: 68, y: 42, lat: 28.6180, lng: 77.2400 }
  };
  const partner = order?.deliveryPartner || DELIVERY_PARTNERS[0];

  // Origin (Restaurant) and Destination (Customer) coordinates
  const originX = pickup.coords?.x || 38;
  const originY = pickup.coords?.y || 55;
  const destX = drop.coords?.x || 68;
  const destY = drop.coords?.y || 42;

  // Compute live rider coordinates along the route
  const currentP = simulatedProgress / 100;
  // Waypoint bend in road for realistic city curve
  const midX = (originX + destX) / 2 + 6;
  const midY = (originY + destY) / 2 - 8;

  // Quadratic bezier calculation
  const t = currentP;
  const riderX = (1 - t) * (1 - t) * originX + 2 * (1 - t) * t * midX + t * t * destX;
  const riderY = (1 - t) * (1 - t) * originY + 2 * (1 - t) * t * midY + t * t * destY;

  // Path SVG string
  const routePath = `M ${originX} ${originY} Q ${midX} ${midY} ${destX} ${destY}`;

  // Live simulation loop if enabled
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return Math.min(100, prev + 2);
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Derived values
  const totalKm = drop.distanceKm || 4.2;
  const remainingKm = Math.max(0, (totalKm * (1 - currentP))).toFixed(1);
  const etaMins = Math.max(1, Math.round(remainingKm * 3.5));

  const isCompleted = simulatedProgress >= 100 || order?.status === 'COMPLETED';

  return (
    <div className="relative w-full rounded-3xl bg-[#0B0B0E] border border-white/10 overflow-hidden shadow-2xl select-none">
      
      {/* MAP TOP HUD / STATUS BAR */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#141418]/90 border border-white/10 backdrop-blur-xl shadow-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isCompleted ? 'bg-[#10B981]' : 'bg-[#D4AF37]'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isCompleted ? 'bg-[#10B981]' : 'bg-[#D4AF37]'
            }`} />
          </span>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0AA]">
              {isCompleted ? 'Delivery Complete' : 'Live Fleet Telemetry'}
            </span>
            <span className="text-xs font-bold text-[#F7F4EE]">
              {isCompleted ? 'Safely Delivered' : `${remainingKm} km away • ETA ~${etaMins} mins`}
            </span>
          </div>
        </div>

        {/* Map Controls */}
        {showControls && (
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#141418]/90 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              className="p-2 rounded-xl text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))}
              className="p-2 rounded-xl text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-2 rounded-xl text-[#8E8E99] hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* MAP CANVAS / SVG STAGE */}
      <div className="relative w-full h-[360px] sm:h-[420px] overflow-hidden bg-[#070709] cursor-grab active:cursor-grabbing">
        
        <motion.div
          animate={{ scale: zoom }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 origin-center"
        >
          {/* Dark Luxury City Street Grid Texture */}
          <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="cityGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#252530" strokeWidth="0.3" />
                <circle cx="10" cy="10" r="0.4" fill="#D4AF37" opacity="0.3" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#cityGrid)" />

            {/* Stylized Metropolitan Arterial Avenues */}
            <path d="M 0 35 Q 40 45 100 20" stroke="#1A1A24" strokeWidth="2.5" fill="none" />
            <path d="M 20 0 Q 35 60 40 100" stroke="#1A1A24" strokeWidth="2" fill="none" />
            <path d="M 55 0 Q 60 40 100 80" stroke="#1A1A24" strokeWidth="2.2" fill="none" />
            <path d="M 0 75 Q 50 65 100 90" stroke="#1A1A24" strokeWidth="1.8" fill="none" />
            
            {/* Soft Ambient River / Green Ribbon */}
            <path d="M 15 0 C 25 35 10 65 25 100" stroke="#102028" strokeWidth="5" fill="none" opacity="0.4" />

            {/* Active Delivery Route Line (Glow + Dashed Animation) */}
            <path
              d={routePath}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.8"
              strokeOpacity="0.25"
            />
            <path
              d={routePath}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="1.2"
              strokeDasharray="2, 1"
              className="animate-pulse"
            />
          </svg>

          {/* 1. RESTAURANT ORIGIN PIN (KITCHEN - SAURABH KUMAR) */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            style={{ left: `${originX}%`, top: `${originY}%` }}
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-[#881A2D]/30 blur-md animate-pulse" />
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#881A2D] to-[#200B10] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-xl shadow-black">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>

            {/* Origin Label Card */}
            <div className="mt-1.5 px-3 py-1 rounded-xl bg-[#121215]/95 border border-[#881A2D]/40 backdrop-blur-md shadow-2xl text-center whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#EF4444] block">
                Pickup Origin
              </span>
              <p className="text-[11px] font-bold text-[#F7F4EE]">
                NOCTURNE Flagship (Saurabh Kumar)
              </p>
            </div>
          </div>

          {/* 2. CUSTOMER DESTINATION PIN */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
            style={{ left: `${destX}%`, top: `${destY}%` }}
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-[#10B981]/30 blur-md animate-pulse" />
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#064E3B] border-2 border-white flex items-center justify-center text-white shadow-xl shadow-black">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Destination Label Card */}
            <div className="mt-1.5 px-3 py-1 rounded-xl bg-[#121215]/95 border border-[#10B981]/40 backdrop-blur-md shadow-2xl text-center whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#10B981] block">
                Delivery Drop
              </span>
              <p className="text-[11px] font-bold text-[#F7F4EE]">
                {order?.customer?.name || 'Customer Address'}
              </p>
              <p className="text-[9px] text-[#8E8E99] max-w-[150px] truncate">
                {drop.address}
              </p>
            </div>
          </div>

          {/* 3. LIVE DELIVERY PARTNER (MOVING RIDER) */}
          {!isCompleted && (
            <motion.div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer pointer-events-none"
              style={{ left: `${riderX}%`, top: `${riderY}%` }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="relative">
                {/* Radar Ripple */}
                <div className="absolute -inset-3 rounded-full bg-cyan-500/25 animate-ping" />
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 border-2 border-white flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40">
                  <Bike className="w-5 h-5" />
                </div>
              </div>

              {/* Rider Tooltip */}
              <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-black/90 border border-cyan-500/50 text-[10px] font-bold text-cyan-300 shadow-xl whitespace-nowrap flex items-center gap-1">
                <span>{partner.name}</span>
                <span className="text-white/60">• 28 km/h</span>
              </div>
            </motion.div>
          )}

        </motion.div>

      </div>

      {/* MAP BOTTOM TELEMETRY CARD */}
      <div className="p-4 sm:p-5 bg-[#121215] border-t border-white/5 space-y-4">
        
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#8E8E99]">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <strong className="text-[#F7F4EE]">
                {isCompleted ? 'Delivered' : simulatedProgress > 50 ? 'Out for Delivery' : 'Picked up from Kitchen'}
              </strong>
            </span>
            <span>{simulatedProgress}% route complete</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-cyan-400 to-[#10B981]"
              style={{ width: `${simulatedProgress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Fleet & Contact Details Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-12 h-12 rounded-2xl object-cover border border-[#D4AF37]/40 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#F7F4EE] truncate">
                  {partner.name}
                </h4>
                <span className="px-2 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold">
                  {partner.rating} ★
                </span>
              </div>
              <p className="text-[11px] text-[#8E8E99] truncate">
                {partner.vehicle}
              </p>
              <p className="text-[10px] text-[#A0A0AA]">
                {partner.tripsCompleted}+ Fine Dining Runs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${partner.phone}`}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F7F4EE] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Call Partner</span>
            </a>

            {/* Test Simulation Trigger */}
            <button
              onClick={() => {
                if (simulatedProgress >= 100) setSimulatedProgress(20);
                setIsSimulating(!isSimulating);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isSimulating
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate GPS'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

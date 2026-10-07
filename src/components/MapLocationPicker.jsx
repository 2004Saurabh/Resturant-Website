import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  UtensilsCrossed, 
  Compass, 
  Sparkles,
  Building2
} from 'lucide-react';
import { RESTAURANT_ORIGIN, PRESET_DELIVERY_HUBS } from '../data/delivery';

export default function MapLocationPicker({ isOpen, onClose, onSelectLocation, currentAddress }) {
  const [selectedHub, setSelectedHub] = useState(PRESET_DELIVERY_HUBS[0]);
  const [customSearch, setCustomSearch] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectLocation(selectedHub);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#121215] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Pinpoint Delivery Location on Map
                </h3>
                <p className="text-xs text-[#8E8E99]">
                  Dispatched fresh from NOCTURNE Flagship (Saurabh Kumar)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Map Visual Stage */}
          <div className="relative h-64 sm:h-72 w-full bg-[#08080A] overflow-hidden border-b border-white/5">
            
            {/* Dark Grid Background */}
            <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="pickerGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2A2A38" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pickerGrid)" />
              <path d="M 0 40 Q 50 50 100 30" stroke="#1F1F2B" strokeWidth="3" fill="none" />
              <path d="M 30 0 Q 40 50 45 100" stroke="#1F1F2B" strokeWidth="2.5" fill="none" />
              <path d="M 65 0 Q 60 60 100 80" stroke="#1F1F2B" strokeWidth="2.5" fill="none" />
            </svg>

            {/* Restaurant Marker (Fixed Origin) */}
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${RESTAURANT_ORIGIN.coords.x}%`, top: `${RESTAURANT_ORIGIN.coords.y}%` }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#881A2D] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-xl">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 text-[9px] font-bold text-[#D4AF37] whitespace-nowrap border border-[#D4AF37]/30">
                NOCTURNE Kitchen
              </span>
            </div>

            {/* All Delivery Hub Pins */}
            {PRESET_DELIVERY_HUBS.map(hub => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform hover:scale-110"
                  style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-2xl transition-all ${
                    isSelected
                      ? 'bg-[#10B981] border-white text-white scale-110 shadow-[#10B981]/50'
                      : 'bg-black/80 border-white/40 text-[#8E8E99] group-hover:border-[#10B981] group-hover:text-white'
                  }`}>
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>
                  <span className={`mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap transition-colors ${
                    isSelected ? 'bg-[#10B981] text-black' : 'bg-black/90 text-[#D8D8E0] border border-white/10'
                  }`}>
                    {hub.area}
                  </span>
                </button>
              );
            })}

            {/* Straight connector preview */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1={`${RESTAURANT_ORIGIN.coords.x}%`}
                y1={`${RESTAURANT_ORIGIN.coords.y}%`}
                x2={`${selectedHub.coords.x}%`}
                y2={`${selectedHub.coords.y}%`}
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-70"
              />
            </svg>

            {/* Distance Callout */}
            <div className="absolute bottom-3 left-3 bg-[#121215]/90 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] text-[#F7F4EE] flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Distance: <strong>{selectedHub.distanceKm} km</strong> (~{selectedHub.estimatedMinutes} mins)</span>
            </div>

          </div>

          {/* Hub Selection Grid */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block mb-2">
                Select Your Delivery Sector & Area
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {PRESET_DELIVERY_HUBS.map(hub => {
                  const isSel = selectedHub.id === hub.id;
                  return (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedHub(hub)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSel
                          ? 'border-[#10B981] bg-[#10B981]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{hub.area}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                      </div>
                      <p className="text-[10px] opacity-70 truncate">{hub.address}</p>
                      <span className="text-[9px] text-[#D4AF37] block mt-1">
                        {hub.distanceKm} km • ~{hub.estimatedMinutes} mins
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer with Confirm Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-[#8E8E99]">
                Selected: <strong className="text-[#F7F4EE]">{selectedHub.address}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#8E8E99] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#10B981]/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Set Address & GPS</span>
                </button>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RESTAURANTS } from '../data/restaurants';
import { Award, MapPin, Phone, Mail, CheckCircle2, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState(RESTAURANTS);

  const toggleStatus = (id) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
          Brand Locations & Outlets Management
        </h2>
        <p className="text-xs text-[#8E8E99]">
          Oversee Michelin certification, capacity, executive chefs, and platform availability across global dining rooms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurants.map(res => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#121215] border border-white/5 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="h-44 relative overflow-hidden bg-neutral-900">
                <img src={res.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    res.status === 'ACTIVE' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                  }`}>
                    {res.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#D4AF37]">
                  <Award className="w-3.5 h-3.5 fill-current" />
                  <span>{res.michelinStars} Michelin Stars</span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">{res.name}</h3>
                <p className="text-xs text-[#D4AF37] font-medium">{res.tagline}</p>
                <div className="space-y-1.5 text-xs text-[#8E8E99] pt-2">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#881A2D] flex-shrink-0" />
                    <span>{res.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8E8E99] flex-shrink-0" />
                    <span>{res.phone}</span>
                  </p>
                  <p className="text-[11px] text-[#A0A0AA] pt-1">
                    Executive Chef: <strong>{res.chef}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-white/5 mt-4">
              <button
                onClick={() => toggleStatus(res.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                  res.status === 'ACTIVE'
                    ? 'bg-white/10 hover:bg-[#EF4444]/20 text-[#EF4444]'
                    : 'bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981]'
                }`}
              >
                {res.status === 'ACTIVE' ? 'Disable Outlet' : 'Approve & Activate'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Check, Clock, AlertCircle } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';

export default function OwnerTables() {
  const { tables, updateTableStatus, reservations } = useReservation();

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
          Restaurant Floor & Table Management
        </h2>
        <p className="text-xs text-[#8E8E99]">
          Manage seating allocations across the Main Dining Atrium, Window Terrace, and Wine Cellar.
        </p>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map(table => {
          const activeRes = reservations.find(r => r.tableId === table.id && r.status === 'CONFIRMED');

          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-[#121215] border border-white/5 hover:border-white/10 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#D4AF37] block">{table.id}</span>
                  <h3 className="font-bold text-sm text-[#F7F4EE]">{table.name}</h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  table.status === 'AVAILABLE'
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : table.status === 'OCCUPIED'
                    ? 'bg-[#EF4444]/20 text-[#EF4444]'
                    : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                }`}>
                  {table.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-[#8E8E99]">
                <p>Capacity: <strong className="text-[#F7F4EE]">{table.seats} Guests</strong> ({table.shape})</p>
                <p>Zone: <span className="text-[#A0A0AA]">{table.section}</span></p>
                <p className="text-[11px] text-[#6E6E78] italic line-clamp-1">{table.ambiance}</p>
              </div>

              {activeRes && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[#D8D8E0] space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-semibold block">Active Booking</span>
                  <p className="font-medium text-[#F7F4EE]">{activeRes.customer?.name} ({activeRes.guests}p)</p>
                  <p className="text-[#8E8E99]">{activeRes.date} at {activeRes.time}</p>
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px]">
                <button
                  onClick={() => updateTableStatus(table.id, 'AVAILABLE')}
                  className={`py-1.5 rounded-lg border font-semibold transition-colors ${
                    table.status === 'AVAILABLE' ? 'border-[#10B981] bg-[#10B981]/20 text-[#10B981]' : 'border-white/5 bg-white/5 text-[#8E8E99] hover:text-white'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, 'OCCUPIED')}
                  className={`py-1.5 rounded-lg border font-semibold transition-colors ${
                    table.status === 'OCCUPIED' ? 'border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444]' : 'border-white/5 bg-white/5 text-[#8E8E99] hover:text-white'
                  }`}
                >
                  Occupied
                </button>
                <button
                  onClick={() => updateTableStatus(table.id, 'RESERVED')}
                  className={`py-1.5 rounded-lg border font-semibold transition-colors ${
                    table.status === 'RESERVED' ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#F59E0B]' : 'border-white/5 bg-white/5 text-[#8E8E99] hover:text-white'
                  }`}
                >
                  Reserved
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

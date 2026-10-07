import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, MapPin, Users } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';

export default function AdminReservations() {
  const { reservations, tables } = useReservation();
  const [search, setSearch] = useState('');

  const filtered = reservations.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.tableId.toLowerCase().includes(q) || r.customer?.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Platform Reservations Overview
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Active and historical table bookings across all restaurant sections.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Guest or Table ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      <div className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#8E8E99] bg-white/5">
                <th className="p-4">Reservation ID</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Table & Section</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Occasion</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(res => {
                const tableObj = tables.find(t => t.id === res.tableId);
                return (
                  <tr key={res.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#D4AF37]">#{res.id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-[#F7F4EE]">{res.customer?.name}</p>
                      <p className="text-[11px] text-[#8E8E99]">{res.customer?.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#F7F4EE]">{res.tableId}</span>
                      <span className="text-[#8E8E99] block text-[11px]">{tableObj?.section || 'Main Hall'}</span>
                    </td>
                    <td className="p-4 text-[#D8D8E0]">
                      <p>{res.date}</p>
                      <p className="text-[11px] text-[#8E8E99]">{res.time}</p>
                    </td>
                    <td className="p-4 font-semibold text-[#F7F4EE]">{res.guests} Guests</td>
                    <td className="p-4 text-[#A0A0AA]">{res.occasion || 'Dinner'}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        res.status === 'CONFIRMED' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

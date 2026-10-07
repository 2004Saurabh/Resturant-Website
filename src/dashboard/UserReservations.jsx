import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, XCircle, ArrowRight } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';

export default function UserReservations() {
  const { reservations, cancelReservation, tables } = useReservation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">Table Reservations</h2>
          <p className="text-xs text-[#8E8E99]">Manage your upcoming visits across our dining halls.</p>
        </div>
        <Link
          to="/reservation"
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Reserve Another Table</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#121215] border border-white/5 space-y-3">
          <Calendar className="w-10 h-10 text-[#8E8E99] mx-auto opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">No Active Reservations</h3>
          <p className="text-xs text-[#8E8E99]">Book an intimate table on our 3D floor plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map(res => {
            const tableObj = tables.find(t => t.id === res.tableId);
            const isConfirmed = res.status === 'CONFIRMED';

            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-[#121215] border border-white/5 hover:border-white/10 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                      {res.id}
                    </span>
                    <span className="font-bold text-sm text-[#F7F4EE]">{res.tableId}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isConfirmed ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#8E8E99]">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[#F7F4EE]">{res.date}</span>
                    <span className="mx-1">•</span>
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[#F7F4EE]">{res.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#8E8E99]">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{res.guests} Guests</span>
                    <span className="mx-1">•</span>
                    <span>{res.occasion}</span>
                  </div>

                  {tableObj && (
                    <div className="flex items-center gap-2 text-[11px] text-[#A0A0AA]">
                      <MapPin className="w-3.5 h-3.5 text-[#881A2D]" />
                      <span>{tableObj.section} • {tableObj.location}</span>
                    </div>
                  )}

                  {res.specialRequests && (
                    <p className="text-[11px] text-[#6E6E78] italic pt-1">
                      "{res.specialRequests}"
                    </p>
                  )}
                </div>

                {isConfirmed && (
                  <div className="pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="text-xs text-[#EF4444] hover:underline flex items-center gap-1 font-medium"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Reservation</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

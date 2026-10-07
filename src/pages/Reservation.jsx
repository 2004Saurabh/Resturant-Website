import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Check, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Info,
  Heart
} from 'lucide-react';
import RestaurantScene3D from '../components/RestaurantScene3D';
import { useReservation } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Reservation() {
  const { tables, selectedTableId, setSelectedTableId, reserveTable } = useReservation();
  const { currentUser } = useAuth();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState('Dinner Date');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(null);

  // Active table object
  const activeTable = tables.find(t => t.id === (selectedTableId || 'T01')) || tables[0];

  const handleSelectTable = (table) => {
    if (table.status === 'OCCUPIED' || table.status === 'RESERVED') {
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: {
          title: 'Table Unavailable',
          message: `${table.id} is currently ${table.status.toLowerCase()}. Please select an available table.`,
          type: 'error'
        }
      }));
      return;
    }
    setSelectedTableId(table.id);
  };

  const handleBookReservation = (e) => {
    e.preventDefault();
    if (!activeTable) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = reserveTable({
        customer: {
          name: currentUser?.name || 'Alexander Sterling',
          email: currentUser?.email || 'user@nocturne.com',
          phone: currentUser?.phone || '+1 (555) 234-5678'
        },
        tableId: activeTable.id,
        date,
        time,
        guests,
        occasion,
        specialRequests
      });

      setReservationSuccess(res);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Interactive Dining Experience</span>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-[#F7F4EE]">
            TABLE RESERVATION
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99]">
            Explore our architectural 3D dining hall and select your preferred table across our Garden Terrace, Main Atrium, and Sommelier Vault.
          </p>
        </div>

        {/* Success Modal Notification */}
        {reservationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-[#10B981]/15 border border-[#10B981]/40 text-center max-w-2xl mx-auto"
          >
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              Table {reservationSuccess.tableId} Confirmed
            </h3>
            <p className="text-xs text-[#A0A0AA] mt-1">
              Reservation #{reservationSuccess.id} on {reservationSuccess.date} at {reservationSuccess.time} for {reservationSuccess.guests} guests.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link
                to="/dashboard/user/reservations"
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider"
              >
                View in Dashboard
              </Link>
              <button
                onClick={() => setReservationSuccess(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Book Another Table
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: 3D Scene & 2D Table Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 3D Restaurant Scene */}
            <RestaurantScene3D
              tables={tables}
              selectedTableId={activeTable?.id}
              onSelectTable={handleSelectTable}
            />

            {/* 2D Table Matrix Grid for accessibility */}
            <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Floor Directory (Tables T01 - T12)
                </h3>
                <span className="text-[11px] text-[#8E8E99]">Click table to select</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {tables.map(table => {
                  const isCurrent = activeTable?.id === table.id;
                  const isAvailable = table.status === 'AVAILABLE';
                  const isReserved = table.status === 'RESERVED';
                  const isOccupied = table.status === 'OCCUPIED';

                  return (
                    <button
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        isCurrent
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-lg shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                          : isOccupied
                          ? 'border-white/5 bg-white/5 text-[#555560] cursor-not-allowed opacity-50'
                          : isReserved
                          ? 'border-[#F59E0B]/30 bg-[#F59E0B]/5 hover:border-[#F59E0B]'
                          : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/50 text-[#F7F4EE]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-[#F7F4EE]">{table.id}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isOccupied
                            ? 'bg-[#EF4444]'
                            : isReserved
                            ? 'bg-[#F59E0B]'
                            : isCurrent
                            ? 'bg-[#D4AF37]'
                            : 'bg-[#10B981]'
                        }`} />
                      </div>
                      <p className="text-[11px] text-[#8E8E99]">{table.seats} Guests • {table.shape}</p>
                      <p className="text-[10px] text-[#D4AF37] truncate mt-1">{table.section}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Active Table Specs & Reservation Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-white/10 shadow-2xl sticky top-28 space-y-6">
              
              {/* Selected Table Overview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#18181D] to-[#121215] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#D4AF37]">
                    Selected Dining Position
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeTable.status === 'AVAILABLE'
                      ? 'bg-[#10B981]/20 text-[#10B981]'
                      : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {activeTable.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {activeTable.name} ({activeTable.id})
                </h3>
                <p className="text-xs text-[#8E8E99]">
                  {activeTable.section} • {activeTable.location}
                </p>
                <p className="text-[11px] text-[#A0A0AA] italic pt-1 leading-relaxed">
                  "{activeTable.ambiance}"
                </p>
              </div>

              {/* Reservation Booking Form */}
              <form onSubmit={handleBookReservation} className="space-y-4">
                
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8E8E99] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8E8E99] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Time</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map(t => (
                        <option key={t} value={t} className="bg-[#141418]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests & Occasion */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8E8E99] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Guests</span>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                        <option key={g} value={g} className="bg-[#141418]">{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8E8E99]">Occasion</label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {['Dinner Date', 'Anniversary Celebration', 'Business Gastronomy', 'Birthday Banquet', 'Casual Tasting'].map(o => (
                        <option key={o} value={o} className="bg-[#141418]">{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#8E8E99]">Special Requests / Sommelier Notes</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., Window view, chilled bottle of Dom Pérignon on arrival, quiet corner..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || activeTable.status === 'OCCUPIED' || activeTable.status === 'RESERVED'}
                  className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registering Reservation...</span>
                  ) : activeTable.status !== 'AVAILABLE' ? (
                    <span>Selected Table Unavailable</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm Reservation for {activeTable.id}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8E99] pt-2 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Immediate Confirmation • No Cancellation Penalty</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

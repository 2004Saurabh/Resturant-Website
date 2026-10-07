import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, Heart, Briefcase, PartyPopper, Check, ArrowRight } from 'lucide-react';
import { useReservation } from '../context/ReservationContext';

export default function AIReservation() {
  const navigate = useNavigate();
  const { tables, reserveTable, setSelectedTableId } = useReservation();

  const [vibe, setVibe] = useState('romantic');
  const [guests, setGuests] = useState(2);
  const [timePreference, setTimePreference] = useState('evening');
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const vibes = [
    { id: 'romantic', title: 'Romantic & Intimate', desc: 'Candlelit, subdued acoustic jazz, secluded corner', icon: Heart },
    { id: 'business', title: 'High-Level Business', desc: 'Quiet acoustics, spacious marble tables, Sommelier service', icon: Briefcase },
    { id: 'celebration', title: 'Celebration Banquet', desc: 'High energy, central crystal chandelier, culinary view', icon: PartyPopper },
    { id: 'culinary', title: 'Culinary Theatrics', desc: "Chef's Robata counter, live embers, open flame", icon: Sparkles }
  ];

  const handleConsultAI = () => {
    setAnalyzing(true);
    setRecommendation(null);

    setTimeout(() => {
      let matchedTable = null;
      if (vibe === 'romantic') {
        matchedTable = tables.find(t => t.id === 'T01' || t.id === 'T05') || tables[0];
      } else if (vibe === 'business') {
        matchedTable = tables.find(t => t.id === 'T06' || t.id === 'T09') || tables[2];
      } else if (vibe === 'celebration') {
        matchedTable = tables.find(t => t.id === 'T03' || t.id === 'T07') || tables[3];
      } else {
        matchedTable = tables.find(t => t.id === 'T11' || t.id === 'T12') || tables[4];
      }

      setRecommendation(matchedTable);
      setAnalyzing(false);
    }, 1500);
  };

  const handleSelectRecommended = () => {
    if (recommendation) {
      setSelectedTableId(recommendation.id);
      navigate('/reservation');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#881A2D]/20 border border-[#881A2D]/40 text-xs font-semibold uppercase tracking-widest text-[#EF4444]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI Concierge</span>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-[#F7F4EE]">
            SMART TABLE CONCIERGE
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99]">
            Allow our neural hospitality engine to match your party with the optimal acoustic and architectural seating zone.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl space-y-8">
          
          {/* Vibe Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] block mb-3">
              Occasion & Atmospheric Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vibes.map(v => {
                const Icon = v.icon;
                const isSel = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSel
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-lg shadow-[#D4AF37]/10'
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSel ? 'text-[#D4AF37]' : 'text-[#8E8E99]'}`} />
                      {isSel && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <h3 className="text-sm font-bold text-[#F7F4EE]">{v.title}</h3>
                    <p className="text-[11px] text-[#8E8E99] mt-0.5">{v.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guests count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99]">Party Size</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n} className="bg-[#141418]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8E8E99]">Time Horizon</label>
              <select
                value={timePreference}
                onChange={(e) => setTimePreference(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="sunset" className="bg-[#141418]">Sunset Twilight (5:30 PM - 7:00 PM)</option>
                <option value="evening" className="bg-[#141418]">Prime Evening (7:30 PM - 9:30 PM)</option>
                <option value="latenight" className="bg-[#141418]">Late Nocturne (10:00 PM onwards)</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConsultAI}
            disabled={analyzing}
            className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Simulating Acoustic & Architectural Flow...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recommend Optimal Table</span>
              </>
            )}
          </button>

          {/* Recommendation Box */}
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-[#1A1612] to-[#121215] border border-[#D4AF37] space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  Best Atmospheric Match
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold">
                  98.4% Harmony Score
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {recommendation.name} ({recommendation.id}) — {recommendation.section}
                </h3>
                <p className="text-xs text-[#A0A0AA] mt-1 italic">
                  "{recommendation.ambiance}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-[#8E8E99]">Capacity: {recommendation.seats} guests</span>
                <button
                  onClick={handleSelectRecommended}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <span>Select Table & Complete Reservation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

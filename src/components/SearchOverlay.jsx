import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Flame, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFood } from '../context/FoodContext';
import { formatPrice } from '../utils/price';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { foods, setQuickViewDish } = useFood();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter matching foods
  const results = query.trim() === '' ? [] : foods.filter(dish => {
    const q = query.toLowerCase();
    const matchName = dish.name.toLowerCase().includes(q);
    const matchCategory = dish.category.toLowerCase().includes(q);
    const matchCuisine = dish.cuisine.toLowerCase().includes(q);
    const matchIngredients = dish.ingredients?.some(ing => ing.toLowerCase().includes(q));
    const matchDescription = dish.description.toLowerCase().includes(q);
    return matchName || matchCategory || matchCuisine || matchIngredients || matchDescription;
  }).slice(0, 8);

  const quickPicks = [
    'Butter Chicken',
    'Hyderabadi Biryani',
    'Truffle Pasta',
    'Paneer Tikka',
    'Neapolitan Pizza',
    'Tiramisu',
    'Robata Grill'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-[#141418] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 my-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, ingredients, cuisines, or pairings..."
                className="w-full bg-transparent text-base sm:text-lg text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-[#8E8E99] hover:text-[#F7F4EE]"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8E8E99]">
                  ESC
                </span>
              )}
            </div>

            {/* Quick Suggestions when empty */}
            {query.trim() === '' && (
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-[#8E8E99] uppercase tracking-wider font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Popular Epicurean Inquiries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPicks.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-[#D8D8E0] hover:text-[#D4AF37] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {query.trim() !== '' && (
              <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-2.5">
                {results.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-[#8E8E99]">
                      No courses found matching "<span className="text-[#F7F4EE]">{query}</span>"
                    </p>
                    <p className="text-xs text-[#6E6E78] mt-1">
                      Try searching by ingredient, category, or explore our curated menu.
                    </p>
                  </div>
                ) : (
                  results.map(dish => (
                    <div
                      key={dish.id}
                      onClick={() => {
                        onClose();
                        setQuickViewDish(dish);
                      }}
                      className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/30 transition-all flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#F7F4EE] group-hover:text-[#D4AF37] transition-colors truncate">
                              {dish.name}
                            </h4>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              dish.type === 'veg' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                            }`} />
                          </div>
                          <p className="text-xs text-[#8E8E99] truncate mt-0.5">
                            {dish.category} • {dish.cuisine}
                          </p>
                          <p className="text-[11px] text-[#A0A0AA] line-clamp-1 mt-0.5">
                            {dish.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-serif font-bold text-sm text-gold-gradient">
                          {formatPrice(dish.price)}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8E8E99] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E0E11] border-t border-white/5 flex items-center justify-between text-xs text-[#8E8E99]">
              <span>Click any dish to open the 3D food customizer</span>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/menu?search=${encodeURIComponent(query)}`);
                }}
                className="text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <span>View Full Results in Menu</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

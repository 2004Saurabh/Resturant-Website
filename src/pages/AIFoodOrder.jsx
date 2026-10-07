import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Leaf, 
  Check, 
  ShoppingBag, 
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { useFood } from '../context/FoodContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

export default function AIFoodOrder() {
  const { foods } = useFood();
  const { addToCart } = useCart();

  // Wizard state
  const [step, setStep] = useState(1);
  const [isCurating, setIsCurating] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [addedAll, setAddedAll] = useState(false);

  // User Selections
  const [mood, setMood] = useState('Something Spicy');
  const [diet, setDiet] = useState('all');
  const [spice, setSpice] = useState('Medium');
  const [budget, setBudget] = useState('all'); // 'under20' | 'under35' | 'luxury' | 'all'
  const [cuisine, setCuisine] = useState('all');

  const moods = [
    { id: 'Something Spicy', title: 'Something Spicy', desc: 'Fiery wok toss & tandoor chilies', icon: Flame },
    { id: 'Healthy', title: 'Healthy & Light', desc: 'Protein-packed, steamed & fresh', icon: Leaf },
    { id: 'Comfort Food', title: 'Comfort Food', desc: 'Slow-simmered gravies & buttery warmth', icon: Heart },
    { id: 'Romantic Dinner', title: 'Romantic Dinner', desc: 'Truffles, saffron & intimate courses', icon: Sparkles },
    { id: 'Family Meal', title: 'Family Feast', desc: 'Biryani pots & sharing platters', icon: ShoppingBag },
    { id: 'Quick Bite', title: 'Quick Bite', desc: 'Crisp street food & artisan burgers', icon: Clock },
    { id: 'Chef Choice', title: "Chef's Choice", desc: 'Highest rated 5.0 Michelin signatures', icon: Sparkles }
  ];

  const handleGenerate = () => {
    setIsCurating(true);
    setRecommendations(null);

    setTimeout(() => {
      // Frontend AI matching logic
      let matched = foods.filter(dish => {
        // Diet check
        if (diet !== 'all' && dish.type !== diet) return false;

        // Spice check
        if (mood === 'Something Spicy' && dish.spiceLevel === 'Mild') return false;

        // Budget check (in Rupees)
        if (budget === 'under300' && dish.price > 300) return false;
        if (budget === 'under500' && dish.price > 500) return false;
        if (budget === 'luxury' && dish.price < 450) return false;

        // Cuisine check
        if (cuisine !== 'all' && !dish.cuisine.toLowerCase().includes(cuisine.toLowerCase())) return false;

        return true;
      });

      // Tailor based on mood
      if (mood === 'Something Spicy') {
        matched.sort((a, b) => (b.spiceLevel === 'Hot' || b.spiceLevel === 'Fiery' ? 1 : -1));
      } else if (mood === 'Romantic Dinner') {
        matched = matched.filter(d => d.name.includes('Truffle') || d.name.includes('Saffron') || d.name.includes('Wine') || d.chefSpecial);
      } else if (mood === "Chef Choice") {
        matched = matched.filter(d => d.rating >= 4.9 || d.chefSpecial);
      } else if (mood === 'Comfort Food') {
        matched = matched.filter(d => d.categoryId === 'indian-main-non-veg' || d.categoryId === 'indian-main-veg' || d.categoryId === 'pasta');
      } else if (mood === 'Quick Bite') {
        matched = matched.filter(d => d.categoryId === 'burgers' || d.categoryId === 'street-food' || d.categoryId === 'veg-starters');
      }

      // If matches are too few, loosen criteria
      if (matched.length < 4) {
        matched = foods.filter(d => diet === 'all' || d.type === diet).slice(0, 6);
      }

      setRecommendations(matched.slice(0, 6));
      setIsCurating(false);
      setStep(3); // Result step
    }, 1800);
  };

  const handleAddAllToCart = () => {
    if (!recommendations) return;
    recommendations.forEach(dish => {
      addToCart(dish, {}, 1);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  const totalCoursePrice = recommendations
    ? recommendations.reduce((acc, d) => acc + d.price, 0)
    : 0;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#881A2D]/20 border border-[#881A2D]/40 text-xs font-semibold uppercase tracking-widest text-[#EF4444]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Generative Culinary Sommelier</span>
          </div>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-[#F7F4EE]">
            AI FOOD ORDERING
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99]">
            Tell our culinary intelligence your craving, appetite, and occasion. We curate a personalized Michelin-grade dining flight.
          </p>
        </div>

        {/* Wizard Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
            step === 1 ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-[#8E8E99]'
          }`}>
            1. Mood & Appetite
          </div>
          <div className="w-8 h-[1px] bg-white/10" />
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
            step === 2 ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-[#8E8E99]'
          }`}>
            2. Dietary & Budget
          </div>
          <div className="w-8 h-[1px] bg-white/10" />
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
            step === 3 ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37]' : 'border-white/10 text-[#8E8E99]'
          }`}>
            3. Curated Flight
          </div>
        </div>

        {/* Step 1: Mood & Craving Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-2xl font-bold text-[#F7F4EE] mb-2 text-center">
              What are you craving tonight?
            </h2>
            <p className="text-xs text-[#8E8E99] text-center mb-8">
              Select your dining mood or the experience you wish to savor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {moods.map(m => {
                const IconComponent = m.icon;
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-xl shadow-[#D4AF37]/10'
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#D4AF37] text-[#0A0A0C]' : 'bg-white/5 text-[#D4AF37]'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <h3 className="text-sm font-semibold text-[#F7F4EE]">{m.title}</h3>
                    <p className="text-[11px] text-[#8E8E99] mt-1">{m.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Dietary, Spice & Budget Preferences */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl max-w-4xl mx-auto space-y-8"
          >
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-[#F7F4EE] mb-1">
                Refine Your Culinary Specifications
              </h2>
              <p className="text-xs text-[#8E8E99]">
                Tailor dietary requirements, spice thresholds, and investment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Dietary Requirement */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All Dishes' },
                    { id: 'veg', label: 'Pure Veg' },
                    { id: 'non-veg', label: 'Non-Veg' }
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDiet(d.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        diet === d.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Tolerance */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Spice Sensitivity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Mild', 'Medium', 'Hot', 'Fiery'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSpice(s)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        spice === s
                          ? 'border-[#EF4444] bg-[#EF4444]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Budget Expectation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Flexible' },
                    { id: 'under300', label: 'Under ₹300' },
                    { id: 'under500', label: 'Under ₹500' },
                    { id: 'luxury', label: 'Grand Cru ₹600+' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBudget(b.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        budget === b.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:bg-white/10'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Preference */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                  Cuisine Lean
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'Global' },
                    { id: 'Indian', label: 'North Indian' },
                    { id: 'Italian', label: 'Italian' },
                    { id: 'Asian', label: 'Asian Wok' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCuisine(c.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        cuisine === c.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:bg-white/10'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Recommendations</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading / Curating Animation State */}
        {isCurating && (
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#D4AF37] animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D4AF37] animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-[#F7F4EE] tracking-widest uppercase">
                AI CURATING YOUR EXPERIENCE...
              </h3>
              <p className="text-xs text-[#8E8E99] mt-2">
                Analyzing flavor balances, spice harmonizations, and chef ratings for "{mood}"...
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Generated Curated Flight */}
        {step === 3 && recommendations && !isCurating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Flight Summary Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#181418] via-[#121215] to-[#16141A] border border-[#D4AF37]/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37] block mb-1">
                  AI Personalized Tasting Flight
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                  The "{mood}" Curation
                </h2>
                <p className="text-xs text-[#8E8E99] mt-1">
                  {recommendations.length} tailored courses composed with complimentary flavor arcs.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#8E8E99] block">Total Flight Value</span>
                  <span className="font-serif text-2xl font-bold text-gold-gradient">
                    {formatPrice(totalCoursePrice)}
                  </span>
                </div>

                <button
                  onClick={handleAddAllToCart}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 ${
                    addedAll
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] shadow-[#D4AF37]/30'
                  }`}
                >
                  {addedAll ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>All Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Complete Flight</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8E8E99] hover:text-white"
                  title="Recalculate AI Flight"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recommended Foods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(dish => (
                <FoodCard key={dish.id} dish={dish} />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

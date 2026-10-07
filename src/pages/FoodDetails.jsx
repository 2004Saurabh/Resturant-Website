import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Flame, 
  Clock, 
  Star, 
  Check, 
  Plus, 
  Minus, 
  RotateCw, 
  Sparkles,
  Award
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';
import FoodCard from '../components/FoodCard';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, isFavorite, toggleFavorite } = useFood();
  const { addToCart } = useCart();

  const dish = foods.find(f => f.id === id) || foods[0];
  const isFav = isFavorite(dish.id);

  const [quantity, setQuantity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [added, setAdded] = useState(false);

  // Customization state
  const [customizations, setCustomizations] = useState({
    extraCheese: false,
    spiceAdjustment: 'Standard',
    noOnion: false,
    noGarlic: false,
    extraSauce: false,
    addDrink: false,
    addDessert: false
  });

  // Calculate price (in Rupees)
  let extraCost = 0;
  if (customizations.extraCheese) extraCost += 40;
  if (customizations.extraSauce) extraCost += 30;
  if (customizations.addDrink) extraCost += 90;
  if (customizations.addDessert) extraCost += 120;

  const unitPrice = (dish.price || 0) + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(dish, customizations, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Complementary pairings
  const pairings = foods
    .filter(f => f.id !== dish.id && (f.categoryId === 'beverages' || f.categoryId === 'desserts'))
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8E8E99] hover:text-[#D4AF37] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu Selection</span>
        </button>

        {/* Main Details Presentation Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#121215] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl mb-16">
          
          {/* Left Column: 360° Visual Stage */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between relative bg-gradient-to-b from-[#18181D] to-[#0E0E12] rounded-2xl p-8 border border-white/5">
            
            <div className="w-full flex items-center justify-between z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border flex items-center gap-1.5 ${
                dish.type === 'veg'
                  ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]'
                  : 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dish.type === 'veg' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                {dish.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>

              <button
                onClick={() => toggleFavorite(dish.id)}
                className={`p-3 rounded-full border transition-all ${
                  isFav
                    ? 'border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444]'
                    : 'border-white/10 bg-white/5 text-[#8E8E99] hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Rotating Hero Image */}
            <div className="my-10 relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full p-3 border-2 border-[#D4AF37]/40 shadow-2xl shadow-black relative bg-[#18181D]"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-full select-none"
                />
                <div className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF37]/30 animate-spin-slow pointer-events-none" />
              </motion.div>
              <div className="absolute w-72 h-72 rounded-full bg-[#881A2D]/20 blur-3xl pointer-events-none" />
            </div>

            {/* Rotation Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F7F4EE] flex items-center gap-2 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                Rotate 360° Angle ({rotation}°)
              </button>
            </div>

          </div>

          {/* Right Column: Culinary Specs & Customizer */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold tracking-wider uppercase">
                <span>{dish.category}</span>
                <span>•</span>
                <span>{dish.cuisine}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE] mt-1">
                {dish.name}
              </h1>

              {/* Ratings and timing */}
              <div className="flex items-center gap-4 text-xs text-[#8E8E99] mt-3">
                <div className="flex items-center gap-1 text-[#F7F4EE]">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-bold">{dish.rating}</span>
                  <span>({dish.reviews} gourmet reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{dish.preparationTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>{dish.calories} kcal</span>
                </div>
              </div>

              <p className="text-sm text-[#A0A0AA] mt-4 leading-relaxed font-light">
                {dish.description}
              </p>

              {/* Ingredients */}
              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wider text-[#8E8E99] font-semibold mb-2">
                  Composition & Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients?.map((ing, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-xs text-[#D8D8E0]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-time Customization */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-[#F7F4EE] font-semibold">
                  Personalize Course Preparation
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <span className="text-[#D8D8E0]">Extra Cheese</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#D4AF37] text-[11px]">+₹40</span>
                      <input
                        type="checkbox"
                        checked={customizations.extraCheese}
                        onChange={(e) => setCustomizations(prev => ({ ...prev, extraCheese: e.target.checked }))}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                      />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <span className="text-[#D8D8E0]">Extra Sauce</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#D4AF37] text-[11px]">+₹30</span>
                      <input
                        type="checkbox"
                        checked={customizations.extraSauce}
                        onChange={(e) => setCustomizations(prev => ({ ...prev, extraSauce: e.target.checked }))}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                      />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <span className="text-[#D8D8E0]">No Onion</span>
                    <input
                      type="checkbox"
                      checked={customizations.noOnion}
                      onChange={(e) => setCustomizations(prev => ({ ...prev, noOnion: e.target.checked }))}
                      className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <span className="text-[#D8D8E0]">No Garlic</span>
                    <input
                      type="checkbox"
                      checked={customizations.noGarlic}
                      onChange={(e) => setCustomizations(prev => ({ ...prev, noGarlic: e.target.checked }))}
                      className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart Footer */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-[#F7F4EE]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-[#8E8E99] block">Total</span>
                  <span className="font-serif text-2xl font-bold text-gold-gradient">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                  added
                    ? 'bg-[#10B981] text-white shadow-[#10B981]/30'
                    : 'bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] shadow-[#D4AF37]/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • {formatPrice(totalPrice)}</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

        {/* Sommelier Pairings */}
        {pairings.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE] mb-6">
              Recommended Sommelier Pairings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pairings.map(item => (
                <FoodCard key={item.id} dish={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

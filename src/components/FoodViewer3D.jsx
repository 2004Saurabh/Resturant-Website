import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  RotateCw, 
  Flame, 
  Clock, 
  Sparkles, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Heart, 
  Check, 
  Share2,
  Utensils,
  Leaf
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

export default function FoodViewer3D() {
  const { quickViewDish, setQuickViewDish, toggleFavorite, isFavorite } = useFood();
  const { addToCart } = useCart();

  const [rotationDegree, setRotationDegree] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Customization state
  const [customizations, setCustomizations] = useState({
    extraCheese: false,
    spiceAdjustment: 'Standard', // 'Less Spicy' | 'Standard' | 'Extra Spicy'
    noOnion: false,
    noGarlic: false,
    extraSauce: false,
    addDrink: false,
    addDessert: false
  });

  if (!quickViewDish) return null;

  const dish = quickViewDish;
  const isFav = isFavorite(dish.id);

  // Compute live price with customizations (in Rupees)
  let extraCost = 0;
  if (customizations.extraCheese) extraCost += 40;
  if (customizations.extraSauce) extraCost += 30;
  if (customizations.addDrink) extraCost += 90;
  if (customizations.addDessert) extraCost += 120;

  const currentUnitPrice = (dish.price || 0) + extraCost;
  const grandTotal = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(dish, customizations, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRotateClick = () => {
    setRotationDegree(prev => (prev + 90) % 360);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewDish(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#121215] border border-white/10 rounded-3xl shadow-2xl shadow-black overflow-hidden z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewDish(null)}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-black flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* Left Column: 360° Visual Stage */}
            <div className="lg:col-span-6 bg-gradient-to-b from-[#18181D] to-[#0E0E11] p-6 sm:p-8 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
              
              {/* Badges row */}
              <div className="w-full flex items-center justify-between z-10">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border flex items-center gap-1.5 ${
                  dish.type === 'veg'
                    ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]'
                    : 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${dish.type === 'veg' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                  {dish.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>

                <button
                  onClick={() => toggleFavorite(dish.id)}
                  className={`p-2.5 rounded-full border transition-all ${
                    isFav
                      ? 'border-[#EF4444]/50 bg-[#EF4444]/15 text-[#EF4444]'
                      : 'border-white/10 bg-white/5 text-[#8E8E99] hover:text-[#F7F4EE]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* 360 Interactive Rotating Dish Stage */}
              <div className="relative my-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: rotationDegree }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="w-56 h-56 sm:w-72 sm:h-72 rounded-full p-2.5 border-2 border-[#D4AF37]/30 shadow-2xl shadow-black relative bg-[#18181D]"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover rounded-full select-none"
                    draggable={false}
                  />
                  {/* Decorative golden orbit */}
                  <div className="absolute -inset-3 rounded-full border border-dashed border-[#D4AF37]/30 animate-spin-slow pointer-events-none" />
                </motion.div>

                {/* Ambient glow behind dish */}
                <div className="absolute w-64 h-64 rounded-full bg-[#881A2D]/15 blur-3xl pointer-events-none" />
              </div>

              {/* 360 Rotation Controls */}
              <div className="w-full flex flex-col items-center gap-2 z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRotateClick}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium tracking-wide text-[#F7F4EE] flex items-center gap-2 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Rotate View 90°
                  </button>
                  <span className="text-xs text-[#8E8E99]">
                    {rotationDegree}° View
                  </span>
                </div>
                <p className="text-[10px] tracking-wider text-[#6E6E78] uppercase">
                  Cinematic 360° Interactive Presentation
                </p>
              </div>

            </div>

            {/* Right Column: Culinary Details & Real-time Customizer */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                
                {/* Category & Cuisine */}
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-medium tracking-wider uppercase">
                  <span>{dish.category}</span>
                  <span>•</span>
                  <span>{dish.cuisine}</span>
                </div>

                {/* Dish Title */}
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F4EE] font-bold mt-1">
                  {dish.name}
                </h2>

                {/* Key Metrics Row */}
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-[#8E8E99]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{dish.preparationTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>{dish.calories} kcal</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#D4AF37]">★</span>
                    <span className="text-[#F7F4EE] font-semibold">{dish.rating}</span>
                    <span>({dish.reviews} reviews)</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#A0A0AA] mt-3.5 leading-relaxed">
                  {dish.description}
                </p>

                {/* Ingredients chips */}
                <div className="mt-4">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E99] mb-2">
                    Key Ingredients & Notes
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.ingredients?.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-[#D8D8E0]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Customizations Section */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F7F4EE]">
                      Customize Your Dish
                    </h4>
                    <span className="text-[10px] text-[#D4AF37] tracking-wider uppercase font-medium">
                      Real-time Adjustments
                    </span>
                  </div>

                  {/* Spice Level Selector */}
                  <div>
                    <span className="text-[11px] text-[#8E8E99] block mb-1.5">Spice Adjustment</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Less Spicy', 'Standard', 'Extra Spicy'].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setCustomizations(prev => ({ ...prev, spiceAdjustment: level }))}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            customizations.spiceAdjustment === level
                              ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                              : 'border-white/10 bg-white/5 text-[#8E8E99] hover:bg-white/10'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    
                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">Extra Cheese</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D4AF37]">+₹40</span>
                        <input
                          type="checkbox"
                          checked={customizations.extraCheese}
                          onChange={(e) => setCustomizations(prev => ({ ...prev, extraCheese: e.target.checked }))}
                          className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">Extra Sauce</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D4AF37]">+₹30</span>
                        <input
                          type="checkbox"
                          checked={customizations.extraSauce}
                          onChange={(e) => setCustomizations(prev => ({ ...prev, extraSauce: e.target.checked }))}
                          className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">No Onion</span>
                      <input
                        type="checkbox"
                        checked={customizations.noOnion}
                        onChange={(e) => setCustomizations(prev => ({ ...prev, noOnion: e.target.checked }))}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">No Garlic</span>
                      <input
                        type="checkbox"
                        checked={customizations.noGarlic}
                        onChange={(e) => setCustomizations(prev => ({ ...prev, noGarlic: e.target.checked }))}
                        className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">Add Pairing Drink</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D4AF37]">+₹90</span>
                        <input
                          type="checkbox"
                          checked={customizations.addDrink}
                          onChange={(e) => setCustomizations(prev => ({ ...prev, addDrink: e.target.checked }))}
                          className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-[#D8D8E0]">Add Chef Dessert</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#D4AF37]">+₹120</span>
                        <input
                          type="checkbox"
                          checked={customizations.addDessert}
                          onChange={(e) => setCustomizations(prev => ({ ...prev, addDessert: e.target.checked }))}
                          className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                        />
                      </div>
                    </label>

                  </div>
                </div>

              </div>

              {/* Bottom Action Footer */}
              <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Quantity adjuster */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-[#F7F4EE]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Price</span>
                    <span className="font-serif text-lg font-bold text-gold-gradient">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${
                    added
                      ? 'bg-[#10B981] text-white shadow-[#10B981]/30'
                      : 'bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] shadow-[#D4AF37]/30'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Dining Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • {formatPrice(grandTotal)}</span>
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

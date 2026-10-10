import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Flame, Clock, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFood } from '../context/FoodContext';
import { formatPrice } from '../utils/price';

export default function FoodCard({ dish }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isFavorite, toggleFavorite, setQuickViewDish } = useFood();
  const [imgSrc, setImgSrc] = useState(dish.image);

  const isFav = isFavorite(dish.id);

  // Check live quantity of this dish in cart
  const cartIndex = cart.findIndex(item => item.dish.id === dish.id);
  const inCartQty = cartIndex > -1 ? cart[cartIndex].quantity : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(dish, {}, 1);
  };

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(dish.id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewDish(dish);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group relative bg-[#121215] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        inCartQty > 0
          ? 'border-[#D4AF37]/60 shadow-xl shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30'
          : 'border-white/5 hover:border-[#D4AF37]/30 hover:shadow-2xl hover:shadow-black/70'
      }`}
    >
      {/* Top Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181D]">
        
        {/* Real Food Image with Hover Zoom */}
        <img
          src={imgSrc}
          alt={dish.name}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80')}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30 pointer-events-none" />

        {/* Veg / Non-Veg Indicator Dot */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <div className={`w-5 h-5 rounded-md p-1 border flex items-center justify-center bg-black/60 backdrop-blur-md ${
            dish.type === 'veg' ? 'border-[#10B981]' : 'border-[#EF4444]'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              dish.type === 'veg' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
            }`} />
          </div>
        </div>

        {/* Badges: Bestseller / Chef Special / In Cart */}
        <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-1.5 items-end">
          {inCartQty > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/30 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              {inCartQty} in Cart
            </span>
          )}
          {dish.bestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#18181D]/90 text-[#D4AF37] border border-[#D4AF37]/40 backdrop-blur-md shadow-md">
              Bestseller
            </span>
          )}
          {dish.chefSpecial && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#881A2D] text-white shadow-lg shadow-[#881A2D]/30">
              Chef Special
            </span>
          )}
        </div>

        {/* Quick View & Favorite Floating Action Bar */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-black/70 border border-white/20 text-[#F7F4EE] hover:text-[#D4AF37] hover:border-[#D4AF37] backdrop-blur-md transition-colors"
            title="3D Food Experience"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleFav}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isFav
                ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                : 'bg-black/70 border-white/20 text-[#F7F4EE] hover:text-[#EF4444]'
            }`}
            title="Add to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Spice Level indicator chip */}
        {dish.spiceLevel && dish.spiceLevel !== 'Mild' && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-[10px] text-[#EF4444]">
            <Flame className="w-3 h-3 fill-current" />
            <span>{dish.spiceLevel}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8E8E99] mb-1.5">
            <span className="text-[11px] font-medium tracking-wider text-[#D4AF37] uppercase">
              {dish.category}
            </span>
            <div className="flex items-center gap-1 text-[#F7F4EE]">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-semibold text-xs">{dish.rating}</span>
              <span className="text-[10px] text-[#8E8E99]">({dish.reviews})</span>
            </div>
          </div>

          {/* Dish Name */}
          <Link
            to={`/food/${dish.id}`}
            className="font-serif text-lg font-bold text-[#F7F4EE] group-hover:text-[#D4AF37] transition-colors line-clamp-1"
          >
            {dish.name}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#8E8E99] line-clamp-2 mt-1.5 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Price & Add / Quantity Stepper Footer */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3">
          
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[#6E6E78]">Price</span>
            <span className="font-serif text-lg font-bold text-gold-gradient">
              {formatPrice(dish.price)}
            </span>
          </div>

          {inCartQty > 0 ? (
            <div className="flex items-center bg-[#D4AF37] text-[#0A0A0C] rounded-xl overflow-hidden shadow-lg shadow-[#D4AF37]/30 font-bold">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(cartIndex, inCartQty - 1);
                }}
                className="px-3 py-2 hover:bg-[#E8C766] transition-colors flex items-center justify-center active:scale-90"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="px-2 text-xs font-black min-w-[22px] text-center select-none">
                {inCartQty}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(cartIndex, inCartQty + 1);
                }}
                className="px-3 py-2 hover:bg-[#E8C766] transition-colors flex items-center justify-center active:scale-90"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!dish.available}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                !dish.available
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#18181D] border border-white/10 hover:border-[#D4AF37] text-[#F7F4EE] hover:text-[#D4AF37] hover:bg-white/5 active:scale-95'
              }`}
            >
              {!dish.available ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </motion.div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useFood } from '../context/FoodContext';
import FoodCard from '../components/FoodCard';

export default function Favorites() {
  const { foods, favorites } = useFood();

  const favoriteFoods = foods.filter(dish => favorites.includes(dish.id));

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs font-semibold text-[#EF4444] uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Personal Tasting Cellar</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F7F4EE]">
            FAVORITE COURSES
          </h1>
          <p className="text-xs text-[#8E8E99]">
            Your curated collection of beloved dishes, ready for one-touch ordering.
          </p>
        </div>

        {favoriteFoods.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#121215] border border-white/5 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full border border-dashed border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">No Favorites Yet</h3>
            <p className="text-xs text-[#8E8E99] mt-2 leading-relaxed">
              Explore our menu and tap the heart icon on any course to save it to your private cellar.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider"
            >
              <span>Explore Tasting Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteFoods.map(dish => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

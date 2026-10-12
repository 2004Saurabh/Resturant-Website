import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import FoodGrid from '../components/FoodGrid';
import { useFood } from '../context/FoodContext';
import { Search, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

export default function ManualFoodOrder() {
  const { foods } = useFood();
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'all-dishes'
  const [search, setSearch] = useState('');

  const filtered = foods.filter(dish => {
    if (!search) return true;
    const q = search.toLowerCase();
    return dish.name.toLowerCase().includes(q) || dish.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
            Artisanal Cellar & Kitchen
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-[#F7F4EE]">
            GOURMET ORDER EXPLORER
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99]">
            Exhaustive culinary catalog with 13 regional disciplines, chef notes, and complete ingredient breakdowns.
          </p>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-4 rounded-2xl bg-[#121215] border border-white/5">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'categories'
                  ? 'bg-[#D4AF37] text-[#0A0A0C]'
                  : 'text-[#8E8E99] hover:text-white'
              }`}
            >
              Browse 13 Categories
            </button>
            <button
              onClick={() => setActiveTab('all-dishes')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'all-dishes'
                  ? 'bg-[#D4AF37] text-[#0A0A0C]'
                  : 'text-[#8E8E99] hover:text-white'
              }`}
            >
              All 100+ Dishes
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search complete menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Content Display */}
        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <FoodGrid foods={filtered} />
        )}

      </div>
    </div>
  );
}

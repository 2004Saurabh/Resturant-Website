import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  Flame, 
  Star, 
  Leaf, 
  Sparkles 
} from 'lucide-react';
import FoodGrid from '../components/FoodGrid';
import { useFood } from '../context/FoodContext';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/price';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { foods } = useFood();

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [dietaryType, setDietaryType] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [maxPrice, setMaxPrice] = useState(800);
  const [minRating, setMinRating] = useState(0);
  const [selectedSpice, setSelectedSpice] = useState('all'); // 'all' | 'Mild' | 'Medium' | 'Hot' | 'Fiery'
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [onlyChefSpecial, setOnlyChefSpecial] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  // Unique cuisines from dataset
  const cuisines = useMemo(() => {
    const list = Array.from(new Set(foods.map(f => f.cuisine).filter(Boolean)));
    return ['all', ...list];
  }, [foods]);

  const [selectedCuisine, setSelectedCuisine] = useState('all');

  // Filtered & Sorted Foods
  const filteredFoods = useMemo(() => {
    return foods.filter(dish => {
      // Search text
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matches = 
          dish.name.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          dish.cuisine.toLowerCase().includes(q) ||
          dish.ingredients?.some(i => i.toLowerCase().includes(q)) ||
          dish.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (dish.categoryId !== selectedCategory && dish.category !== selectedCategory) {
          return false;
        }
      }

      // Dietary filter
      if (dietaryType !== 'all') {
        if (dish.type !== dietaryType) return false;
      }

      // Cuisine filter
      if (selectedCuisine !== 'all') {
        if (dish.cuisine !== selectedCuisine) return false;
      }

      // Price filter
      if (dish.price > maxPrice) return false;

      // Rating filter
      if (minRating > 0 && dish.rating < minRating) return false;

      // Spice level filter
      if (selectedSpice !== 'all') {
        if (dish.spiceLevel !== selectedSpice) return false;
      }

      // Bestseller toggle
      if (onlyBestsellers && !dish.bestseller) return false;

      // Chef Special toggle
      if (onlyChefSpecial && !dish.chefSpecial) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [
    foods,
    searchTerm,
    selectedCategory,
    dietaryType,
    selectedCuisine,
    maxPrice,
    minRating,
    selectedSpice,
    onlyBestsellers,
    onlyChefSpecial,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setDietaryType('all');
    setSelectedCuisine('all');
    setMaxPrice(800);
    setMinRating(0);
    setSelectedSpice('all');
    setOnlyBestsellers(false);
    setOnlyChefSpecial(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters = 
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    dietaryType !== 'all' ||
    selectedCuisine !== 'all' ||
    maxPrice < 800 ||
    minRating > 0 ||
    selectedSpice !== 'all' ||
    onlyBestsellers ||
    onlyChefSpecial;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
            NOCTURNE GASTRONOMY
          </span>
          <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-[#F7F4EE]">
            HAUTE CUISINE MENU
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99]">
            Exquisite courses prepared with wood-fired heat, slow-cooked royal traditions, and artisanal European pastry.
          </p>
        </div>

        {/* Category Horizontal Pill Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchParams({});
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#D4AF37] text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/30'
                : 'bg-white/5 text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 border border-white/5'
            }`}
          >
            All Courses ({foods.length})
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams({ category: cat.id });
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#D4AF37] text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-white/5 text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Bar & Controls */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl mb-8 space-y-4">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dish, ingredients, cuisine..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-[#D4AF37]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-[#8E8E99] hover:text-[#F7F4EE]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Dietary Toggle Pills */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto">
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setDietaryType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    dietaryType === 'all' ? 'bg-white/10 text-[#F7F4EE]' : 'text-[#8E8E99] hover:text-white'
                  }`}
                >
                  All Diet
                </button>
                <button
                  onClick={() => setDietaryType('veg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryType === 'veg' ? 'bg-[#10B981]/20 text-[#10B981] font-semibold' : 'text-[#8E8E99] hover:text-[#10B981]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Pure Veg
                </button>
                <button
                  onClick={() => setDietaryType('non-veg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryType === 'non-veg' ? 'bg-[#EF4444]/20 text-[#EF4444] font-semibold' : 'text-[#8E8E99] hover:text-[#EF4444]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  Non-Veg
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured" className="bg-[#141418]">Featured Sort</option>
                <option value="price-asc" className="bg-[#141418]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#141418]">Price: High to Low</option>
                <option value="rating-desc" className="bg-[#141418]">Highest Rated (★ 5.0)</option>
              </select>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-[#F7F4EE]"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Expanded Filter Row (Always visible on desktop, collapsible on mobile) */}
          <div className={`${mobileFilterOpen ? 'block' : 'hidden lg:block'} pt-4 border-t border-white/5`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Price Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#8E8E99]">
                  <span>Max Price:</span>
                  <span className="text-[#D4AF37] font-semibold">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="20"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* Spice Level */}
              <div className="space-y-1.5">
                <span className="text-[#8E8E99]">Spice Intensity:</span>
                <div className="flex gap-1">
                  {['all', 'Mild', 'Medium', 'Hot', 'Fiery'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpice(s)}
                      className={`flex-1 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        selectedSpice === s
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99]'
                      }`}
                    >
                      {s === 'all' ? 'Any' : s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div className="space-y-1.5">
                <span className="text-[#8E8E99]">Minimum Rating:</span>
                <div className="flex gap-1">
                  {[0, 4.5, 4.8, 4.9].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex-1 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                        minRating === r
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99]'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles & Reset */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#D8D8E0]">
                  <input
                    type="checkbox"
                    checked={onlyBestsellers}
                    onChange={(e) => setOnlyBestsellers(e.target.checked)}
                    className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                  />
                  <span>Bestsellers</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[#D8D8E0]">
                  <input
                    type="checkbox"
                    checked={onlyChefSpecial}
                    onChange={(e) => setOnlyChefSpecial(e.target.checked)}
                    className="rounded border-white/20 text-[#D4AF37] focus:ring-0 bg-transparent"
                  />
                  <span>Chef Specials</span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[#EF4444] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-[#8E8E99] mb-6">
          <p>
            Displaying <span className="text-[#F7F4EE] font-semibold">{filteredFoods.length}</span> dishes
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
          {hasActiveFilters && (
            <span className="text-[#D4AF37] text-[11px]">Filtered Results Active</span>
          )}
        </div>

        {/* Food Grid */}
        <FoodGrid foods={filteredFoods} />

      </div>
    </div>
  );
}

import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  UtensilsCrossed, 
  Calendar, 
  Award, 
  Compass, 
  Flame, 
  ChevronRight, 
  Star,
  Clock,
  Wine
} from 'lucide-react';
import Hero3D from '../components/Hero3D';
import FoodCard from '../components/FoodCard';
import CategoryCard from '../components/CategoryCard';
import { useFood } from '../context/FoodContext';
import { CATEGORIES } from '../data/categories';

export default function Home() {
  const navigate = useNavigate();
  const { foods } = useFood();

  // Curated selections
  const bestsellers = foods.filter(f => f.bestseller).slice(0, 4);
  const grilledSpecials = foods.filter(f => f.categoryId === 'veg-starters' || f.categoryId === 'non-veg-starters').slice(0, 4);
  const signatureMains = foods.filter(f => f.categoryId === 'indian-main-non-veg' || f.categoryId === 'biryani').slice(0, 4);
  const desserts = foods.filter(f => f.categoryId === 'desserts').slice(0, 4);

  return (
    <div className="relative overflow-hidden bg-[#0A0A0C]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center items-center overflow-hidden">
        
        {/* Subtle Luxury Atmospheric Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#881A2D]/15 via-[#D4AF37]/10 to-transparent blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#881A2D]/10 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Oversized Typography & Luxury Story */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-xs font-medium tracking-widest uppercase text-[#D4AF37]"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Michelin Star Gastronomy • 3D AI Experience</span>
            </motion.div>

            {/* Oversized Editorial Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="space-y-0"
            >
              <h1 className="font-cinzel text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-[#F7F4EE]">
                TASTE
              </h1>
              <h1 className="font-cinzel text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-gold-gradient">
                BEYOND
              </h1>
              <h1 className="font-cinzel text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight leading-[0.9] text-[#F7F4EE]">
                IMAGINATION.
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-sm sm:text-base text-[#A0A0AA] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              A new generation of dining where culinary artistry meets intelligent technology. Savor wood-fired embers, royal dum pukht, and precision AI pairing.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <Link
                to="/menu"
                className="px-7 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2 group"
              >
                <span>EXPLORE MENU</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/manual/food"
                className="px-7 py-4 rounded-2xl bg-[#881A2D] hover:bg-[#A32238] text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#881A2D]/30 flex items-center gap-2 group"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
                <span>MANUAL ORDER</span>
              </Link>

              <Link
                to="/reservation"
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F7F4EE] font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>RESERVE TABLE</span>
              </Link>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-6 grid grid-cols-3 gap-6 border-t border-white/5 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">2 ★</p>
                <p className="text-[10px] tracking-wider uppercase text-[#8E8E99]">Michelin Stars</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">100+</p>
                <p className="text-[10px] tracking-wider uppercase text-[#8E8E99]">Haute Dishes</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">3D</p>
                <p className="text-[10px] tracking-wider uppercase text-[#8E8E99]">Floor & Dishes</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Interactive Hero Canvas & Floating Badge */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* React Three Fiber 3D Stage */}
            <Hero3D />

            {/* Floating Circular Interactive Badge */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
              onClick={() => navigate('/manual/food')}
              className="absolute -top-4 right-4 sm:right-10 w-28 h-28 rounded-full border border-dashed border-[#D4AF37]/50 bg-black/60 backdrop-blur-xl p-2 cursor-pointer group hover:scale-110 transition-transform duration-300 hidden sm:flex items-center justify-center shadow-2xl"
              title="Click for Manual Order"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#881A2D]/40 to-transparent flex flex-col items-center justify-center text-center p-2">
                <UtensilsCrossed className="w-5 h-5 text-[#D4AF37] mb-1" />
                <span className="text-[8px] font-bold tracking-widest text-[#F7F4EE] uppercase">
                  MANUAL ORDER
                </span>
                <span className="text-[7px] text-[#D4AF37]">TAP TO EXPLORE</span>
              </div>
            </motion.div>

          </div>

        </div>

      </section>

      {/* 2. MANUAL GOURMET EXPLORER SECTION */}
      <section className="py-16 border-y border-white/5 bg-[#0D0D10] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#16161C] via-[#121215] to-[#0A0A0C] border border-white/10 hover:border-[#D4AF37]/40 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] tracking-widest uppercase bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
                    Curated Dining Catalog • Manual Ordering
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE]">
                  Manual Gourmet Explorer
                </h2>

                <p className="text-xs sm:text-sm text-[#A0A0AA] max-w-2xl leading-relaxed">
                  Explore our handcrafted marketplace course by course. Filter across over 100 authentic recipes by dietary preference (Veg / Non-Veg), heat intensity, preparation time, and live price sorting with full 3D dish inspection.
                </p>

                {/* Category Pill Shortcuts */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { label: 'Veg Starters', cat: 'veg-starters' },
                    { label: 'Tandoor Specials', cat: 'non-veg-starters' },
                    { label: 'Dum Pukht Biryani', cat: 'biryani' },
                    { label: 'Wood-Fired Pizza', cat: 'pizza' },
                    { label: 'Pastry Lab', cat: 'desserts' },
                    { label: 'Beverage Cellar', cat: 'beverages' }
                  ].map(tag => (
                    <Link
                      key={tag.label}
                      to={`/manual/food?category=${tag.cat}`}
                      className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/15 text-xs text-[#D8D8E0] transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column Action */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
                <div className="text-left lg:text-right space-y-1">
                  <span className="text-xs text-[#8E8E99] font-medium tracking-wider uppercase block">
                    Catalog Highlights
                  </span>
                  <p className="font-serif text-2xl font-bold text-gold-gradient">
                    13 Categories • 150+ Dishes
                  </p>
                  <p className="text-[11px] text-[#8E8E99]">
                    Real-time Cart & 3D Interactive View
                  </p>
                </div>

                <Link
                  to="/manual/food"
                  className="px-8 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/20 flex items-center gap-2 group whitespace-nowrap"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>MANUAL FOOD ORDER</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. EDITORIAL STORY SECTION: THE ART OF INDIAN CUISINE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Large Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1000&q=85"
                alt="The Art of Indian Cuisine"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold block">
                  Heritage Signature
                </span>
                <p className="font-serif text-lg text-[#F7F4EE] font-bold">
                  24-Hour Dum Pukht Black Lentil (Grand Cru)
                </p>
              </div>
            </div>
          </div>

          {/* Typography & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
              Culinary Heritage Reimagined
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F4EE] leading-tight">
              THE ART OF ROYAL DUM & TANDOOR.
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0AA] leading-relaxed">
              At Nocturne, we honor centuries of royal Awadhi and Mughlai culinary lineage while elevating each technique through modernist precision. Our gravies simmer for up to 24 hours over fragrant wood coals, extracting subtle floral essences of mace, cardamom, and stone-ground spices.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F7F4EE]">Hand-Ground Whole Aromatics</h4>
                  <p className="text-[11px] text-[#8E8E99]">Stone-ground fresh daily to preserve delicate volatile oils.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F7F4EE]">Clay Tandoors Fired with Mesquite Wood</h4>
                  <p className="text-[11px] text-[#8E8E99]">900°F intense radiant heat imparts an inimitable smoky char.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/menu?category=indian-main-non-veg"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] hover:underline"
              >
                <span>Discover Royal Entrées</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FIRE. FLAVOR. PASSION. — GRILLED & SMOKED STARTERS */}
      <section className="py-20 bg-[#0E0E12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#EF4444] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                From The Clay Tandoor
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE] mt-1">
                FIRE. FLAVOR. PASSION.
              </h2>
            </div>
            <Link
              to="/menu?category=non-veg-starters"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <span>Explore All Starters</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grilledSpecials.map(dish => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. FROM OUR KITCHEN — HORIZONTAL PRODUCT CAROUSEL */}
      <section className="py-24 border-t border-white/5 bg-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
                Chef's Handpicked Tasting Flight
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE] mt-1">
                FROM OUR KITCHEN
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <span>View Full 100+ Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map(dish => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. SWEET ENDINGS — DESSERT SHOWCASE */}
      <section className="py-20 bg-[#0E0E12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
                Molecular Pastry & Heritage Confections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EE] mt-1">
                SWEET ENDINGS
              </h2>
            </div>
            <Link
              to="/menu?category=desserts"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              <span>Explore All Desserts</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {desserts.map(dish => (
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </div>

        </div>
      </section>

      {/* 7. INTERACTIVE TABLE RESERVATION CALLOUT */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#141215] to-[#0A0A0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest uppercase text-[#D4AF37]">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive 3D Dining Floor</span>
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#F7F4EE] max-w-3xl mx-auto">
            Reserve Your Table in Our 3D Dining Room
          </h2>

          <p className="text-xs sm:text-sm text-[#A0A0AA] max-w-xl mx-auto leading-relaxed">
            Select your exact seat in our candlelit Main Atrium, Wine Cellar Tasting Vault, or Chef's Robata Counter. Tables update in real time.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/reservation"
              className="px-8 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore 3D Floor & Reserve</span>
            </Link>
            <Link
              to="/ai/reservation"
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F7F4EE] font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>AI Table Concierge</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

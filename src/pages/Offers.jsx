import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, 
  Sparkles, 
  Percent, 
  Copy, 
  Check, 
  ArrowRight, 
  Gift, 
  Clock, 
  Calendar, 
  ShoppingBag, 
  UtensilsCrossed, 
  ShieldCheck, 
  Flame,
  Award
} from 'lucide-react';
import { formatPrice, AVAILABLE_COUPONS } from '../utils/price';
import { useCart } from '../context/CartContext';
import { useFood } from '../context/FoodContext';

export default function Offers() {
  const navigate = useNavigate();
  const { applyCoupon, addToCart } = useCart();
  const { foods } = useFood();
  const [copiedCode, setCopiedCode] = useState(null);
  const [appliedCode, setAppliedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vouchers' | 'bundles' | 'dine-in'

  // Promotional Vouchers List
  const VOUCHERS = [
    {
      code: 'SAVE20',
      title: '20% OFF Gourmet Dining',
      discount: '20% OFF',
      minOrder: 499,
      type: 'percentage',
      tag: 'MOST POPULAR',
      tagColor: 'bg-[#D4AF37] text-black',
      description: 'Enjoy 20% off across the complete tasting menu on all orders above ₹499.',
      validTill: 'Valid until Sunday midnight',
      terms: 'Applicable on online orders & pickup. One-time per guest.'
    },
    {
      code: 'WELCOME10',
      title: '10% Welcome Connoisseur Privileges',
      discount: '10% OFF',
      minOrder: 0,
      type: 'percentage',
      tag: 'NEW GUEST',
      tagColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
      description: 'Your invitation to luxury dining. 10% off your introductory culinary order with no minimum limit.',
      validTill: 'Valid for your first 3 orders',
      terms: 'Automatically valid on any order value.'
    },
    {
      code: 'CHEF50',
      title: '₹150 Chef’s Tasting Bonus',
      discount: 'FLAT ₹150 OFF',
      minOrder: 999,
      type: 'fixed',
      tag: 'CHEF SPECIAL',
      tagColor: 'bg-[#881A2D] text-white',
      description: 'Flat ₹150 privilege concession on our signature tasting flights and multi-course dining.',
      validTill: 'Valid through this month',
      terms: 'Requires minimum cart value of ₹999.'
    },
    {
      code: 'ROYAL500',
      title: '₹500 Grand Banquet Privilege',
      discount: 'FLAT ₹500 OFF',
      minOrder: 2499,
      type: 'fixed',
      tag: 'FAMILY & EVENTS',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
      description: 'Host unforgettable gatherings. Receive a flat ₹500 deduction on lavish banquets over ₹2,499.',
      validTill: 'Valid all season',
      terms: 'Ideal for group dining and banquet gatherings.'
    },
    {
      code: 'FREEDEL',
      title: 'White-Glove Free Delivery',
      discount: 'FREE DELIVERY',
      minOrder: 299,
      type: 'fixed',
      tag: 'DELIVERY PERK',
      tagColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
      description: 'Zero delivery fee on all gourmet items delivered in temperature-controlled thermal vaults.',
      validTill: 'Daily 11 AM - 11 PM',
      terms: 'Orders above ₹299 arrive with complimentary delivery.'
    }
  ];

  // Special Curated Pairing Bundles
  const BUNDLES = [
    {
      id: 'bundle-royal',
      title: 'The Royal Mughlai Banquet',
      badge: 'CHEF CURATED • SAVE ₹180',
      dishIds: ['imnv-1', 'bir-3', 'des-2'],
      originalPrice: 1270,
      bundlePrice: 1090,
      description: 'Nocturne Butter Chicken + Hyderabadi Dum Biryani + Kashmiri Kesar Rasmalai. An imperial dining flight for two.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      serves: 'Serves 2-3 Connoisseurs'
    },
    {
      id: 'bundle-awadhi-veg',
      title: 'Shahi Awadhi Veg Tasting Platter',
      badge: 'VEG MASTERPIECE • SAVE ₹150',
      dishIds: ['vs-1', 'imv-1', 'des-1'],
      originalPrice: 980,
      bundlePrice: 830,
      description: 'Smoked Charcoal Paneer Tikka + Paneer Butter Masala + Saffron Angoori Gulab Jamun.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
      serves: 'Serves 2 Guests'
    },
    {
      id: 'bundle-italian-flight',
      title: 'Wood-Fired Pizza & Pasta Duet',
      badge: 'WEEKEND SPECIAL • SAVE ₹130',
      dishIds: ['piz-1', 'pas-1', 'bev-13'],
      originalPrice: 940,
      bundlePrice: 810,
      description: 'Artisan Margherita D.O.P. + Truffle Alfredo Pasta + Smoked Botanical Mocktail.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      serves: 'Serves 2 Guests'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyVoucher = (code) => {
    applyCoupon(code);
    setAppliedCode(code);
    setTimeout(() => {
      setAppliedCode(null);
      navigate('/cart');
    }, 1200);
  };

  const handleAddBundleToCart = (bundle) => {
    // Find dishes by ID from foods database or match names
    const bundleItems = bundle.dishIds
      .map(id => foods.find(f => f.id === id))
      .filter(Boolean);

    if (bundleItems.length > 0) {
      bundleItems.forEach(item => {
        addToCart(item, {}, 1);
      });
      navigate('/cart');
    } else {
      // Fallback add first 2 matching dishes
      foods.slice(0, 2).forEach(item => addToCart(item, {}, 1));
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-28 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-r from-[#1E1116] via-[#141217] to-[#0A0A0C] p-8 sm:p-14 mb-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#881A2D]/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#D4AF37]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Privilege Concessions & Gastronomic Vouchers</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-[#F7F4EE] leading-tight">
              EXCLUSIVE OFFERS & DINING PERKS
            </h1>

            <p className="text-xs sm:text-sm text-[#A0A0AA] leading-relaxed">
              Experience the pinnacle of culinary artistry with bespoke discounts, seasonal tasting bundle pairings, and exclusive dining room table concessions.
            </p>

            {/* Quick Benefits Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#F7F4EE]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Instant Voucher Redemption</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Real-time Cart Discount</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Guaranteed Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-10 overflow-x-auto">
          {[
            { id: 'all', label: 'All Privileges' },
            { id: 'vouchers', label: 'Promo Vouchers' },
            { id: 'bundles', label: 'Curated Combos' },
            { id: 'dine-in', label: 'Table Dining Perks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#0A0A0C] font-bold shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/5 text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. PROMO VOUCHERS SECTION */}
        {(activeTab === 'all' || activeTab === 'vouchers') && (
          <section className="mb-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  INSTANT SAVINGS
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  Promotional Dining Vouchers
                </h2>
              </div>
              <span className="text-xs text-[#8E8E99]">
                {VOUCHERS.length} Active Vouchers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VOUCHERS.map((v) => {
                const isCopied = copiedCode === v.code;
                const isApplied = appliedCode === v.code;

                return (
                  <motion.div
                    key={v.code}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-3xl bg-[#121215] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between relative overflow-hidden shadow-xl group"
                  >
                    {/* Top Tag & Discount */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${v.tagColor}`}>
                          {v.tag}
                        </span>
                        <span className="text-[11px] text-[#8E8E99] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          {v.validTill}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="font-cinzel text-2xl font-black text-gold-gradient">
                          {v.discount}
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                          {v.title}
                        </h3>
                        <p className="text-xs text-[#8E8E99] leading-relaxed pt-1">
                          {v.description}
                        </p>
                      </div>

                      {/* Code Box with Perforated Border */}
                      <div className="my-5 p-3 rounded-2xl bg-black/50 border border-dashed border-[#D4AF37]/50 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#8E8E99] block">
                            PROMO CODE
                          </span>
                          <span className="font-mono text-sm font-bold text-[#F7F4EE] tracking-widest">
                            {v.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(v.code)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 transition-colors"
                          title="Copy Code"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#10B981]" />
                              <span className="text-[#10B981]">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action & Terms */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between text-[11px] text-[#8E8E99]">
                        <span>Min Order: <strong className="text-[#F7F4EE]">{v.minOrder > 0 ? formatPrice(v.minOrder) : 'No Minimum'}</strong></span>
                        <span className="text-[10px] italic">{v.terms}</span>
                      </div>

                      <button
                        onClick={() => handleApplyVoucher(v.code)}
                        disabled={isApplied}
                        className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          isApplied
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/20'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>APPLIED TO CART</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-3.5 h-3.5" />
                            <span>APPLY TO CART</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. CURATED PAIRING BUNDLES */}
        {(activeTab === 'all' || activeTab === 'bundles') && (
          <section className="mb-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  CHEF’S PAIRING SELECTION
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  Curated Dining Combos
                </h2>
              </div>
              <span className="text-xs text-[#8E8E99]">
                Bundle & Save Up to 25%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BUNDLES.map(bundle => (
                <motion.div
                  key={bundle.id}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-[#121215] border border-white/10 hover:border-[#D4AF37]/40 transition-all overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={bundle.image}
                      alt={bundle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/40" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#881A2D] text-white shadow-md">
                      {bundle.badge}
                    </span>
                    <span className="absolute bottom-3 left-4 text-xs font-semibold text-[#D4AF37]">
                      {bundle.serves}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
                        {bundle.title}
                      </h3>
                      <p className="text-xs text-[#8E8E99] leading-relaxed">
                        {bundle.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#8E8E99] block">Combo Price</span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif text-2xl font-bold text-gold-gradient">
                              {formatPrice(bundle.bundlePrice)}
                            </span>
                            <span className="text-xs text-[#8E8E99] line-through">
                              {formatPrice(bundle.originalPrice)}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/30">
                          Save {formatPrice(bundle.originalPrice - bundle.bundlePrice)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddBundleToCart(bundle)}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A0A0C] border border-white/10 hover:border-[#D4AF37] text-[#F7F4EE] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add Bundle to Cart</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 3. DINE-IN TABLE RESERVATION PERKS */}
        {(activeTab === 'all' || activeTab === 'dine-in') && (
          <section className="rounded-3xl border border-[#D4AF37]/30 bg-[#121215] p-8 sm:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  DINE-IN CONCIERGE PRIVILEGES
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                  Reserve for 4+ Guests, Receive Complimentary Pastry Flight
                </h2>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  Book an evening dining reservation at any table for parties of 4 or more, and our Executive Pastry Chef will curate a complimentary dessert tasting tier upon course completion.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-[10px] uppercase text-[#8E8E99] block">Applicable Tables</span>
                    <strong className="text-[#F7F4EE]">T07, T08, T09, T10 (Booth & Window)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-[10px] uppercase text-[#8E8E99] block">Perk Value</span>
                    <strong className="text-[#D4AF37]">Complimentary (Worth ₹480)</strong>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/reservation"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#D4AF37]/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>RESERVE TABLE IN 3D</span>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-72 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="Fine dining table ambiance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">
                      Michelin Dining Room
                    </span>
                    <span className="font-serif text-lg text-white font-bold">
                      Interactive 3D Seating & Live Reservations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

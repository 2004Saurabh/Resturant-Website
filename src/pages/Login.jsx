import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  UtensilsCrossed, 
  Bike, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  KeyRound,
  Star,
  Flame,
  Clock,
  Wine,
  ChefHat,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFood } from '../context/FoodContext';
import Login3DStage from '../components/Login3DStage';

export default function Login() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const { foods } = useFood();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Signature Dishes for the Restaurant Showcase Gallery
  const featuredFoods = foods && foods.length > 0 
    ? foods.filter(f => f.bestseller || f.chefSpecial).slice(0, 6)
    : [
        {
          id: 'dish-1',
          name: 'Royal Truffle Butter Chicken',
          price: 650,
          rating: 4.9,
          type: 'non-veg',
          category: 'Main Course',
          cuisine: 'French-Indian Fusion',
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
          preparationTime: '25 mins'
        },
        {
          id: 'dish-2',
          name: 'Saffron Hyderabadi Dum Biryani',
          price: 590,
          rating: 4.9,
          type: 'non-veg',
          category: 'Biryani',
          cuisine: 'Royal Nizami',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
          preparationTime: '30 mins'
        },
        {
          id: 'dish-3',
          name: 'Charcoal Smoked Paneer Tikka',
          price: 370,
          rating: 4.8,
          type: 'veg',
          category: 'Starters',
          cuisine: 'Clay Oven Tandoor',
          image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
          preparationTime: '20 mins'
        },
        {
          id: 'dish-4',
          name: '24K Gold Chocolate Fondant',
          price: 420,
          rating: 5.0,
          type: 'veg',
          category: 'Desserts',
          cuisine: 'Haute Pâtisserie',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
          preparationTime: '15 mins'
        },
        {
          id: 'dish-5',
          name: 'Truffle Porcini Risotto',
          price: 580,
          rating: 4.9,
          type: 'veg',
          category: 'Italian',
          cuisine: 'Northern Italian',
          image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&q=80',
          preparationTime: '22 mins'
        },
        {
          id: 'dish-6',
          name: 'Smoked Kashmiri Rogan Josh',
          price: 680,
          rating: 4.9,
          type: 'non-veg',
          category: 'Curry',
          cuisine: 'Wazwan Heritage',
          image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=800&q=80',
          preparationTime: '35 mins'
        }
      ];

  // 4 Dedicated Restaurant Roles
  const restaurantRoles = [
    {
      role: 'USER',
      label: 'Guest Connoisseur',
      stationTitle: 'Dining & Tasting Room',
      email: 'user@nocturne.com',
      password: 'password123',
      name: 'Alexander Sterling',
      destination: '/menu',
      icon: User,
      color: 'from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/30 hover:border-[#D4AF37]',
      accentColor: '#D4AF37',
      description: 'Browse haute cuisine menu, customize orders, reserve tables & view live GPS delivery.'
    },
    {
      role: 'RESTAURANT_OWNER',
      label: 'Executive Chef & Owner',
      stationTitle: 'Kitchen Display & Pass (Saurabh Kumar)',
      email: 'saurabh@123gmail.com',
      password: 'owner123',
      name: 'Saurabh Kumar',
      destination: '/dashboard/owner',
      icon: ChefHat,
      color: 'from-[#EF4444]/20 to-[#EF4444]/5 text-[#EF4444] border-[#EF4444]/30 hover:border-[#EF4444]',
      accentColor: '#EF4444',
      description: 'Real-time kitchen tickets, menu builder, floor table management & live courier radar.'
    },
    {
      role: 'DELIVERY_PARTNER',
      label: 'Fleet Courier Partner',
      stationTitle: 'Logistics & Dispatch Station',
      email: 'delivery@nocturne.com',
      password: 'fleet123',
      name: 'Vikram Singh',
      destination: '/dashboard/delivery',
      icon: Bike,
      color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30 hover:border-cyan-400',
      accentColor: '#06B6D4',
      description: 'Kitchen pickup orders, customer destination GPS route & turn-by-turn navigation.'
    },
    {
      role: 'ADMIN',
      label: 'General Manager',
      stationTitle: 'Operations & Financial Console',
      email: 'admin@nocturne.com',
      password: 'admin123',
      name: 'Genevieve Du Pont',
      destination: '/dashboard/admin',
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30 hover:border-blue-400',
      accentColor: '#3B82F6',
      description: 'Platform analytics, staff directory, cellar inventory, revenue & multi-fleet oversight.'
    }
  ];

  const handleQuickLogin = (preset) => {
    setIsLoading(true);
    setErrorMessage('');
    setEmail(preset.email);
    setPassword(preset.password);
    setSelectedRole(preset.role);

    setTimeout(() => {
      const res = loginAs(preset.email, preset.role);
      setIsLoading(false);

      if (res.success) {
        window.dispatchEvent(new CustomEvent('nocturne_toast', {
          detail: {
            title: `Welcome, ${preset.name}`,
            message: `Authorized for ${preset.label}. Accessing ${preset.stationTitle}...`,
            type: 'success'
          }
        }));
        navigate(preset.destination);
      } else {
        setErrorMessage(res.message || 'Authentication failed. Please verify credentials.');
      }
    }, 350);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter a valid station email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const matchedPreset = restaurantRoles.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
      const roleToAssign = matchedPreset ? matchedPreset.role : selectedRole;
      
      const res = loginAs(email, roleToAssign);
      setIsLoading(false);

      if (res.success) {
        const dest = res.user?.role === 'RESTAURANT_OWNER'
          ? '/dashboard/owner'
          : res.user?.role === 'DELIVERY_PARTNER'
          ? '/dashboard/delivery'
          : res.user?.role === 'ADMIN'
          ? '/dashboard/admin'
          : '/menu';

        window.dispatchEvent(new CustomEvent('nocturne_toast', {
          detail: {
            title: 'Access Granted',
            message: `Welcome, ${res.user?.name || email}. Entering designated station...`,
            type: 'success'
          }
        }));
        navigate(dest);
      } else {
        setErrorMessage(res.message || 'Unable to authenticate station. Please re-enter credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0A0A0C] text-[#F7F4EE] relative flex flex-col justify-center items-center overflow-hidden">
      
      {/* Restaurant Dining Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#D4AF37]/15 via-[#881A2D]/10 to-transparent rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="w-full max-w-7xl relative z-10 space-y-10">
        
        {/* Restaurant Brand Header & Accreditations */}
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 text-xs uppercase tracking-widest text-[#D4AF37]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
            <span>Michelin Guide 2026 Selection • Private Dining & Staff Portal</span>
          </motion.div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[#F7F4EE]">
            Welcome to <span className="text-gold-gradient">NOCTURNE</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E99] max-w-2xl mx-auto font-light leading-relaxed">
            Please sign in to your restaurant workstation or guest account to proceed. Dedicated access is provided for Executive Chef Saurabh Kumar, Delivery Couriers, Management, and Dining Guests.
          </p>

          {/* Restaurant Credentials Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] text-[#A0A0AB]">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
              3-Star Michelin Gastronomy
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Wine className="w-3 h-3 text-[#EF4444]" />
              Sommelier Cellar Collection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              Service Hours: 18:00 – 02:00
            </span>
          </div>
        </div>

        {/* 1-Tap Restaurant Access Badges (Direct Keycards) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              One-Tap Workstation Badges (Instant Access)
            </p>
            <span className="text-[11px] text-[#8E8E99]">Click any badge to authenticate directly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {restaurantRoles.map((preset) => {
              const Icon = preset.icon;
              return (
                <motion.button
                  key={preset.role}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickLogin(preset)}
                  className={`p-4 rounded-2xl bg-gradient-to-b ${preset.color} border transition-all text-left flex flex-col justify-between shadow-xl shadow-black/50 group relative overflow-hidden`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90">
                        {preset.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-cinzel font-bold text-sm text-[#F7F4EE] group-hover:text-white flex items-center gap-1">
                        {preset.label}
                      </h3>
                      <p className="text-[11px] text-[#D4AF37] font-medium -mt-0.5">
                        {preset.stationTitle}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#8E8E99] line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-white/80 truncate max-w-[140px]">
                      {preset.email}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-white group-hover:translate-x-1 transition-transform">
                      Enter Station <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: 3D Culinary Stage (Left) & Restaurant Portal Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: 3D Haute Cuisine Cloche Presentation */}
          <div className="lg:col-span-6 flex flex-col">
            <Login3DStage onSelectDish={() => {}} />
          </div>

          {/* RIGHT: Restaurant Workstation Login Terminal */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#121216]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative backdrop-blur-xl">
            
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Station Authentication
                </span>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F7F4EE] mt-1">
                  Access Dining Terminal
                </h2>
                <p className="text-xs text-[#8E8E99] mt-1">
                  Sign in with registered credentials to open your designated dashboard.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* 1. Station Role Selector Tabs */}
                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-[#8E8E99] mb-2">
                    1. Select Workstation Designation
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {restaurantRoles.map((r) => {
                      const isSelected = selectedRole === r.role;
                      return (
                        <button
                          type="button"
                          key={r.role}
                          onClick={() => {
                            setSelectedRole(r.role);
                            setEmail(r.email);
                            setPassword(r.password);
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            isSelected
                              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                              : 'bg-white/5 border-white/10 text-[#8E8E99] hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <p className="truncate font-semibold">{r.label.split(' ')[0]}</p>
                          <p className="text-[10px] opacity-70 truncate">{r.role.replace('_', ' ')}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Workstation Email */}
                <div>
                  <label className="block text-[11px] uppercase font-semibold tracking-wider text-[#8E8E99] mb-1.5">
                    2. Workstation Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E99]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. saurabh@123gmail.com or user@nocturne.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-[#F7F4EE] placeholder:text-[#8E8E99]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* 3. Passcode */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] uppercase font-semibold tracking-wider text-[#8E8E99]">
                      3. Security Passcode
                    </label>
                    <span className="text-[10px] text-[#D4AF37]/80">Demo: preset credentials ready</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E99]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security passcode"
                      className="w-full pl-10 pr-10 py-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-[#F7F4EE] placeholder:text-[#8E8E99]/50 focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E8E99] hover:text-[#F7F4EE]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Sign In CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A0A0C] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-xl shadow-[#D4AF37]/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Workstation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Quick Guest Dining Bypass */}
            <div className="pt-6 border-t border-white/5 mt-6 text-center space-y-2">
              <p className="text-xs text-[#8E8E99]">
                Want to browse the tasting menu without signing in?{' '}
                <button
                  type="button"
                  onClick={() => {
                    loginAs('user@nocturne.com', 'USER');
                    navigate('/menu');
                  }}
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  Explore as Guest Connoisseur →
                </button>
              </p>
            </div>

          </div>

        </div>

        {/* SECTION: Chef's Signature Tasting Gallery ("food dikhna chahiye") */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                Chef's Signature Tasting Selection (Featured Culinary Offerings)
              </p>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F7F4EE]">
                Tonight's Michelin Highlights
              </h3>
            </div>
            <span className="text-xs text-[#8E8E99]">
              Sign in to order any of these authentic preparations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {featuredFoods.map((dish) => (
              <motion.div
                key={dish.id}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl bg-[#141418] border border-white/5 hover:border-[#D4AF37]/40 p-2.5 flex flex-col justify-between group transition-all shadow-lg"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      dish.type === 'veg' 
                        ? 'border-emerald-500 bg-emerald-950/80' 
                        : 'border-red-500 bg-red-950/80'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        dish.type === 'veg' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                    </span>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{dish.rating || 4.8}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[#F7F4EE] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    {dish.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#D4AF37]">
                      ₹{dish.price}
                    </span>
                    <span className="text-[10px] text-[#8E8E99]">
                      {dish.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    loginAs('user@nocturne.com', 'USER');
                    navigate(`/food/${dish.id}`);
                  }}
                  className="mt-2 w-full py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-[10px] font-semibold text-white/80 transition-colors text-center border border-white/5"
                >
                  Order This Dish →
                </button>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

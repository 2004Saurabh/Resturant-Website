import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  UtensilsCrossed, 
  Compass, 
  Calendar,
  Tag,
  Check,
  Bike,
  LogIn
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFood } from '../context/FoodContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { totalItemCount } = useCart();
  const { favorites } = useFood();
  const { currentUser, role, switchRole, logout, isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setRoleDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Order', path: '/manual/food' },
    { name: 'Reserve', path: '/reservation' },
    { name: 'Offers', path: '/offers', badge: 'SAVE20' },
  ];

  const roleLabels = {
    USER: { label: 'Guest Connoisseur', icon: User, badgeColor: 'border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10', dashboard: '/dashboard/user' },
    RESTAURANT_OWNER: { label: 'Executive Chef / Kitchen', icon: UtensilsCrossed, badgeColor: 'border-[#EF4444]/30 text-[#EF4444] bg-[#EF4444]/10', dashboard: '/dashboard/owner' },
    DELIVERY_PARTNER: { label: 'Fleet Delivery Partner', icon: Bike, badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10', dashboard: '/dashboard/delivery' },
    ADMIN: { label: 'Platform Super Admin', icon: ShieldCheck, badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10', dashboard: '/dashboard/admin' },
  };

  const currentRoleConfig = roleLabels[role] || roleLabels.USER;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/60'
            : 'bg-gradient-to-b from-[#0A0A0C]/80 via-[#0A0A0C]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-[#D4AF37]">
              <span className="font-serif text-lg font-bold text-gold-gradient">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl tracking-[0.25em] font-semibold text-[#F7F4EE] group-hover:text-[#D4AF37] transition-colors">
                NOCTURNE
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#8E8E99] uppercase -mt-1">
                Haute Cuisine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-xs xl:text-sm font-medium tracking-wider uppercase transition-colors rounded-full ${
                    isActive
                      ? 'text-[#F7F4EE]'
                      : 'text-[#8E8E99] hover:text-[#F7F4EE]'
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className="w-3 h-3 text-[#D4AF37] inline mr-1.5 animate-pulse" />
                  )}
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#881A2D]/40 text-[#EF4444] border border-[#881A2D]/50">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-full bg-white/5 border border-white/10 -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-full text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-all"
              title="Search menu (Cmd + K)"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dedicated Cart Link with Icon & Live Counter */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all text-xs font-semibold uppercase tracking-wider ${
                location.pathname === '/cart'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                  : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/50 text-[#F7F4EE] hover:bg-white/10'
              }`}
              title="View Cart & Checkout"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0A0A0C] text-[10px] font-bold">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38728] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 hover:scale-105 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            ) : (
              /* Role Switcher & Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all text-xs ${currentRoleConfig.badgeColor}`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-[#1A1A20] flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="hidden md:inline font-medium tracking-wide">
                    {role === 'USER' ? 'Guest' : role === 'RESTAURANT_OWNER' ? 'Owner' : role === 'DELIVERY_PARTNER' ? 'Rider' : 'Admin'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141418] border border-white/10 shadow-2xl shadow-black/90 p-3 z-50 backdrop-blur-2xl"
                  >
                    {/* User Info Header */}
                    <div className="p-2 border-b border-white/5 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/30"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#F7F4EE] truncate">{currentUser?.name}</p>
                          <p className="text-[10px] text-[#8E8E99] truncate">{currentUser?.email}</p>
                        </div>
                      </div>
                      <Link
                        to={currentRoleConfig.dashboard}
                        onClick={() => setRoleDropdownOpen(false)}
                        className="mt-2.5 w-full block text-center py-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25 text-xs font-medium transition-colors"
                      >
                        Enter {role === 'USER' ? 'User' : role === 'RESTAURANT_OWNER' ? 'Owner' : 'Admin'} Dashboard →
                      </Link>
                    </div>

                    {/* Role Switcher Section */}
                    <div className="px-2 py-1">
                      <p className="text-[10px] tracking-wider text-[#8E8E99] uppercase font-semibold mb-2">
                        Simulate Role (Demo Switcher)
                      </p>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            switchRole('USER');
                            setRoleDropdownOpen(false);
                            navigate('/dashboard/user');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            role === 'USER' ? 'bg-white/10 text-white font-medium' : 'text-[#8E8E99] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <div>
                              <p>Customer Experience</p>
                              <p className="text-[10px] opacity-60">user@nocturne.com</p>
                            </div>
                          </div>
                          {role === 'USER' && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </button>

                        <button
                          onClick={() => {
                            switchRole('RESTAURANT_OWNER');
                            setRoleDropdownOpen(false);
                            navigate('/dashboard/owner');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            role === 'RESTAURANT_OWNER' ? 'bg-white/10 text-white font-medium' : 'text-[#8E8E99] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-[#EF4444]" />
                            <div>
                              <p>Kitchen Operations (Saurabh Kumar)</p>
                              <p className="text-[10px] opacity-60">saurabh@123gmail.com</p>
                            </div>
                          </div>
                          {role === 'RESTAURANT_OWNER' && <Check className="w-4 h-4 text-[#EF4444]" />}
                        </button>

                        <button
                          onClick={() => {
                            switchRole('DELIVERY_PARTNER');
                            setRoleDropdownOpen(false);
                            navigate('/dashboard/delivery');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            role === 'DELIVERY_PARTNER' ? 'bg-white/10 text-white font-medium' : 'text-[#8E8E99] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Bike className="w-3.5 h-3.5 text-cyan-400" />
                            <div>
                              <p>Delivery Fleet Partner</p>
                              <p className="text-[10px] opacity-60">delivery@nocturne.com (Vikram Singh)</p>
                            </div>
                          </div>
                          {role === 'DELIVERY_PARTNER' && <Check className="w-4 h-4 text-cyan-400" />}
                        </button>

                        <button
                          onClick={() => {
                            switchRole('ADMIN');
                            setRoleDropdownOpen(false);
                            navigate('/dashboard/admin');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            role === 'ADMIN' ? 'bg-white/10 text-white font-medium' : 'text-[#8E8E99] hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            <div>
                              <p>Super Admin</p>
                              <p className="text-[10px] opacity-60">admin@nocturne.com</p>
                            </div>
                          </div>
                          {role === 'ADMIN' && <Check className="w-4 h-4 text-blue-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Direct link to Login Page */}
                    <div className="px-2 pt-2 border-t border-white/5 mt-1">
                      <Link
                        to="/login"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-all"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Go to Login Page</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/5 mt-2 pt-2 flex items-center justify-between px-2 text-xs">
                      <Link
                        to="/profile"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="text-[#8E8E99] hover:text-white transition-colors"
                      >
                        Account Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="text-[#EF4444] hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#0A0A0C]/98 border-b border-white/10 backdrop-blur-2xl p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium tracking-wider uppercase text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                    {link.name}
                  </span>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#881A2D]/40 text-[#EF4444] border border-[#881A2D]/50">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Mobile Cart Link with Icon */}
              <Link
                to="/cart"
                className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold tracking-wider uppercase text-[#F7F4EE] bg-[#D4AF37]/10 border border-[#D4AF37]/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Cart</span>
                </span>
                {totalItemCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-bold">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/25 to-[#D4AF37]/10 hover:from-[#D4AF37]/35 hover:to-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-center text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Multi-Role Portal
                </Link>
                <Link
                  to="/dashboard/user"
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-center text-xs uppercase tracking-wider font-semibold text-[#F7F4EE] border border-white/10"
                >
                  Customer Dashboard
                </Link>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/dashboard/owner"
                    className="py-2.5 rounded-xl bg-[#881A2D]/20 text-[#EF4444] border border-[#881A2D]/40 text-center text-[11px] font-medium"
                  >
                    Owner
                  </Link>
                  <Link
                    to="/dashboard/delivery"
                    className="py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-center text-[11px] font-medium"
                  >
                    Delivery
                  </Link>
                  <Link
                    to="/dashboard/admin"
                    className="py-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 text-center text-[11px] font-medium"
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

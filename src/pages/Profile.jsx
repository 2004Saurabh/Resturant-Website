import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  UtensilsCrossed, 
  Award, 
  Save, 
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useReservation } from '../context/ReservationContext';
import { formatPrice } from '../utils/price';

export default function Profile() {
  const { currentUser, role, switchRole, updateProfile } = useAuth();
  const { orders } = useOrder();
  const { reservations } = useReservation();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alexander Sterling',
    email: currentUser?.email || 'user@nocturne.com',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    address: currentUser?.address || '742 Evergreen Terrace, Penthouse B',
    dietaryPreference: currentUser?.dietaryPreference || 'None'
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Profile Updated',
        message: 'Your connoisseur preferences have been saved.',
        type: 'success'
      }
    }));
  };

  const userOrders = orders.filter(o => o.customer?.email === currentUser?.email);
  const totalSpent = userOrders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-[#121215] border border-white/5">
          <div className="flex items-center gap-5">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {currentUser?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                  {role}
                </span>
              </div>
              <p className="text-xs text-[#8E8E99] mt-0.5">{currentUser?.email}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-[#A0A0AA]">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{currentUser?.membership || 'Black Diamond Connoisseur'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-6 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 text-center">
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Total Spent</span>
              <span className="font-serif text-lg font-bold text-gold-gradient">
                {formatPrice(totalSpent || 428.50)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Orders</span>
              <span className="font-serif text-lg font-bold text-[#F7F4EE]">
                {userOrders.length || 4}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#8E8E99] block">Bookings</span>
              <span className="font-serif text-lg font-bold text-[#F7F4EE]">
                {reservations.length || 2}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Role Simulation Switcher Card */}
        <div className="p-6 rounded-3xl bg-[#16161D] border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-serif text-base font-bold text-[#F7F4EE]">
              Role Simulator (Frontend Demo Accounts)
            </h3>
          </div>
          <p className="text-xs text-[#8E8E99]">
            Instantly switch perspective to test customer ordering, restaurant owner kitchen pipeline, or super admin controls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => switchRole('USER')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                role === 'USER' ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]' : 'border-white/10 bg-white/5 text-[#8E8E99] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">1. Guest User</span>
                {role === 'USER' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </div>
              <span className="text-[10px] block opacity-70">user@nocturne.com</span>
            </button>

            <button
              onClick={() => switchRole('RESTAURANT_OWNER')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                role === 'RESTAURANT_OWNER' ? 'border-[#EF4444] bg-[#EF4444]/15 text-[#F7F4EE]' : 'border-white/10 bg-white/5 text-[#8E8E99] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">2. Owner (Saurabh Kumar)</span>
                {role === 'RESTAURANT_OWNER' && <Check className="w-3.5 h-3.5 text-[#EF4444]" />}
              </div>
              <span className="text-[10px] block opacity-70">saurabh@123gmail.com</span>
            </button>

            <button
              onClick={() => switchRole('DELIVERY_PARTNER')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                role === 'DELIVERY_PARTNER' ? 'border-cyan-500 bg-cyan-500/15 text-[#F7F4EE]' : 'border-white/10 bg-white/5 text-[#8E8E99] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">3. Fleet (Vikram Singh)</span>
                {role === 'DELIVERY_PARTNER' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <span className="text-[10px] block opacity-70">delivery@nocturne.com</span>
            </button>

            <button
              onClick={() => switchRole('ADMIN')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                role === 'ADMIN' ? 'border-blue-400 bg-blue-500/15 text-[#F7F4EE]' : 'border-white/10 bg-white/5 text-[#8E8E99] hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">4. Super Admin</span>
                {role === 'ADMIN' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <span className="text-[10px] block opacity-70">admin@nocturne.com</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
            Guest Particulars
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#8E8E99]">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8E8E99]">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8E8E99]">Phone Contact</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#8E8E99]">Dietary Lean</label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="None" className="bg-[#141418]">No Dietary Restrictions</option>
                <option value="Vegetarian" className="bg-[#141418]">Pure Vegetarian</option>
                <option value="Spicy Lover" className="bg-[#141418]">High Heat / Spicy Preference</option>
                <option value="Pescatarian" className="bg-[#141418]">Pescatarian</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs text-[#8E8E99]">Primary Residence Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

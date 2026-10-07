import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  User, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useReservation } from '../context/ReservationContext';
import { useFood } from '../context/FoodContext';
import { formatPrice } from '../utils/price';
import FoodCard from '../components/FoodCard';

export default function UserDashboard() {
  const location = useLocation();
  const { currentUser, role } = useAuth();
  const { orders } = useOrder();
  const { reservations } = useReservation();
  const { foods, favorites } = useFood();

  const isOverview = location.pathname === '/dashboard/user';

  const userOrders = orders.filter(
    o => !o.customer?.email || o.customer?.email.toLowerCase() === currentUser?.email?.toLowerCase()
  );
  const totalSpent = userOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const activeOrders = userOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const favDishes = foods.filter(f => favorites.includes(f.id)).slice(0, 4);

  const tabs = [
    { name: 'Overview', path: '/dashboard/user', icon: LayoutDashboard },
    { name: 'My Orders', path: '/dashboard/user/orders', icon: ShoppingBag, badge: activeOrders.length },
    { name: 'Reservations', path: '/dashboard/user/reservations', icon: Calendar, badge: reservations.length },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#181418] via-[#121215] to-[#14141A] border border-white/5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
              alt=""
              className="w-20 h-20 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
                Customer Gastronomy Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                Welcome Back, {currentUser?.name}
              </h1>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                {currentUser?.membership || 'Black Diamond Member'} • {userOrders.length} Completed Tastings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <span>Explore Tasting Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.path === '/dashboard/user'}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white/10 text-[#F7F4EE] border border-white/15'
                    : 'text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span>{tab.name}</span>
                {tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#881A2D] text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Overview Tab Content */}
        {isOverview ? (
          <div className="space-y-8">
            
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Spent</span>
                <p className="font-serif text-2xl font-bold text-gold-gradient">
                  {formatPrice(totalSpent)}
                </p>
                <span className="text-[10px] text-[#10B981] block pt-1">Across all orders</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Orders</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {userOrders.length}
                </p>
                <span className="text-[10px] text-[#8E8E99] block pt-1">Lifetime tastings</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Active Orders</span>
                <p className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {activeOrders.length}
                </p>
                <span className="text-[10px] text-[#D4AF37] block pt-1">Live in kitchen</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Table Bookings</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {reservations.length}
                </p>
                <span className="text-[10px] text-[#10B981] block pt-1">Confirmed seats</span>
              </div>
            </div>

            {/* Active Orders Highlight */}
            {activeOrders.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#181418] border border-[#881A2D]/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                    <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Active Live Orders</h3>
                  </div>
                  <Link to="/dashboard/user/orders" className="text-xs text-[#D4AF37] hover:underline">
                    View Live Tracking →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOrders.map(order => (
                    <div key={order.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-[#D4AF37] font-bold">#{order.id}</span>
                        <p className="text-xs text-[#F7F4EE] font-semibold">{order.items?.length} items • {formatPrice(order.total)}</p>
                        <p className="text-[11px] text-[#8E8E99]">ETA: {order.estimatedTime}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Dishes Showcase */}
            {favDishes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
                    Your Favorite Courses
                  </h3>
                  <Link to="/favorites" className="text-xs text-[#D4AF37] hover:underline">
                    View All ({favorites.length}) →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {favDishes.map(dish => (
                    <FoodCard key={dish.id} dish={dish} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <Outlet />
        )}

      </div>
    </div>
  );
}

import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  BookOpen, 
  Table, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Users,
  Flame,
  CheckCircle2,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useFood } from '../context/FoodContext';
import { useReservation } from '../context/ReservationContext';
import { formatPrice } from '../utils/price';

export default function OwnerDashboard() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { orders } = useOrder();
  const { foods } = useFood();
  const { reservations, tables } = useReservation();

  const isOverview = location.pathname === '/dashboard/owner';

  const todayRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;

  const tabs = [
    { name: 'Overview', path: '/dashboard/owner', icon: UtensilsCrossed },
    { name: 'Live Orders', path: '/dashboard/owner/orders', icon: ShoppingBag, badge: activeOrders.length },
    { name: 'Fleet Map', path: '/dashboard/owner/delivery', icon: Bike, badge: activeOrders.filter(o => o.orderType === 'delivery').length },
    { name: 'Menu CRUD', path: '/dashboard/owner/menu', icon: BookOpen, badge: foods.length },
    { name: 'Table Floor', path: '/dashboard/owner/tables', icon: Table },
    { name: 'Analytics', path: '/dashboard/owner/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Owner Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#200B10] via-[#141215] to-[#121215] border border-[#881A2D]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#881A2D]/30 border border-[#881A2D]/50 flex items-center justify-center text-[#D4AF37]">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#EF4444]">
                Executive Kitchen & Floor Portal
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                NOCTURNE Kitchen Command
              </h1>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Owner: {currentUser?.name || 'Saurabh Kumar'} • {currentUser?.email || 'saurabh@123gmail.com'} • NOCTURNE Flagship & Kitchen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              Kitchen Live (900°F)
            </span>
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
                end={tab.path === '/dashboard/owner'}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#881A2D]/30 text-[#EF4444] border border-[#881A2D]/50'
                    : 'text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4444]' : ''}`} />
                <span>{tab.name}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">
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
            
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Today's Gross Sales</span>
                <p className="font-serif text-2xl font-bold text-gold-gradient">
                  {formatPrice(todayRevenue)}
                </p>
                <span className="text-[10px] text-[#10B981] block pt-1">{orders.length} tickets recorded</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Kitchen Active Orders</span>
                <p className="font-serif text-2xl font-bold text-[#D4AF37]">
                  {activeOrders.length}
                </p>
                <span className="text-[10px] text-[#EF4444] block pt-1">Require preparation</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Dining Room Capacity</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {availableTables} / 12 Available
                </p>
                <span className="text-[10px] text-[#10B981] block pt-1">{12 - availableTables} occupied/reserved</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Table Reservations</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">
                  {reservations.length}
                </p>
                <span className="text-[10px] text-[#8E8E99] block pt-1">Evening covers</span>
              </div>
            </div>

            {/* Quick Live Orders Widget */}
            <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Incoming Kitchen Tickets</h3>
                  <p className="text-xs text-[#8E8E99]">Live pipeline synchronized with customer dashboards.</p>
                </div>
                <Link to="/dashboard/owner/orders" className="text-xs text-[#D4AF37] hover:underline font-semibold">
                  Manage Pipeline →
                </Link>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#D4AF37]">#{order.id}</span>
                        <span className="font-semibold text-xs text-[#F7F4EE]">{order.customer?.name}</span>
                        <span className="text-[11px] text-[#8E8E99]">({order.items?.length} items)</span>
                      </div>
                      <p className="text-[11px] text-[#8E8E99] mt-0.5">
                        {order.orderType === 'dine-in' ? `Dine-In • Table ${order.table || 'T01'}` : order.orderType} • {formatPrice(order.total)}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#F7F4EE]">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/dashboard/owner/menu"
                className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 transition-all block group"
              >
                <BookOpen className="w-6 h-6 text-[#D4AF37] mb-2 group-hover:scale-105 transition-transform" />
                <h4 className="font-serif text-base font-bold text-[#F7F4EE]">Manage 100+ Menu Items</h4>
                <p className="text-xs text-[#8E8E99] mt-1">Adjust pricing, create daily specials, edit ingredients.</p>
              </Link>

              <Link
                to="/dashboard/owner/tables"
                className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 transition-all block group"
              >
                <Table className="w-6 h-6 text-[#EF4444] mb-2 group-hover:scale-105 transition-transform" />
                <h4 className="font-serif text-base font-bold text-[#F7F4EE]">Seating & Floor Layout</h4>
                <p className="text-xs text-[#8E8E99] mt-1">Toggle tables T01 to T12 occupied or reserved.</p>
              </Link>

              <Link
                to="/dashboard/owner/analytics"
                className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/40 transition-all block group"
              >
                <BarChart3 className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-105 transition-transform" />
                <h4 className="font-serif text-base font-bold text-[#F7F4EE]">Financial Analytics</h4>
                <p className="text-xs text-[#8E8E99] mt-1">View revenue velocity and high-margin course mix.</p>
              </Link>
            </div>

          </div>
        ) : (
          <Outlet />
        )}

      </div>
    </div>
  );
}

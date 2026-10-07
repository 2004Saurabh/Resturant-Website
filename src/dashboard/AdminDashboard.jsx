import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  ShoppingBag, 
  Calendar, 
  BarChart3, 
  Sparkles,
  TrendingUp,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useReservation } from '../context/ReservationContext';
import { RESTAURANTS } from '../data/restaurants';
import { formatPrice } from '../utils/price';

export default function AdminDashboard() {
  const location = useLocation();
  const { allUsers, currentUser } = useAuth();
  const { orders } = useOrder();
  const { reservations } = useReservation();

  const isOverview = location.pathname === '/dashboard/admin';

  const totalGMV = orders.reduce((acc, o) => acc + (o.total || 0), 0) + 128400; // base + current orders

  const tabs = [
    { name: 'Overview', path: '/dashboard/admin', icon: ShieldCheck },
    { name: 'Users Directory', path: '/dashboard/admin/users', icon: Users, badge: allUsers.length },
    { name: 'Platform Orders', path: '/dashboard/admin/orders', icon: ShoppingBag, badge: orders.length },
    { name: 'Fleet Logistics Map', path: '/dashboard/admin/delivery', icon: Bike, badge: orders.filter(o => o.orderType === 'delivery').length },
    { name: 'Reservations', path: '/dashboard/admin/reservations', icon: Calendar, badge: reservations.length },
    { name: 'Financials', path: '/dashboard/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0E1624] via-[#121418] to-[#121215] border border-blue-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-400">
                Super Admin Master Operations
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                Global Gastronomy Platform
              </h1>
              <p className="text-xs text-[#8E8E99] mt-0.5">
                Genevieve Du Pont • Global Operations Director
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            All Systems Operational • 99.98% SLA
          </span>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.path === '/dashboard/admin'}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
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
            
            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Platform GMV</span>
                <p className="font-serif text-2xl font-bold text-blue-400">{formatPrice(totalGMV)}</p>
                <span className="text-[10px] text-[#10B981] block pt-1">+24.8% Monthly Growth</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Active Members</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">{allUsers.length}</p>
                <span className="text-[10px] text-[#10B981] block pt-1">Simulated accounts</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Orders</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">{orders.length}</p>
                <span className="text-[10px] text-[#10B981] block pt-1">Live synchronized</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Reservations</span>
                <p className="font-serif text-2xl font-bold text-[#F7F4EE]">{reservations.length}</p>
                <span className="text-[10px] text-[#8E8E99] block pt-1">Confirmed tables</span>
              </div>
            </div>

            {/* Platform Quick Audit Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Orders Overview */}
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Recent Platform Tickets</h3>
                  <Link to="/dashboard/admin/orders" className="text-xs text-blue-400 hover:underline">
                    View All →
                  </Link>
                </div>
                <div className="space-y-2.5">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="p-3 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-[#D4AF37] font-bold">#{o.id}</span>
                        <p className="text-[#F7F4EE] font-semibold">{o.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-gold-gradient block">{formatPrice(o.total)}</span>
                        <span className="text-[10px] text-[#10B981] uppercase font-bold">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Members Overview */}
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Member Directory Snapshot</h3>
                  <Link to="/dashboard/admin/users" className="text-xs text-blue-400 hover:underline">
                    Manage Directory →
                  </Link>
                </div>
                <div className="space-y-2.5">
                  {allUsers.slice(0, 4).map(u => (
                    <div key={u.id} className="p-3 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-[#F7F4EE]">{u.name}</p>
                          <p className="text-[10px] text-[#8E8E99]">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 uppercase font-bold text-[#D8D8E0]">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <Outlet />
        )}

      </div>
    </div>
  );
}

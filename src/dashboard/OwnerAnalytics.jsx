import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatPrice } from '../utils/price';

const SALES_DATA = [
  { day: 'Mon', revenue: 2420, orders: 42 },
  { day: 'Tue', revenue: 3100, orders: 54 },
  { day: 'Wed', revenue: 2890, orders: 48 },
  { day: 'Thu', revenue: 4200, orders: 68 },
  { day: 'Fri', revenue: 6800, orders: 94 },
  { day: 'Sat', revenue: 8400, orders: 124 },
  { day: 'Sun', revenue: 7600, orders: 110 },
];

const TOP_DISHES = [
  { name: 'Butter Chicken', sales: 480 },
  { name: 'Chicken Biryani', sales: 420 },
  { name: 'Dal Makhani', sales: 390 },
  { name: 'Margherita D.O.P.', sales: 340 },
  { name: 'Rasmalai Flambé', sales: 310 },
  { name: 'Paneer Tikka', sales: 290 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Indian Main', value: 38, color: '#D4AF37' },
  { name: 'Biryani Pots', value: 24, color: '#881A2D' },
  { name: 'Tandoor Starters', value: 18, color: '#E8C766' },
  { name: 'Artisan Pizza', value: 12, color: '#10B981' },
  { name: 'Pastry Lab', value: 8, color: '#6366F1' },
];

export default function OwnerAnalytics() {
  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
          Restaurant Financial & Operational Analytics
        </h2>
        <p className="text-xs text-[#8E8E99]">
          Weekly revenue velocities, high-margin course distributions, and dining room traffic patterns.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Weekly Gross Revenue</span>
          <p className="font-serif text-3xl font-bold text-gold-gradient">₹3,54,100</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">+14.2% from previous week</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Total Weekly Covers</span>
          <p className="font-serif text-3xl font-bold text-[#F7F4EE]">540 Orders</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">Avg Ticket: ₹655</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Table Seat Occupancy</span>
          <p className="font-serif text-3xl font-bold text-[#D4AF37]">88.4%</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">Peak during weekend dinner</span>
        </div>
      </div>

      {/* Main Revenue Velocity Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
            7-Day Revenue Velocity (₹)
          </h3>
          <span className="text-xs text-[#D4AF37] font-semibold">Weekly View</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_DATA}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#23232A" />
              <XAxis dataKey="day" stroke="#8E8E99" fontSize={11} />
              <YAxis stroke="#8E8E99" fontSize={11} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [`₹${val}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#goldGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom 2 Charts: Top Dishes & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Dishes Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
            Top Culinary Courses by Volume
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_DISHES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#23232A" />
                <XAxis type="number" stroke="#8E8E99" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#8E8E99" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [`${val} orders`, 'Volume']}
                />
                <Bar dataKey="sales" fill="#881A2D" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
            Category Mix Distribution (%)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[10px]">
            {CATEGORY_DISTRIBUTION.map((c, i) => (
              <span key={i} className="flex items-center gap-1 text-[#8E8E99]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name} ({c.value}%)</span>
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

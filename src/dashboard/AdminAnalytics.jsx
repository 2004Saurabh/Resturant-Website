import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const PLATFORM_MONTHLY = [
  { month: 'May', revenue: 98000, orders: 1420, users: 480 },
  { month: 'Jun', revenue: 114000, orders: 1680, users: 610 },
  { month: 'Jul', revenue: 132000, orders: 1950, users: 790 },
  { month: 'Aug', revenue: 148000, orders: 2180, users: 950 },
  { month: 'Sep', revenue: 172000, orders: 2540, users: 1240 },
  { month: 'Oct', revenue: 195000, orders: 2890, users: 1580 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
          Global Platform Financial Intelligence
        </h2>
        <p className="text-xs text-[#8E8E99]">
          Platform GMV, active dining club memberships, and multi-location revenue curves.
        </p>
      </div>

      {/* Top 4 Platform KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Platform Annual GMV</span>
          <p className="font-serif text-3xl font-bold text-blue-400">₹1.84 Cr</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">+28.5% YoY Growth</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Registered Connoisseurs</span>
          <p className="font-serif text-3xl font-bold text-[#F7F4EE]">1,580</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">+340 this month</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">Global Outlets</span>
          <p className="font-serif text-3xl font-bold text-[#D4AF37]">3 Michelin Units</p>
          <span className="text-[10px] text-[#D4AF37] font-semibold block pt-1">Mayfair, Manhattan, Skybar</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#8E8E99]">AI Order Conversions</span>
          <p className="font-serif text-3xl font-bold text-[#10B981]">64.2%</p>
          <span className="text-[10px] text-[#10B981] font-semibold block pt-1">High flight satisfaction</span>
        </div>
      </div>

      {/* GMV Growth Curve */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
            Monthly Platform GMV & Revenue Velocity (₹)
          </h3>
          <span className="text-xs text-blue-400 font-semibold">6-Month Trend</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PLATFORM_MONTHLY}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#23232A" />
              <XAxis dataKey="month" stroke="#8E8E99" fontSize={11} />
              <YAxis stroke="#8E8E99" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Gross Platform Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#blueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders & User Onboarding Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Monthly Course Orders Volume</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23232A" />
                <XAxis dataKey="month" stroke="#8E8E99" fontSize={11} />
                <YAxis stroke="#8E8E99" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [`${val} orders`, 'Volume']}
                />
                <Bar dataKey="orders" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">Connoisseur Club Growth</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PLATFORM_MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23232A" />
                <XAxis dataKey="month" stroke="#8E8E99" fontSize={11} />
                <YAxis stroke="#8E8E99" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141418', borderColor: '#33333E', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val) => [`${val} members`, 'Club Tier']}
                />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

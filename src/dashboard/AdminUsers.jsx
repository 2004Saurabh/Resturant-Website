import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, User, Check, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/price';

export default function AdminUsers() {
  const { allUsers, toggleUserStatus } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filtered = allUsers.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Platform Connoisseur Directory
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Manage member accounts, permissions, membership tiers, and access statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-blue-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#141418]">All Roles</option>
            <option value="USER" className="bg-[#141418]">Users</option>
            <option value="RESTAURANT_OWNER" className="bg-[#141418]">Owners</option>
            <option value="ADMIN" className="bg-[#141418]">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#8E8E99] bg-white/5">
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Membership Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#F7F4EE]">{user.name}</p>
                        <p className="text-[11px] text-[#8E8E99]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'ADMIN'
                        ? 'bg-blue-500/20 text-blue-400'
                        : user.role === 'RESTAURANT_OWNER'
                        ? 'bg-[#EF4444]/20 text-[#EF4444]'
                        : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#8E8E99]">{user.phone}</td>
                  <td className="p-4 text-[#D8D8E0]">{user.membership || user.title || 'Standard Member'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      user.active !== false ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.active !== false ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                      <span>{user.active !== false ? 'Active' : 'Suspended'}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        user.active !== false
                          ? 'bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444]'
                          : 'bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981]'
                      }`}
                    >
                      {user.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

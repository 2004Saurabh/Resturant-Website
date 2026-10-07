import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Receipt, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/price';

export default function AdminOrders() {
  const { orders } = useOrder();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer?.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            Platform-Wide Gastronomy Orders
          </h2>
          <p className="text-xs text-[#8E8E99]">
            Comprehensive ledger of all customer transactions, ticket sizes, and fulfillment channels.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Order # or Guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] focus:outline-none focus:border-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#141418]">All Statuses</option>
            <option value="NEW" className="bg-[#141418]">New</option>
            <option value="ACCEPTED" className="bg-[#141418]">Accepted</option>
            <option value="PREPARING" className="bg-[#141418]">Preparing</option>
            <option value="READY" className="bg-[#141418]">Ready</option>
            <option value="COMPLETED" className="bg-[#141418]">Completed</option>
            <option value="CANCELLED" className="bg-[#141418]">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#121215] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#8E8E99] bg-white/5">
                <th className="p-4">Order Ref</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Courses</th>
                <th className="p-4">Total</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#D4AF37]">#{order.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-[#F7F4EE]">{order.customer?.name}</p>
                    <p className="text-[11px] text-[#8E8E99]">{order.customer?.email}</p>
                  </td>
                  <td className="p-4 text-[#8E8E99]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-[#D8D8E0]">{order.items?.length || 0} items</td>
                  <td className="p-4 font-serif font-bold text-sm text-gold-gradient">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 uppercase text-[#8E8E99] font-medium">
                    {order.orderType === 'dine-in' ? `Table ${order.table || 'T01'}` : order.orderType}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#F7F4EE]">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.orderType === 'delivery' && (
                        <Link
                          to="/dashboard/admin/delivery"
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 inline-flex items-center"
                          title="Inspect on Logistics Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        to={`/invoice?id=${order.id}`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8E8E99] hover:text-[#D4AF37] inline-flex items-center"
                        title="View Invoice"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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

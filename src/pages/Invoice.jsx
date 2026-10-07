import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/price';
import { generateInvoiceNumber, printInvoice, downloadInvoiceData } from '../utils/invoice';

export default function Invoice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, lastOrder } = useOrder();

  const orderId = searchParams.get('id');
  const order = (orderId ? orders.find(o => o.id === orderId) : null) || lastOrder || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen pt-36 text-center text-[#F7F4EE]">
        <h2 className="text-xl font-bold">No Invoice Found</h2>
        <Link to="/menu" className="text-xs text-[#D4AF37] hover:underline mt-2 inline-block">
          Explore Menu
        </Link>
      </div>
    );
  }

  const invoiceNumber = generateInvoiceNumber(order.id);
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8E8E99] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={printInvoice}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => downloadInvoiceData(order)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7F4EE] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Card */}
        <div className="invoice-card bg-[#121215] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center">
                  <span className="font-serif text-lg font-bold text-gold-gradient">N</span>
                </div>
                <span className="font-cinzel text-2xl font-bold tracking-[0.25em] text-[#F7F4EE]">
                  NOCTURNE
                </span>
              </div>
              <p className="text-xs text-[#8E8E99]">Haute Gastronomy & Contemporary Cellar</p>
              <p className="text-[11px] text-[#6E6E78]">42 Royal Crescent Avenue, Mayfair, London</p>
              <p className="text-[11px] text-[#6E6E78]">VAT ID: GB 928 3491 00 • 2 Michelin Stars</p>
            </div>

            <div className="sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold uppercase tracking-wider mb-2">
                PAID IN FULL
              </div>
              <p className="text-xs font-mono font-bold text-[#D4AF37]">{invoiceNumber}</p>
              <p className="text-xs text-[#8E8E99]">Order Ref: #{order.id}</p>
              <p className="text-xs text-[#8E8E99]">{formattedDate}</p>
            </div>
          </div>

          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] block">
                Billed To (Guest Profile)
              </span>
              <p className="font-bold text-sm text-[#F7F4EE]">{order.customer?.name}</p>
              <p className="text-[#8E8E99]">{order.customer?.email}</p>
              <p className="text-[#8E8E99]">{order.customer?.phone}</p>
              {order.customer?.address && (
                <p className="text-[#8E8E99] pt-1">{order.customer?.address}</p>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4AF37] block">
                Fulfillment & Payment
              </span>
              <p className="font-bold text-sm text-[#F7F4EE] uppercase">
                {order.orderType === 'dine-in' ? `Dine-In • Table ${order.table || 'T01'}` : order.orderType}
              </p>
              <p className="text-[#8E8E99]">Payment: {order.paymentMethod || 'Credit Card'}</p>
              <p className="text-[#10B981]">Status: Confirmed & Dispatched</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-[#8E8E99]">
                  <th className="py-3 font-semibold">Course Description</th>
                  <th className="py-3 font-semibold text-center">Qty</th>
                  <th className="py-3 font-semibold text-right">Unit Price</th>
                  <th className="py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3.5 pr-4">
                      <span className="font-semibold text-[#F7F4EE] block">{item.dish?.name}</span>
                      <span className="text-[10px] text-[#8E8E99]">{item.dish?.category}</span>
                    </td>
                    <td className="py-3.5 text-center text-[#F7F4EE] font-medium">{item.quantity}</td>
                    <td className="py-3.5 text-right text-[#8E8E99]">{formatPrice(item.unitPrice)}</td>
                    <td className="py-3.5 text-right font-serif font-bold text-[#F7F4EE]">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-2 max-w-sm text-xs text-[#8E8E99]">
              <p className="italic">
                "Where Food Meets Experience." All prices inclusive of applicable regional value-added tax and culinary service charges.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#8E8E99]">
                <span>Courses Subtotal:</span>
                <span className="text-[#F7F4EE]">{formatPrice(order.subtotal || order.total * 0.9)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#10B981]">
                  <span>Promotional Discount:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8E8E99]">
                <span>Tax (GST 5%):</span>
                <span className="text-[#F7F4EE]">{formatPrice(order.tax || order.total * 0.05)}</span>
              </div>
              <div className="flex justify-between text-[#8E8E99]">
                <span>Delivery:</span>
                <span className="text-[#F7F4EE]">
                  {order.deliveryFee === 0 ? 'Complimentary' : formatPrice(order.deliveryFee || 0)}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between font-serif text-lg font-bold text-[#F7F4EE]">
                <span>Total Paid:</span>
                <span className="text-gold-gradient">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer certification */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6E6E78] gap-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certified Authenticated Nocturne Gastronomy Receipt</span>
            </div>
            <span>Printed via Nocturne Hospitality Engine</span>
          </div>

        </div>

      </div>
    </div>
  );
}

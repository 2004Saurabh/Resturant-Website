import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, QrCode, Banknote, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { formatPrice } from '../utils/price';

export default function Payment() {
  const navigate = useNavigate();
  const { cart, grandTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const [method, setMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  const handlePay = () => {
    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        customer: { name: 'Alexander Sterling', email: 'user@nocturne.com', phone: '+1 (555) 234-5678' },
        items: cart,
        subtotal: grandTotal * 0.9,
        discount: 0,
        tax: grandTotal * 0.1,
        total: grandTotal,
        paymentMethod: method === 'card' ? 'Online Card' : 'UPI Payment',
        orderType: 'delivery',
      });
      clearCart();
      setSubmitting(false);
      navigate('/order-success', { state: { order } });
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0A0A0C]">
      <div className="max-w-xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-[#121215] border border-white/10 shadow-2xl text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            Secure Payment Gateway
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
            Complete Your Payment
          </h1>
          <p className="text-xs text-[#8E8E99]">
            Total Outstanding: <span className="font-serif text-lg font-bold text-gold-gradient">{formatPrice(grandTotal || 75.00)}</span>
          </p>

          <div className="grid grid-cols-2 gap-3 text-left">
            <button
              onClick={() => setMethod('card')}
              className={`p-4 rounded-2xl border transition-all ${
                method === 'card' ? 'border-[#D4AF37] bg-[#D4AF37]/15' : 'border-white/5 bg-white/5'
              }`}
            >
              <CreditCard className="w-5 h-5 text-[#D4AF37] mb-2" />
              <span className="text-xs font-semibold text-[#F7F4EE] block">Credit / Debit</span>
            </button>
            <button
              onClick={() => setMethod('upi')}
              className={`p-4 rounded-2xl border transition-all ${
                method === 'upi' ? 'border-[#D4AF37] bg-[#D4AF37]/15' : 'border-white/5 bg-white/5'
              }`}
            >
              <QrCode className="w-5 h-5 text-[#D4AF37] mb-2" />
              <span className="text-xs font-semibold text-[#F7F4EE] block">Instant UPI QR</span>
            </button>
          </div>

          <button
            onClick={handlePay}
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-2"
          >
            {submitting ? 'Confirming with Vault...' : `Authorize Payment • ${formatPrice(grandTotal || 750.00)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

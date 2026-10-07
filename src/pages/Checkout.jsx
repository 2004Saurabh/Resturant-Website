import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Utensils, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Store, 
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';
import { formatPrice } from '../utils/price';

export default function Checkout() {
  const navigate = useNavigate();
  const { 
    cart, 
    subtotal, 
    discountAmount, 
    tax, 
    deliveryFee, 
    grandTotal, 
    orderType, 
    setOrderType, 
    selectedTable, 
    setSelectedTable,
    clearCart,
    appliedCoupon
  } = useCart();
  
  const { createOrder } = useOrder();
  const { currentUser } = useAuth();
  const { tables } = useReservation();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Customer Info
  const [customer, setCustomer] = useState({
    name: currentUser?.name || 'Alexander Sterling',
    phone: currentUser?.phone || '+1 (555) 234-5678',
    email: currentUser?.email || 'user@nocturne.com',
    address: currentUser?.address || '742 Evergreen Terrace, Penthouse B',
    deliveryNotes: 'Please ring bell 4B upon arrival.'
  });

  // Step 3: Payment Selection & Info
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'upi' | 'card' | 'cash' | 'restaurant'
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'ALEXANDER STERLING',
    expiry: '12/28',
    cvv: '888'
  });
  const [upiId, setUpiId] = useState('alexander@okhdfc');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-36 pb-20 bg-[#0A0A0C] text-center px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#121215] border border-white/5 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">No Active Courses</h2>
          <p className="text-xs text-[#8E8E99]">Please add courses to your cart before proceeding to checkout.</p>
          <Link
            to="/menu"
            className="inline-block px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      let finalPaymentLabel = 'Online Card Payment';
      if (paymentMethod === 'card') finalPaymentLabel = `Card (ending in ${cardData.number.slice(-4)})`;
      if (paymentMethod === 'upi') finalPaymentLabel = `UPI (${upiId})`;
      if (paymentMethod === 'cash') finalPaymentLabel = 'Cash on Delivery';
      if (paymentMethod === 'restaurant') finalPaymentLabel = 'Pay at Table';

      const orderPayload = {
        customer,
        items: cart,
        subtotal,
        discount: discountAmount,
        tax,
        deliveryFee,
        total: grandTotal,
        paymentMethod: finalPaymentLabel,
        orderType,
        table: orderType === 'dine-in' ? selectedTable : null,
      };

      const placedOrder = createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);
      navigate('/order-success', { state: { order: placedOrder } });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#0A0A0C]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
            NOCTURNE GASTRONOMY
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F7F4EE]">
            RESERVATION & CHECKOUT
          </h1>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto pb-2">
          {[
            { num: 1, label: 'Customer' },
            { num: 2, label: 'Fulfillment' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review & Confirm' }
          ].map(s => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => currentStep > s.num && setCurrentStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  currentStep === s.num
                    ? 'bg-[#D4AF37] text-[#0A0A0C] shadow-lg shadow-[#D4AF37]/20'
                    : currentStep > s.num
                    ? 'bg-white/10 text-white cursor-pointer'
                    : 'bg-white/5 text-[#8E8E99] cursor-not-allowed'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                  {currentStep > s.num ? <Check className="w-3 h-3 text-[#10B981]" /> : s.num}
                </span>
                <span>{s.label}</span>
              </button>
              {s.num < 4 && <div className="w-4 sm:w-8 h-[1px] bg-white/10 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Checkout Form Box (8 cols) */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#121215] border border-white/5 shadow-2xl">
              
              {/* STEP 1: Customer Information */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                      1. Guest Information
                    </h3>
                    <p className="text-xs text-[#8E8E99] mt-1">
                      We will dispatch delivery updates and receipts to this profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#8E8E99]">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#8E8E99]">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs text-[#8E8E99]">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <span>Continue to Fulfillment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Delivery / Pickup / Dine-In */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                      2. Dining Experience & Fulfillment
                    </h3>
                    <p className="text-xs text-[#8E8E99] mt-1">
                      Choose between doorstep white-glove delivery, rapid takeaway pickup, or luxury dine-in table service.
                    </p>
                  </div>

                  {/* 3 Order Type Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'delivery', title: 'Doorstep Delivery', desc: 'Arrives in heated culinary boxes', fee: '₹49.00 (Free > ₹499)' },
                      { id: 'pickup', title: 'Kitchen Pickup', desc: 'Ready in 20 mins from Mayfair', fee: 'Complimentary' },
                      { id: 'dine-in', title: 'Dine-In Table', desc: 'Served directly to your chosen table', fee: 'Complimentary' },
                    ].map(type => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setOrderType(type.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          orderType === type.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-white/5 bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold text-[#F7F4EE] block">{type.title}</span>
                        <span className="text-[11px] text-[#8E8E99] block mt-1">{type.desc}</span>
                        <span className="text-[10px] text-[#D4AF37] font-semibold block mt-2">{type.fee}</span>
                      </button>
                    ))}
                  </div>

                  {/* Delivery Address fields */}
                  {orderType === 'delivery' && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="space-y-1.5">
                        <label className="text-xs text-[#8E8E99]">Delivery Address</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-[#8E8E99] absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                            placeholder="Street address, penthouse/apartment, floor"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-[#8E8E99]">Courier Notes</label>
                        <input
                          type="text"
                          value={customer.deliveryNotes}
                          onChange={(e) => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                          placeholder="Gate code, concierge instructions..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dine-In Table Selector */}
                  {orderType === 'dine-in' && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                          Select Your Dining Table (T01 - T12)
                        </label>
                        <span className="text-[11px] text-[#8E8E99]">
                          Selected Table: <strong className="text-[#F7F4EE]">{selectedTable}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                        {tables.map(table => {
                          const isOccupied = table.status === 'OCCUPIED';
                          const isCurrent = selectedTable === table.id;

                          return (
                            <button
                              key={table.id}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setSelectedTable(table.id)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isCurrent
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] font-bold'
                                  : isOccupied
                                  ? 'border-white/5 bg-white/5 text-[#555560] cursor-not-allowed opacity-50'
                                  : 'border-white/10 bg-white/5 text-[#F7F4EE] hover:border-[#D4AF37]/50'
                              }`}
                            >
                              <span className="text-sm font-bold block">{table.id}</span>
                              <span className="text-[10px] text-[#8E8E99] block mt-0.5">{table.seats} Seats</span>
                              <span className="text-[9px] uppercase tracking-wider block mt-1 text-[#8E8E99]">
                                {table.section?.split(' ')[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment UI */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                      3. Select Payment Method
                    </h3>
                    <p className="text-xs text-[#8E8E99] mt-1">
                      Frontend simulated checkout. No real financial transaction will occur.
                    </p>
                  </div>

                  {/* 4 Payment Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'upi', name: 'Instant UPI / QR', icon: QrCode },
                      { id: 'cash', name: 'Cash on Arrival', icon: Banknote },
                      { id: 'restaurant', name: 'Pay at Table', icon: Store }
                    ].map(p => {
                      const Icon = p.icon;
                      const isSel = paymentMethod === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentMethod(p.id)}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSel
                              ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                              : 'border-white/5 bg-white/5 text-[#8E8E99] hover:border-white/10'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-2 ${isSel ? 'text-[#D4AF37]' : 'text-[#8E8E99]'}`} />
                          <span className="text-xs font-semibold block">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-[#8E8E99]">Card Number</label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37] tracking-widest font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-[#8E8E99]">Expiry Date</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-[#8E8E99]">CVV / CVC</label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI QR Mock */}
                  {paymentMethod === 'upi' && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-black" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-sm font-semibold text-[#F7F4EE]">Scan with any UPI App</h4>
                        <p className="text-xs text-[#8E8E99]">Google Pay, PhonePe, Paytm or Apple Pay.</p>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@bank"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cash Notice */}
                  {paymentMethod === 'cash' && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                      <Banknote className="w-8 h-8 text-[#D4AF37] mx-auto" />
                      <h4 className="text-sm font-semibold text-[#F7F4EE]">Pay When Your Order Arrives</h4>
                      <p className="text-xs text-[#8E8E99] max-w-sm mx-auto">
                        Please keep exact cash or hand your credit card to our white-glove culinary courier.
                      </p>
                    </div>
                  )}

                  {/* Pay at Table Notice */}
                  {paymentMethod === 'restaurant' && (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                      <Store className="w-8 h-8 text-[#D4AF37] mx-auto" />
                      <h4 className="text-sm font-semibold text-[#F7F4EE]">Pay at the Restaurant Table</h4>
                      <p className="text-xs text-[#8E8E99] max-w-sm mx-auto">
                        Settle your bill directly with your table sommelier after completing your dining experience.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <span>Review Final Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Complete Review & Place Order */}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
                      4. Review Your Nocturne Order
                    </h3>
                    <p className="text-xs text-[#8E8E99] mt-1">
                      Verify course list, guest particulars, and dining terms before placing.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#8E8E99]">Guest Name:</span>
                      <span className="text-[#F7F4EE] font-semibold">{customer.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#8E8E99]">Contact:</span>
                      <span className="text-[#F7F4EE]">{customer.phone} • {customer.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-[#8E8E99]">Fulfillment:</span>
                      <span className="text-[#D4AF37] uppercase font-bold">
                        {orderType === 'dine-in' ? `Dine-In (Table ${selectedTable})` : orderType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8E99]">Payment Method:</span>
                      <span className="text-[#F7F4EE] uppercase font-semibold">{paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-[#8E8E99] hover:text-white"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handlePlaceOrder}
                      className="px-10 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/30 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Dispatching to Kitchen...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Place Order • {formatPrice(grandTotal)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-[#121215] border border-white/10 shadow-2xl sticky top-28 space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">
                Courses Recap ({cart.length})
              </h4>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-bold text-[#D4AF37]">{item.quantity}x</span>
                      <span className="truncate text-[#F7F4EE]">{item.dish.name}</span>
                    </div>
                    <span className="font-semibold text-gold-gradient flex-shrink-0">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#8E8E99]">
                  <span>Subtotal</span>
                  <span className="text-[#F7F4EE]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#10B981]">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8E8E99]">
                  <span>Tax & Service</span>
                  <span className="text-[#F7F4EE]">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-[#8E8E99]">
                  <span>Fulfillment</span>
                  <span className="text-[#F7F4EE]">
                    {deliveryFee === 0 ? 'Complimentary' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-serif text-base font-bold text-[#F7F4EE]">
                  <span>Grand Total</span>
                  <span className="text-gold-gradient">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

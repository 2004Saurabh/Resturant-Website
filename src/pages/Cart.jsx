import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Bookmark, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  UtensilsCrossed
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/price';
import MapLocationPicker from '../components/MapLocationPicker';

export default function Cart() {
  const {
    cart,
    totalItemCount,
    subtotal,
    discountAmount,
    tax,
    deliveryFee,
    grandTotal,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    savedForLater,
    moveToCartFromSaved,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    couponError,
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable,
    clearCart
  } = useCart();

  const { createOrder } = useOrder();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cash' | 'restaurant'
  const [isProcessing, setIsProcessing] = useState(false);

  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [deliveryLoc, setDeliveryLoc] = useState(null);

  // Customer Information
  const [customer, setCustomer] = useState({
    name: currentUser?.name || 'Alexander Sterling',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'user@nocturne.com',
    address: currentUser?.address || '742 Evergreen Terrace, Penthouse B, Central Delhi',
    deliveryNotes: 'Please ring bell upon arrival.'
  });

  // Card details mock
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'ALEXANDER STERLING',
    expiry: '12/28',
    cvv: '888'
  });

  // UPI ID mock
  const [upiId, setUpiId] = useState('alexander@okhdfc');

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCouponCode(couponInput);
  };

  const handlePlaceOrderDirect = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      let finalPaymentLabel = 'Instant UPI (QR)';
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
        deliveryLocation: deliveryLoc || null
      };

      const placedOrder = createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);
      navigate('/order-success', { state: { order: placedOrder } });
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-28 bg-[#0A0A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">
              NOCTURNE GASTRONOMY
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span className="text-xs text-[#8E8E99] font-medium uppercase tracking-wider">
              Live Banquet Tray
            </span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F7F4EE] mt-1">
            SHOPPING CART & PAYMENT
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1">
            {totalItemCount} {totalItemCount === 1 ? 'course' : 'courses'} reserved in your active banquet tray
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#121215] border border-white/5 p-8 max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              Your Table is Empty
            </h2>
            <p className="text-xs text-[#8E8E99] mt-2 max-w-md mx-auto leading-relaxed">
              Your table is waiting for something delicious. Explore our tasting menu or customize your selection through manual food ordering.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                to="/menu"
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                EXPLORE MENU
              </Link>
              <Link
                to="/manual/food"
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F7F4EE] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                MANUAL ORDER
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (7 cols): Items List + Fulfillment + Payment Options */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. CART ITEMS LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    Selected Courses ({totalItemCount})
                  </h3>
                  <Link to="/manual/food" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                    <span>+ Add More Dishes</span>
                  </Link>
                </div>

                {cart.map((item, index) => {
                  const dish = item.dish;
                  const itemTotal = item.unitPrice * item.quantity;
                  const hasCustoms = item.customizations && Object.values(item.customizations).some(Boolean);

                  return (
                    <motion.div
                      key={`${dish.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-[#121215] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold block">
                            {dish.category}
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#F7F4EE] truncate">
                            {dish.name}
                          </h4>
                          <p className="text-xs text-[#8E8E99]">
                            {formatPrice(item.unitPrice)} each
                          </p>

                          {hasCustoms && (
                            <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-[#A0A0AA]">
                              {item.customizations.extraCheese && <span className="text-[#D4AF37]">+Extra Cheese</span>}
                              {item.customizations.extraSauce && <span className="text-[#D4AF37]">+Extra Sauce</span>}
                              {item.customizations.addDrink && <span className="text-[#D4AF37]">+Pairing Drink</span>}
                              {item.customizations.addDessert && <span className="text-[#D4AF37]">+Chef Dessert</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            className="p-1 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-[#F7F4EE]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="p-1 rounded-lg text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif text-sm sm:text-base font-bold text-[#F7F4EE] min-w-[70px] text-right">
                          {formatPrice(itemTotal)}
                        </span>

                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-[#8E8E99] hover:text-[#EF4444] transition-colors"
                          title="Remove dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 2. DINING FULFILLMENT SELECTOR */}
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    Dining Fulfillment
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'delivery', title: 'Doorstep Delivery', fee: 'Free > ₹499' },
                    { id: 'pickup', title: 'Kitchen Pickup', fee: 'Complimentary' },
                    { id: 'dine-in', title: 'Dine-In Table', fee: 'Complimentary' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOrderType(t.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        orderType === t.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                          : 'border-white/5 bg-white/5 text-[#8E8E99] hover:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.title}</span>
                      <span className="text-[10px] text-[#D4AF37] block mt-0.5">{t.fee}</span>
                    </button>
                  ))}
                </div>

                {/* Table Picker if Dine-In */}
                {orderType === 'dine-in' && (
                  <div className="pt-2">
                    <label className="text-xs text-[#8E8E99] block mb-1">Select Your Table Number:</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:border-[#D4AF37] outline-none"
                    >
                      {['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'].map(tbl => (
                        <option key={tbl} value={tbl} className="bg-[#141418]">{tbl} (Dining Floor)</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* 3. GUEST PARTICULARS */}
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    Guest Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[#8E8E99] block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#8E8E99] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[#F7F4EE] outline-none focus:border-[#D4AF37]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#8E8E99] block mb-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#8E8E99] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[#F7F4EE] outline-none focus:border-[#D4AF37]"
                        required
                      />
                    </div>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[#8E8E99] text-xs">Delivery Address</label>
                        <button
                          type="button"
                          onClick={() => setMapPickerOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Pinpoint on Live Map {deliveryLoc?.area ? `(${deliveryLoc.area})` : ''}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-[#8E8E99] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={customer.address}
                          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[#F7F4EE] outline-none focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                      {deliveryLoc && (
                        <div className="flex items-center justify-between text-[11px] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[#A0A0AA]">
                          <span>Sector: <strong className="text-white">{deliveryLoc.area}</strong></span>
                          <span>Distance: <strong className="text-[#10B981]">{deliveryLoc.distanceKm} km</strong> from NOCTURNE Kitchen</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. PAYMENT METHOD SELECTION */}
              <div className="p-6 rounded-3xl bg-[#121215] border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'upi', name: 'Instant UPI / QR', icon: QrCode },
                    { id: 'card', name: 'Credit / Debit', icon: CreditCard },
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
                        className={`p-3.5 rounded-2xl border text-center transition-all ${
                          isSel
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F7F4EE]'
                            : 'border-white/5 bg-white/5 text-[#8E8E99] hover:border-white/10'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1.5 ${isSel ? 'text-[#D4AF37]' : 'text-[#8E8E99]'}`} />
                        <span className="text-xs font-semibold block">{p.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Payment Details Preview */}
                <div className="pt-2">
                  {paymentMethod === 'upi' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-4 text-xs">
                      <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-12 h-12 text-black" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[#F7F4EE] font-semibold block">Scan & Pay via any UPI App</span>
                        <p className="text-[11px] text-[#8E8E99]">GPay, PhonePe, Paytm or UPI ID: <strong>nocturne@icici</strong></p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-[#8E8E99]">
                        <span>Card Payment Simulated</span>
                        <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F7F4EE] font-mono tracking-widest outline-none"
                      />
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[#8E8E99]">
                      <p>💵 Pay exact cash or card upon delivery. No advance payment required.</p>
                    </div>
                  )}

                  {paymentMethod === 'restaurant' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[#8E8E99]">
                      <p>🍽️ Pay directly at your dining table after finishing your meal courses.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Order Summary & Direct Place Order Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-white/10 shadow-2xl sticky top-28 space-y-6">
                
                <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
                  Order & Price Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#8E8E99] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="SAVE20 / WELCOME10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#F7F4EE] uppercase focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] text-xs font-bold uppercase transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/30">
                      <span>{appliedCoupon.coupon.code} active (-{formatPrice(discountAmount)})</span>
                      <button type="button" onClick={removeCoupon} className="text-[#8E8E99] hover:text-[#EF4444]">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-xs text-[#EF4444]">{couponError}</p>
                  )}

                  {/* Available Offers Quick-Apply Chips */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-[#8E8E99]">
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#D4AF37]" /> Available Privileges:</span>
                      <Link to="/offers" className="text-[#D4AF37] hover:underline font-semibold">View All Offers →</Link>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['SAVE20', 'WELCOME10', 'CHEF50', 'ROYAL500'].map(code => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCouponInput(code);
                            applyCouponCode(code);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                            appliedCoupon?.coupon?.code === code
                              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981] font-bold'
                              : 'bg-white/5 border-white/10 text-[#D4AF37] hover:bg-white/10'
                          }`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Pricing Breakdown */}
                <div className="space-y-2.5 text-xs pt-4 border-t border-white/5">
                  <div className="flex justify-between text-[#8E8E99]">
                    <span>Courses Subtotal</span>
                    <span className="text-[#F7F4EE] font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#10B981]">
                      <span>Promotion Savings</span>
                      <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#8E8E99]">
                    <span>Tax (GST 5%)</span>
                    <span className="text-[#F7F4EE] font-medium">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between text-[#8E8E99]">
                    <span>Fulfillment / Delivery</span>
                    <span className="text-[#F7F4EE] font-medium">
                      {deliveryFee === 0 ? <span className="text-[#10B981]">Complimentary</span> : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-serif text-lg font-bold text-[#F7F4EE]">
                    <span>Total Amount</span>
                    <span className="text-2xl text-gold-gradient">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* PRIMARY ACTION: DIRECT PLACE ORDER & PAY */}
                <button
                  onClick={handlePlaceOrderDirect}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#E8C766] disabled:opacity-50 text-[#0A0A0C] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Payment & Order...</span>
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>PLACE ORDER & PAY • {formatPrice(grandTotal)}</span>
                    </>
                  )}
                </button>

                {/* Secondary: Advanced Checkout link */}
                <div className="pt-2 text-center border-t border-white/5">
                  <Link
                    to="/checkout"
                    className="text-xs text-[#8E8E99] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Prefer multi-step concierge checkout? Click here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E8E99]">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Encrypted Michelin Hospitality Checkout</span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Interactive Map Location Picker Modal */}
        <MapLocationPicker
          isOpen={mapPickerOpen}
          onClose={() => setMapPickerOpen(false)}
          currentAddress={customer.address}
          onSelectLocation={(hub) => {
            setCustomer(prev => ({ ...prev, address: hub.address }));
            setDeliveryLoc(hub);
          }}
        />

      </div>
    </div>
  );
}

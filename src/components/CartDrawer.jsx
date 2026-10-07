import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  Tag, 
  Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/price';

export default function CartDrawer() {
  const {
    cart,
    totalItemCount,
    subtotal,
    discountAmount,
    tax,
    deliveryFee,
    grandTotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    saveForLaterItem,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon) return;
    applyCouponCode(inputCoupon);
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#121215] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                      Dining Selection
                    </h3>
                    <p className="text-xs text-[#8E8E99]">
                      {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 rounded-full text-[#8E8E99] hover:text-[#F7F4EE] hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-4">
                      <ShoppingBag className="w-8 h-8 opacity-70" />
                    </div>
                    <h4 className="font-serif text-xl text-[#F7F4EE]">
                      Your Table is Waiting
                    </h4>
                    <p className="text-xs text-[#8E8E99] max-w-xs mt-1 leading-relaxed">
                      Your table is waiting for something delicious. Explore our tasting menu or order with AI.
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/menu');
                      }}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] font-semibold text-xs uppercase tracking-wider transition-colors"
                    >
                      EXPLORE MENU
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => {
                    const dish = item.dish;
                    const itemTotal = item.unitPrice * item.quantity;
                    const hasCustoms = item.customizations && Object.values(item.customizations).some(Boolean);

                    return (
                      <div
                        key={`${dish.id}-${index}`}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex gap-3.5"
                      >
                        {/* Food Image */}
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-[#F7F4EE] truncate">
                              {dish.name}
                            </h4>
                            <span className="text-xs font-bold text-gold-gradient flex-shrink-0">
                              {formatPrice(itemTotal)}
                            </span>
                          </div>

                          {/* Customizations tags */}
                          {hasCustoms && (
                            <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-[#A0A0AA]">
                              {item.customizations.spiceAdjustment && item.customizations.spiceAdjustment !== 'Standard' && (
                                <span className="text-[#EF4444]">{item.customizations.spiceAdjustment}</span>
                              )}
                              {item.customizations.extraCheese && <span>• +Cheese</span>}
                              {item.customizations.extraSauce && <span>• +Sauce</span>}
                              {item.customizations.noOnion && <span>• No Onion</span>}
                              {item.customizations.noGarlic && <span>• No Garlic</span>}
                              {item.customizations.addDrink && <span>• +Drink</span>}
                              {item.customizations.addDessert && <span>• +Dessert</span>}
                            </div>
                          )}

                          {/* Controls Row */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                            
                            {/* Quantity Buttons */}
                            <div className="flex items-center gap-2 bg-black/40 rounded-lg p-0.5 border border-white/10">
                              <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="p-1 rounded text-[#8E8E99] hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold px-1 text-[#F7F4EE]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="p-1 rounded text-[#8E8E99] hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Secondary Actions */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => saveForLaterItem(index)}
                                className="p-1.5 text-[#8E8E99] hover:text-[#D4AF37] transition-colors"
                                title="Save for later"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeFromCart(index)}
                                className="p-1.5 text-[#8E8E99] hover:text-[#EF4444] transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer with Pricing Summary & Checkout */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-[#0E0E11] space-y-4">
                  
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8E8E99]" />
                      <input
                        type="text"
                        placeholder="WELCOME10, FOOD20, CHEF50"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-[#F7F4EE] placeholder-[#6E6E78] uppercase focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#F7F4EE] font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Active Coupon notification */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">
                      <span>{appliedCoupon.coupon.code} applied (-{formatPrice(discountAmount)})</span>
                      <button onClick={removeCoupon} className="text-[#8E8E99] hover:text-[#EF4444]">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-[#EF4444]">{couponError}</p>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#8E8E99]">
                      <span>Subtotal</span>
                      <span className="text-[#F7F4EE]">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#10B981]">
                        <span>Promotion Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#8E8E99]">
                      <span>Tax & Hospitality Surcharge</span>
                      <span className="text-[#F7F4EE]">{formatPrice(tax)}</span>
                    </div>

                    <div className="flex justify-between text-[#8E8E99]">
                      <span>Delivery Fee</span>
                      <span className="text-[#F7F4EE]">
                        {deliveryFee === 0 ? <span className="text-[#10B981]">Complimentary</span> : formatPrice(deliveryFee)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between font-serif text-base font-bold text-[#F7F4EE]">
                      <span>Grand Total</span>
                      <span className="text-gold-gradient">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="py-3 rounded-xl border border-white/10 text-center text-xs font-semibold uppercase tracking-wider text-[#F7F4EE] hover:bg-white/5 transition-colors"
                    >
                      View Cart
                    </Link>
                    <button
                      onClick={handleCheckoutClick}
                      className="py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C766] text-[#0A0A0C] text-center text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#D4AF37]/30"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

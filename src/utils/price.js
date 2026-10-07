// Currency and price formatting
export const formatPrice = (amount, currency = '₹') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `${currency}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const calculateTax = (subtotal, taxRate = 0.05) => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

export const calculateDeliveryFee = (orderType, subtotal) => {
  if (orderType === 'dine-in' || orderType === 'pickup') return 0;
  if (subtotal > 499) return 0; // Free delivery over ₹499
  return 49.00;
};

export const AVAILABLE_COUPONS = {
  SAVE20: { code: 'SAVE20', discountType: 'percentage', value: 20, minSubtotal: 499, description: '20% off gourmet dining over ₹499' },
  WELCOME10: { code: 'WELCOME10', discountType: 'percentage', value: 10, minSubtotal: 0, description: '10% off your introductory order' },
  FOOD20: { code: 'FOOD20', discountType: 'percentage', value: 20, minSubtotal: 499, description: '20% off orders over ₹499' },
  CHEF50: { code: 'CHEF50', discountType: 'fixed', value: 150, minSubtotal: 999, description: '₹150 off Michelin tasting over ₹999' },
  ROYAL500: { code: 'ROYAL500', discountType: 'fixed', value: 500, minSubtotal: 2499, description: 'Flat ₹500 off luxury banquet over ₹2,499' },
  FREEDEL: { code: 'FREEDEL', discountType: 'fixed', value: 49, minSubtotal: 299, description: 'Complimentary delivery waiver on orders over ₹299' },
};

export const validateCoupon = (code, subtotal) => {
  const upper = (code || '').trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[upper];
  if (!coupon) {
    return { valid: false, message: 'Invalid promotional code' };
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { valid: false, message: `Requires a minimum subtotal of ₹${coupon.minSubtotal}` };
  }
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100 * 100) / 100;
  } else {
    discountAmount = Math.min(coupon.value, subtotal);
  }
  return { valid: true, coupon, discountAmount, message: `${coupon.description} applied!` };
};

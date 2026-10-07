import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { calculateTax, calculateDeliveryFee, validateCoupon } from '../utils/price';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return getStorageItem(STORAGE_KEYS.CART, []);
  });

  const [savedForLater, setSavedForLater] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup' | 'dine-in'
  const [selectedTable, setSelectedTable] = useState('T01');

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  // Add Item with optional customizations
  const addToCart = (dish, customizations = {}, quantity = 1) => {
    const customKey = JSON.stringify(customizations || {});
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.dish.id === dish.id && JSON.stringify(item.customizations || {}) === customKey
      );

      // Compute extra unit price from customizations (in Rupees)
      let extraPrice = 0;
      if (customizations.extraCheese) extraPrice += 40;
      if (customizations.extraSauce) extraPrice += 30;
      if (customizations.addDrink) extraPrice += 90;
      if (customizations.addDessert) extraPrice += 120;

      const unitPrice = (dish.price || 0) + extraPrice;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            dish,
            customizations,
            unitPrice,
            quantity
          }
        ];
      }
    });

    // Dispatch global toast notification event
    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Added to Dining Cart',
        message: `${quantity}x ${dish.name} added`,
        type: 'success',
        image: dish.image
      }
    }));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], quantity: newQuantity };
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => {
      const item = prev[index];
      if (item) {
        window.dispatchEvent(new CustomEvent('nocturne_toast', {
          detail: {
            title: 'Item Removed',
            message: `${item.dish.name} was removed from cart`,
            type: 'info'
          }
        }));
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const saveForLaterItem = (index) => {
    const item = cart[index];
    if (item) {
      setSavedForLater(prev => [...prev, item]);
      removeFromCart(index);
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: {
          title: 'Saved For Later',
          message: `${item.dish.name} moved to saved items`,
          type: 'info'
        }
      }));
    }
  };

  const moveToCartFromSaved = (index) => {
    const item = savedForLater[index];
    if (item) {
      addToCart(item.dish, item.customizations, item.quantity);
      setSavedForLater(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Apply Coupon
  const applyCouponCode = (code) => {
    setCouponError('');
    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon(result);
      setCouponCode(code.toUpperCase());
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: {
          title: 'Promotion Applied',
          message: result.message,
          type: 'success'
        }
      }));
      return true;
    } else {
      setCouponError(result.message);
      setAppliedCoupon(null);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Re-evaluate discount if subtotal changes
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = calculateTax(taxableAmount);
  const deliveryFee = calculateDeliveryFee(orderType, subtotal);
  const grandTotal = Math.max(0, taxableAmount + tax + deliveryFee);

  return (
    <CartContext.Provider value={{
      cart,
      totalItemCount,
      subtotal,
      discountAmount,
      tax,
      deliveryFee,
      grandTotal,
      orderType,
      setOrderType,
      selectedTable,
      setSelectedTable,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLaterItem,
      savedForLater,
      moveToCartFromSaved,
      clearCart,
      couponCode,
      setCouponCode,
      appliedCoupon,
      couponError,
      applyCouponCode,
      applyCoupon: applyCouponCode,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

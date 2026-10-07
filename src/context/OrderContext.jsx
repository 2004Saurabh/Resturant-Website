import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { RESTAURANT_ORIGIN, DELIVERY_PARTNERS, PRESET_DELIVERY_HUBS } from '../data/delivery';

const OrderContext = createContext();

const INITIAL_ORDERS = [
  {
    id: 'NOC-8831',
    customer: {
      name: 'Alexander Sterling',
      email: 'user@nocturne.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Penthouse B, Central Delhi'
    },
    pickupLocation: RESTAURANT_ORIGIN,
    deliveryLocation: {
      address: '742 Evergreen Terrace, Penthouse B, Central Delhi',
      area: 'Mayfair Presidential Suites',
      distanceKm: 3.4,
      coords: { x: 62, y: 45, lat: 28.6180, lng: 77.2400 }
    },
    deliveryPartner: DELIVERY_PARTNERS[0], // Vikram Singh
    deliveryProgress: 65, // percentage along route
    riderCoords: { x: 53.6, y: 48.5 },
    items: [
      {
        dish: {
          id: 'imnv-1',
          name: 'Nocturne Butter Chicken (Old Delhi)',
          price: 510,
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
          category: 'Indian Main Course — Non-Veg'
        },
        customizations: { extraSauce: true },
        unitPrice: 540,
        quantity: 2
      },
      {
        dish: {
          id: 'bir-3',
          name: 'Hyderabadi Chicken Dum Biryani',
          price: 500,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
          category: 'Biryani'
        },
        customizations: {},
        unitPrice: 500,
        quantity: 1
      },
      {
        dish: {
          id: 'des-2',
          name: 'Kashmiri Kesar Rasmalai (2 pcs)',
          price: 260,
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
          category: 'Desserts'
        },
        customizations: {},
        unitPrice: 260,
        quantity: 2
      }
    ],
    subtotal: 2100.00,
    discount: 210.00,
    tax: 105.00,
    deliveryFee: 0.00,
    total: 1995.00,
    paymentMethod: 'Card (Visa ending in 4242)',
    orderType: 'delivery',
    table: null,
    status: 'OUT_FOR_DELIVERY', // 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED'
    createdAt: '2026-10-01T01:45:00.000Z',
    estimatedTime: '15-20 mins'
  },
  {
    id: 'NOC-8794',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      phone: '+1 (555) 876-5432',
      address: '120 Ocean View Boulevard, Suite 40'
    },
    items: [
      {
        dish: {
          id: 'piz-1',
          name: 'Artisan Margherita D.O.P.',
          price: 380,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
          category: 'Pizza'
        },
        customizations: { extraCheese: true },
        unitPrice: 420,
        quantity: 2
      },
      {
        dish: {
          id: 'bev-13',
          name: 'Nocturne Smoked Botanical Mocktail',
          price: 240,
          image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
          category: 'Beverages'
        },
        customizations: {},
        unitPrice: 240,
        quantity: 2
      }
    ],
    subtotal: 1320.00,
    discount: 0.00,
    tax: 66.00,
    deliveryFee: 0.00,
    total: 1386.00,
    paymentMethod: 'UPI (sophia@okhdfc)',
    orderType: 'dine-in',
    table: 'T03',
    status: 'COMPLETED',
    createdAt: '2026-09-30T22:15:00.000Z',
    estimatedTime: 'Delivered'
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  });

  const [lastOrder, setLastOrder] = useState(() => {
    return getStorageItem(STORAGE_KEYS.LAST_ORDER, INITIAL_ORDERS[0]);
  });

  // Listen to custom window storage update event for live sync across components & tabs
  useEffect(() => {
    const handleStorageUpdate = (event) => {
      if (event.detail?.key === STORAGE_KEYS.ORDERS) {
        setOrders(event.detail.value || []);
      }
      if (event.detail?.key === STORAGE_KEYS.LAST_ORDER) {
        setLastOrder(event.detail.value);
      }
    };

    window.addEventListener('nocturne_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('nocturne_storage_update', handleStorageUpdate);
  }, []);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_ORDER, lastOrder);
  }, [lastOrder]);

  const createOrder = (orderPayload) => {
    const newOrderId = `NOC-${Math.floor(1000 + Math.random() * 9000)}`;

    // Resolve delivery location details
    let resolvedDeliveryLoc = orderPayload.deliveryLocation;
    if (!resolvedDeliveryLoc && orderPayload.orderType === 'delivery') {
      const matchedHub = PRESET_DELIVERY_HUBS.find(h => 
        orderPayload.customer?.address?.toLowerCase().includes(h.area.toLowerCase())
      ) || PRESET_DELIVERY_HUBS[0];

      resolvedDeliveryLoc = {
        address: orderPayload.customer?.address || matchedHub.address,
        area: matchedHub.area,
        distanceKm: matchedHub.distanceKm,
        coords: matchedHub.coords
      };
    }

    const assignedPartner = orderPayload.orderType === 'delivery' 
      ? DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)]
      : null;

    const newOrder = {
      ...orderPayload,
      id: newOrderId,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      estimatedTime: orderPayload.orderType === 'dine-in' ? '15-20 mins' : '30-40 mins',
      pickupLocation: RESTAURANT_ORIGIN,
      deliveryLocation: resolvedDeliveryLoc || null,
      deliveryPartner: assignedPartner,
      deliveryProgress: 10,
      riderCoords: { ...RESTAURANT_ORIGIN.coords }
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setLastOrder(newOrder);

    // Save directly to localStorage to guarantee instant persistence
    setStorageItem(STORAGE_KEYS.ORDERS, updatedOrders);
    setStorageItem(STORAGE_KEYS.LAST_ORDER, newOrder);

    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Order Placed Successfully',
        message: `Order #${newOrderId} sent to Nocturne Kitchen (Saurabh Kumar)`,
        type: 'success'
      }
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          // Adjust delivery progress based on status
          let newProgress = order.deliveryProgress || 10;
          let newRiderCoords = order.riderCoords || (order.pickupLocation?.coords || RESTAURANT_ORIGIN.coords);

          if (newStatus === 'ACCEPTED') newProgress = 25;
          if (newStatus === 'PREPARING') newProgress = 40;
          if (newStatus === 'READY') newProgress = 60;
          if (newStatus === 'OUT_FOR_DELIVERY') {
            newProgress = 75;
            // Interpolate position between restaurant and customer
            if (order.deliveryLocation?.coords && order.pickupLocation?.coords) {
              newRiderCoords = {
                x: order.pickupLocation.coords.x + (order.deliveryLocation.coords.x - order.pickupLocation.coords.x) * 0.6,
                y: order.pickupLocation.coords.y + (order.deliveryLocation.coords.y - order.pickupLocation.coords.y) * 0.6
              };
            }
          }
          if (newStatus === 'COMPLETED') {
            newProgress = 100;
            if (order.deliveryLocation?.coords) {
              newRiderCoords = { ...order.deliveryLocation.coords };
            }
          }

          const updatedOrder = {
            ...order,
            status: newStatus,
            deliveryProgress: newProgress,
            riderCoords: newRiderCoords,
            updatedAt: new Date().toISOString()
          };
          if (lastOrder && lastOrder.id === orderId) {
            setLastOrder(updatedOrder);
            setStorageItem(STORAGE_KEYS.LAST_ORDER, updatedOrder);
          }
          return updatedOrder;
        }
        return order;
      });
      setStorageItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });

    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Order Status Updated',
        message: `Order #${orderId} is now ${newStatus}`,
        type: 'info'
      }
    }));
  };

  const assignDeliveryPartner = (orderId, partner) => {
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, deliveryPartner: partner };
          if (lastOrder && lastOrder.id === orderId) setLastOrder(updatedOrder);
          return updatedOrder;
        }
        return order;
      });
      setStorageItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });
  };

  const advanceDeliveryProgress = (orderId, progressPercent) => {
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          const clamped = Math.min(100, Math.max(0, progressPercent));
          let riderC = order.riderCoords;
          if (order.deliveryLocation?.coords && order.pickupLocation?.coords) {
            const p = clamped / 100;
            riderC = {
              x: order.pickupLocation.coords.x + (order.deliveryLocation.coords.x - order.pickupLocation.coords.x) * p,
              y: order.pickupLocation.coords.y + (order.deliveryLocation.coords.y - order.pickupLocation.coords.y) * p
            };
          }
          let newStatus = order.status;
          if (clamped >= 100) newStatus = 'COMPLETED';
          else if (clamped >= 50) newStatus = 'OUT_FOR_DELIVERY';

          const updatedOrder = {
            ...order,
            deliveryProgress: clamped,
            riderCoords: riderC,
            status: newStatus
          };
          if (lastOrder && lastOrder.id === orderId) setLastOrder(updatedOrder);
          return updatedOrder;
        }
        return order;
      });
      setStorageItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });
  };

  return (
    <OrderContext.Provider value={{
      orders,
      lastOrder,
      createOrder,
      updateOrderStatus,
      assignDeliveryPartner,
      advanceDeliveryProgress,
      setLastOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { INITIAL_TABLES } from '../data/tables';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [tables, setTables] = useState(() => {
    return getStorageItem(STORAGE_KEYS.TABLES, INITIAL_TABLES);
  });

  const [reservations, setReservations] = useState(() => {
    return getStorageItem(STORAGE_KEYS.RESERVATIONS, [
      {
        id: 'RES-901',
        customer: {
          name: 'Alexander Sterling',
          email: 'user@nocturne.com',
          phone: '+1 (555) 234-5678'
        },
        tableId: 'T04',
        date: '2026-10-02',
        time: '20:00',
        guests: 4,
        occasion: 'Anniversary Celebration',
        specialRequests: 'Candlelight arrangement, bottle of Vintage Champagne ready',
        status: 'CONFIRMED',
        createdAt: '2026-10-01T01:30:00.000Z'
      }
    ]);
  });

  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TABLES, tables);
  }, [tables]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RESERVATIONS, reservations);
  }, [reservations]);

  const reserveTable = ({ customer, tableId, date, time, guests, occasion = 'Dinner', specialRequests = '' }) => {
    const reservationId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      id: reservationId,
      customer,
      tableId,
      date,
      time,
      guests: parseInt(guests) || 2,
      occasion,
      specialRequests,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    // Update reservations list
    setReservations(prev => [newReservation, ...prev]);

    // Mark table as RESERVED
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'RESERVED' } : t));

    window.dispatchEvent(new CustomEvent('nocturne_toast', {
      detail: {
        title: 'Table Reserved',
        message: `${tableId} confirmed for ${date} at ${time}`,
        type: 'success'
      }
    }));

    return newReservation;
  };

  const updateTableStatus = (tableId, status) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const cancelReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);
    if (res) {
      setTables(prev => prev.map(t => t.id === res.tableId ? { ...t, status: 'AVAILABLE' } : t));
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'CANCELLED' } : r));
      window.dispatchEvent(new CustomEvent('nocturne_toast', {
        detail: {
          title: 'Reservation Cancelled',
          message: `Reservation ${reservationId} cancelled`,
          type: 'info'
        }
      }));
    }
  };

  return (
    <ReservationContext.Provider value={{
      tables,
      reservations,
      selectedTableId,
      setSelectedTableId,
      reserveTable,
      updateTableStatus,
      cancelReservation
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);

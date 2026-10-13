import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { FOOD_ITEMS } from '../data/foods';

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState(() => {
    const cached = getStorageItem(STORAGE_KEYS.OWNER_MENU, null);
    if (!cached || !Array.isArray(cached)) return FOOD_ITEMS;
    // Sync latest default images and data while retaining custom items added by user/owner
    const defaultMap = new Map(FOOD_ITEMS.map(item => [item.id, item]));
    return cached.map(item => {
      const defaultItem = defaultMap.get(item.id);
      if (defaultItem) {
        return { ...item, image: defaultItem.image, name: defaultItem.name, description: defaultItem.description };
      }
      return item;
    });
  });

  const [favorites, setFavorites] = useState(() => {
    return getStorageItem(STORAGE_KEYS.FAVORITES, ['vs-1', 'imnv-1', 'bir-3', 'piz-1']);
  });

  const [quickViewDish, setQuickViewDish] = useState(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.OWNER_MENU, foods);
  }, [foods]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const toggleFavorite = (dishId) => {
    setFavorites(prev => {
      if (prev.includes(dishId)) {
        return prev.filter(id => id !== dishId);
      } else {
        return [...prev, dishId];
      }
    });
  };

  const isFavorite = (dishId) => favorites.includes(dishId);

  // Owner Operations
  const addDish = (newDish) => {
    const dish = {
      ...newDish,
      id: `custom-${Date.now()}`,
      rating: newDish.rating || 5.0,
      reviews: newDish.reviews || 1,
      available: newDish.available !== false,
      price: parseFloat(newDish.price) || 20.00
    };
    setFoods(prev => [dish, ...prev]);
    return dish;
  };

  const updateDish = (id, updatedFields) => {
    setFoods(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteDish = (id) => {
    setFoods(prev => prev.filter(item => item.id !== id));
  };

  const toggleAvailability = (id) => {
    setFoods(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  const resetMenuToDefault = () => {
    setFoods(FOOD_ITEMS);
  };

  return (
    <FoodContext.Provider value={{
      foods,
      favorites,
      toggleFavorite,
      isFavorite,
      addDish,
      updateDish,
      deleteDish,
      toggleAvailability,
      resetMenuToDefault,
      quickViewDish,
      setQuickViewDish
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);

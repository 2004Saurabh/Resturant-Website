// Storage Keys
export const STORAGE_KEYS = {
  USER: 'nocturne_user',
  CART: 'nocturne_cart',
  ORDERS: 'nocturne_orders',
  LAST_ORDER: 'nocturne_last_order',
  FAVORITES: 'nocturne_favorites',
  RESERVATIONS: 'nocturne_reservations',
  OWNER_MENU: 'nocturne_owner_menu',
  TABLES: 'nocturne_tables',
  SETTINGS: 'nocturne_settings',
  USERS: 'nocturne_registered_users',
  RESTAURANTS: 'nocturne_restaurants',
};

// Safe JSON get
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Safe JSON set
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for real-time reactivity within the same window
    window.dispatchEvent(new CustomEvent('nocturne_storage_update', { detail: { key, value } }));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

// Safe remove
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('nocturne_storage_update', { detail: { key, value: null } }));
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

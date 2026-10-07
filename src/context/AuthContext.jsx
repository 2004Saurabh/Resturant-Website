import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/localStorage';
import { DEMO_USERS } from '../data/users';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.USERS, DEMO_USERS);
    return saved.map(u => {
      if (u.role === 'RESTAURANT_OWNER' || u.id === 'usr-2') {
        return {
          ...u,
          name: 'Saurabh Kumar',
          email: 'saurabh@123gmail.com'
        };
      }
      return u;
    });
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.USER, DEMO_USERS[0]);
    if (saved && (saved.role === 'RESTAURANT_OWNER' || saved.id === 'usr-2')) {
      return {
        ...saved,
        name: 'Saurabh Kumar',
        email: 'saurabh@123gmail.com'
      };
    }
    return saved;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return getStorageItem('nocturne_is_logged_in', false);
  });

  useEffect(() => {
    setStorageItem('nocturne_is_logged_in', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USERS, allUsers);
  }, [allUsers]);

  const switchRole = (role) => {
    const targetUser = allUsers.find(u => u.role === role) || {
      ...currentUser,
      role,
      name: role === 'ADMIN'
        ? 'Genevieve Du Pont'
        : role === 'RESTAURANT_OWNER'
        ? 'Saurabh Kumar'
        : role === 'DELIVERY_PARTNER'
        ? 'Vikram Singh'
        : 'Alexander Sterling',
      email: role === 'RESTAURANT_OWNER'
        ? 'saurabh@123gmail.com'
        : role === 'DELIVERY_PARTNER'
        ? 'delivery@nocturne.com'
        : `${role.toLowerCase()}@nocturne.com`,
      phone: role === 'DELIVERY_PARTNER' ? '+91 98112 34567' : '+91 98765 43210',
      vehicle: role === 'DELIVERY_PARTNER' ? 'Nocturne Express EV (DL-09-EV-4412)' : undefined
    };
    setCurrentUser(targetUser);
    setIsLoggedIn(true);
  };

  const loginAs = (email, requestedRole = null) => {
    let match = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!match && requestedRole) {
      match = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        name: email.split('@')[0],
        role: requestedRole,
        active: true
      };
      setAllUsers(prev => [...prev, match]);
    }
    if (match) {
      setCurrentUser(match);
      setIsLoggedIn(true);
      return { success: true, user: match };
    }
    return { success: false, message: 'Invalid credentials or account not found' };
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields };
      setAllUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  };

  const toggleUserStatus = (userId) => {
    setAllUsers(all => all.map(u => {
      if (u.id === userId) {
        return { ...u, active: !u.active };
      }
      return u;
    }));
  };

  const logout = () => {
    // Revert to default guest/user and set logged out
    setIsLoggedIn(false);
    setCurrentUser(DEMO_USERS[0]);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      role: currentUser?.role || 'USER',
      isLoggedIn,
      setIsLoggedIn,
      switchRole,
      loginAs,
      updateProfile,
      toggleUserStatus,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

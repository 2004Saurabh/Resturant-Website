import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import { CartProvider } from './context/CartContext';
import { ReservationProvider } from './context/ReservationContext';
import { OrderProvider } from './context/OrderContext';

// Global UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import FoodViewer3D from './components/FoodViewer3D';
import Toast from './components/Toast';
import FloatingCartBar from './components/FloatingCartBar';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import AIFoodOrder from './pages/AIFoodOrder';
import ManualFoodOrder from './pages/ManualFoodOrder';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Invoice from './pages/Invoice';
import Reservation from './pages/Reservation';
import AIReservation from './pages/AIReservation';
import Favorites from './pages/Favorites';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Login from './pages/Login';

// Dashboards
import UserDashboard from './dashboard/UserDashboard';
import UserOrders from './dashboard/UserOrders';
import UserReservations from './dashboard/UserReservations';

import OwnerDashboard from './dashboard/OwnerDashboard';
import OwnerOrders from './dashboard/OwnerOrders';
import OwnerMenu from './dashboard/OwnerMenu';
import OwnerTables from './dashboard/OwnerTables';
import OwnerAnalytics from './dashboard/OwnerAnalytics';
import OwnerDeliveryMap from './dashboard/OwnerDeliveryMap';

import AdminDashboard from './dashboard/AdminDashboard';
import AdminUsers from './dashboard/AdminUsers';
import AdminOrders from './dashboard/AdminOrders';
import AdminReservations from './dashboard/AdminReservations';
import AdminAnalytics from './dashboard/AdminAnalytics';
import AdminDeliveryMap from './dashboard/AdminDeliveryMap';

import DeliveryDashboard from './dashboard/DeliveryDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F7F4EE] flex flex-col relative selection:bg-[#D4AF37]/30 selection:text-white">
      
      {/* Scroll Restoration */}
      <ScrollToTop />

      {/* Cinematic Intro Screen */}
      <LoadingScreen />

      {/* Desktop Luxury Ring Cursor */}
      <CustomCursor />

      {/* Global Toast System */}
      <Toast />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar />

      {/* Sticky Luxury Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 3D Food Product Experience Modal */}
      <FoodViewer3D />

      {/* Application Route Views */}
      <main className="flex-1">
        <Routes>
          {/* Starting Route: If user hasn't logged in, starts on 3D Login page; once authenticated, loads Home */}
          <Route path="/" element={!isLoggedIn ? <Login /> : <Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Public & Customer Routes */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/ai/food" element={<AIFoodOrder />} />
          <Route path="/manual/food" element={<ManualFoodOrder />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={!isLoggedIn ? <Login /> : <Checkout />} />
          <Route path="/payment" element={!isLoggedIn ? <Login /> : <Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/ai/reservation" element={<AIReservation />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={!isLoggedIn ? <Login /> : <Profile />} />

          {/* User Dashboard */}
          <Route path="/dashboard/user" element={!isLoggedIn ? <Login /> : <UserDashboard />}>
            <Route path="orders" element={<UserOrders />} />
            <Route path="reservations" element={<UserReservations />} />
          </Route>

          {/* Restaurant Owner Dashboard */}
          <Route path="/dashboard/owner" element={!isLoggedIn ? <Login /> : <OwnerDashboard />}>
            <Route path="orders" element={<OwnerOrders />} />
            <Route path="delivery" element={<OwnerDeliveryMap />} />
            <Route path="menu" element={<OwnerMenu />} />
            <Route path="tables" element={<OwnerTables />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
          </Route>

          {/* Super Admin Dashboard */}
          <Route path="/dashboard/admin" element={!isLoggedIn ? <Login /> : <AdminDashboard />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="delivery" element={<AdminDeliveryMap />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* Dedicated Delivery Fleet Partner Portal */}
          <Route path="/dashboard/delivery" element={!isLoggedIn ? <Login /> : <DeliveryDashboard />} />

          {/* Fallback */}
          <Route path="*" element={!isLoggedIn ? <Login /> : <Home />} />
        </Routes>
      </main>

      {/* Luxury Editorial Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <CartProvider>
          <ReservationProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </ReservationProvider>
        </CartProvider>
      </FoodProvider>
    </AuthProvider>
  );
}

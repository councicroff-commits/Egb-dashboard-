import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Use Auth Context instead of disconnected utils
import { useAuth } from '../context/AuthContext';

// Layouts & Authentication Pages
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';

// Core Pages
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Users from '../pages/Users';
import UserDetail from '../pages/UserDetail';
import Settings from '../pages/Settings';
import Promos from '../pages/Promos';

// Product Management Pages
import ProductList from '../pages/ProductList';
import ProductForm from '../pages/ProductForm';
import ProductDetail from '../pages/ProductDetail';

// Order Management Pages
import OrderList from '../pages/OrderList';
import OrderDetails from '../pages/OrderDetails';

// ==========================================
// PROTECTED ROUTE WRAPPER
// ==========================================
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#11130f] text-[#f8f4e8]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4a56a]">Loading backyard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// ==========================================
// PRODUCTION APP ROUTER
// ==========================================
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Admin Routes wrapper */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Index fallback → Home */}
        <Route index element={<Home />} />

        {/* Core Pages */}
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="promos" element={<Promos />} />
        <Route path="settings" element={<Settings />} />

        {/* Product Management 
            NOTE: Place static paths (/new) BEFORE dynamic paths (/:id) 
            to prevent React Router from treating 'new' as an ID parameter! */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetail />} />

        {/* Order Management */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetails />} />

        {/* Users Management */}
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
      </Route>

      {/* Global Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

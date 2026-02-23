import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Layouts
import MainLayout from "../layouts/MainLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import StaffLayout from "../layouts/StaffLayout";
import KitchenLayout from "../layouts/KitchenLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Public Pages
import Home from "../pages/Home";

// Customer Pages
import Menu from "../pages/customer/Menu";
import Order from "../pages/customer/Order";
import OrderHistory from "../pages/customer/OrderHistory";

// Admin Pages
import Dashboard from "../pages/Admin/Dashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManagerDashboard from "../pages/Admin/ManagerDashboard";
import StaffDashboard from "../pages/staff/StaffDashboard";
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";

// Staff Pages
import StaffTables from "../pages/staff/Tables";
import StaffCreateOrder from "../pages/staff/CreateOrder";
import StaffOrders from "../pages/staff/Orders";

// Old Admin Pages (temporary)
import CategoryPage from "../pages/CategoryPage";
import ProductPage from "../pages/ProductPage";
import ToppingPage from "../pages/ToppingPage";
import ProductVariantPage from "../pages/ProductVariantPage";
import OrderPage from "../pages/OrderPage";
import TablePage from "../pages/TablePage";
import AccountPage from "../pages/AccountPage";

// Placeholder components
const Cart = () => <div style={{padding: "40px", color: "#fff", minHeight: "100vh", background: "#1a1a1a"}}>Cart Page - Coming Soon</div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Customer Routes (includes public menu) */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="order" element={<Order />} />
        <Route path="my-orders" element={<OrderHistory />} />
      </Route>

      {/* Menu accessible from customer layout */}
      <Route path="/menu" element={<CustomerLayout />}>
        <Route index element={<Menu />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="tables" element={<StaffTables />} />
        <Route path="create-order" element={<StaffCreateOrder />} />
        <Route path="orders" element={<StaffOrders />} />
      </Route>

      {/* Kitchen Routes (Chef) */}
      <Route path="/kitchen" element={<KitchenLayout />}>
        <Route index element={<KitchenDashboard />} />
      </Route>

      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="variants" element={<ProductVariantPage />} />
        <Route path="toppings" element={<ToppingPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="tables" element={<TablePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="variants" element={<ProductVariantPage />} />
        <Route path="toppings" element={<ToppingPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="tables" element={<TablePage />} />
        <Route path="accounts" element={<AccountPage />} />
      </Route>

      {/* Legacy routes redirect based on role */}
      <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
      <Route path="/products" element={<Navigate to="/admin/products" replace />} />
      <Route path="/variants" element={<Navigate to="/admin/variants" replace />} />
      <Route path="/toppings" element={<Navigate to="/admin/toppings" replace />} />
      <Route path="/orders" element={<Navigate to="/admin/orders" replace />} />
      <Route path="/tables" element={<Navigate to="/admin/tables" replace />} />
      <Route path="/accounts" element={<Navigate to="/admin/accounts" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

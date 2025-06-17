import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import ProductManagementPage from './pages/ProductManagementPage';
import SalesTransactionPage from './pages/SalesTransactionPage';
import ReceivingTransactionPage from './pages/ReceivingTransactionPage';
import ReportsPage from './pages/ReportsPage';
import CustomerMenuTabletPage from './pages/CustomerMenuTabletPage';
import NotFoundPage from './pages/NotFoundPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route index element={<DashboardPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/customers" element={<CustomerManagementPage />} />
      <Route path="/products" element={<ProductManagementPage />} />
      <Route path="/sales" element={<SalesTransactionPage />} />
      <Route path="/receiving" element={<ReceivingTransactionPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/customer-menu" element={<CustomerMenuTabletPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;

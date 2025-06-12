import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element=<AuthPage /> />
          <Route path="/" element=<DashboardPage /> />
          <Route path="/users" element=<UserManagementPage /> />
          <Route path="/customers" element=<CustomerManagementPage /> />
          <Route path="/products" element=<ProductManagementPage /> />
          <Route path="/sales" element=<SalesTransactionPage /> />
          <Route path="/receiving" element=<ReceivingTransactionPage /> />
          <Route path="/reports" element=<ReportsPage /> />
          <Route path="/customer-menu" element=<CustomerMenuTabletPage /> />
          <Route path="*" element=<NotFoundPage /> />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

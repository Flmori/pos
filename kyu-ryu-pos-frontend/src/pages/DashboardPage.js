import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h1>Dashboard - Feature Testing</h1>
          <nav className="feature-nav">
            <ul>
              <li><Link to="/users">User Management</Link></li>
              <li><Link to="/customers">Customer Management</Link></li>
              <li><Link to="/products">Product Management</Link></li>
              <li><Link to="/sales">Sales Transaction</Link></li>
              <li><Link to="/receiving">Receiving Transaction</Link></li>
              <li><Link to="/reports">Reports</Link></li>
              <li><Link to="/customer-menu">Customer Menu Tablet</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

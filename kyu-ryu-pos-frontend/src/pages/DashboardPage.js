import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const DashboardPage = () => {
  // Dummy data for demonstration
  const salesSummary = {
    totalSales: 1500000,
    transactionCount: 45,
  };

  const lowStockItems = [
    { id: 1, name: 'Kopi Arabika', stock: 3 },
    { id: 2, name: 'Roti Tawar', stock: 2 },
  ];

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h1>Dashboard</h1>
          <section className="sales-summary">
            <h2>Ringkasan Penjualan Hari Ini</h2>
            <p>Total Penjualan: Rp {salesSummary.totalSales.toLocaleString()}</p>
            <p>Jumlah Transaksi: {salesSummary.transactionCount}</p>
          </section>
          <section className="stock-notifications">
            <h2>Notifikasi Stok Minimum</h2>
            <ul>
              {lowStockItems.map(item => (
                <li key={item.id}>
                  {item.name} - Stok tersisa: {item.stock}
                </li>
              ))}
            </ul>
          </section>
          <section className="sales-chart">
            <h2>Grafik Penjualan (Opsional)</h2>
            <p>Grafik akan ditampilkan di sini.</p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

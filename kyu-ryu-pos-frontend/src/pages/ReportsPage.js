import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import Table from '../components/common/Table/Table';

const reportTypes = [
  { key: 'stock', label: 'Laporan Stok Barang' },
  { key: 'sales', label: 'Laporan Transaksi Penjualan' },
  { key: 'receiving', label: 'Laporan Transaksi Penerimaan Barang' },
  { key: 'customerCount', label: 'Laporan Jumlah Pelanggan per Hari' },
];

const categories = ['Semua', 'Kopi', 'Makanan', 'Minuman Non-Kopi'];

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('stock');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Dummy report data
  const reportData = [];

  const handleExport = (format) => {
    alert("Ekspor laporan ke " + format + " belum diimplementasikan.");
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="reports-page">
          <h1>Laporan</h1>
          <div className="report-selection">
            {reportTypes.map((report) => (
              <Button
                key={report.key}
                onClick={() => setSelectedReport(report.key)}
                className={selectedReport === report.key ? 'active' : ''}
              >
                {report.label}
              </Button>
            ))}
          </div>
          <div className="report-filters">
            <label>
              Dari Tanggal:
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </label>
            <label>
              Sampai Tanggal:
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </label>
            {(selectedReport === 'stock' || selectedReport === 'sales') && (
              <label>
                Kategori:
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            )}
            <Button onClick={() => alert('Tampilkan laporan belum diimplementasikan')}>Tampilkan Laporan</Button>
          </div>
          <div className="report-display">
            <Table data={reportData}>
              <thead>
                <tr>
                  <th>Data Laporan</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length === 0 ? (
                  <tr>
                    <td>Data laporan akan ditampilkan di sini.</td>
                  </tr>
                ) : (
                  reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{row}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <div className="export-buttons">
            <Button onClick={() => handleExport('Excel')}>Ekspor ke Excel</Button>
            <Button onClick={() => handleExport('PDF')}>Ekspor ke PDF</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;

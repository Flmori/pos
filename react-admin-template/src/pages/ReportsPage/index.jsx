import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Stack } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import SalesTransactionReportCard from './SalesTransactionReportCard';
import ReceivingTransactionReportCard from './ReceivingTransactionReportCard';
import DailyCustomerCountReportCard from './DailyCustomerCountReportCard';
import StockReportCard from './StockReportCard';

const ReportsPage = () => {
  // For demonstration, pass empty arrays or mock data as needed
  const salesData = [];
  const categories = [];
  const receivingData = [];
  const employees = [];
  const conditions = ['Baik', 'Rusak', 'Cacat'];
  const customerData = [];
  const products = [];
  const stockCategories = [];

  const [selectedCategory, setSelectedCategory] = useState('Stok');

  return (
    <>
      <Breadcrumb title="Aplikasi Pelanggan">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Laporan
        </Typography>
      </Breadcrumb>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={selectedCategory === 'Stok' ? 'contained' : 'outlined'}
          onClick={() => setSelectedCategory('Stok')}
        >
          Laporan Stok Barang
        </Button>
        <Button
          variant={selectedCategory === 'Penjualan' ? 'contained' : 'outlined'}
          onClick={() => setSelectedCategory('Penjualan')}
        >
          Laporan Transaksi Penjualan
        </Button>
        <Button
          variant={selectedCategory === 'Penerimaan' ? 'contained' : 'outlined'}
          onClick={() => setSelectedCategory('Penerimaan')}
        >
          Laporan Transaksi Penerimaan
        </Button>
        <Button
          variant={selectedCategory === 'Pelanggan' ? 'contained' : 'outlined'}
          onClick={() => setSelectedCategory('Pelanggan')}
        >
          Laporan Jumlah Pelanggan per Hari
        </Button>
      </Stack>

      <div>
        {selectedCategory === 'Stok' && (
          <StockReportCard products={products} categories={stockCategories} />
        )}
        {selectedCategory === 'Penjualan' && (
          <SalesTransactionReportCard salesData={salesData} categories={categories} />
        )}
        {selectedCategory === 'Penerimaan' && (
          <ReceivingTransactionReportCard receivingData={receivingData} employees={employees} conditions={conditions} />
        )}
        {selectedCategory === 'Pelanggan' && (
          <DailyCustomerCountReportCard customerData={customerData} />
        )}
      </div>
    </>
  );
};

export default ReportsPage;

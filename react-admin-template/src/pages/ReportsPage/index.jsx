import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Stack } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import SalesTransactionReportCard from './SalesTransactionReportCard';
import ReceivingTransactionReportCard from './ReceivingTransactionReportCard';
import DailyCustomerCountReportCard from './DailyCustomerCountReportCard';
import StockReportCard from './StockReportCard';
import axios from 'axios';

const ReportsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [receivingData, setReceivingData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const conditions = ['Baik', 'Rusak', 'Cacat'];
  const [customerData, setCustomerData] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockCategories, setStockCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('Stok');

  useEffect(() => {
    const fetchStockReport = async () => {
      try {
        const response = await axios.get('http://localhost:8000/toko-kyu-ryu/api/products/stock-report');
        const data = response.data;
        setProducts(data);
        // Extract unique categories from products
        const uniqueCategories = Array.from(new Set(data.map(item => item.Category?.nama_kategori).filter(Boolean)));
        setStockCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching stock report:', error);
        setProducts([]);
        setStockCategories([]);
      }
    };

    const fetchSalesReport = async () => {
      try {
        const response = await axios.get('http://localhost:8000/toko-kyu-ryu/api/sales/sales-report');
        const data = response.data;
        setSalesData(data);
        // Extract unique categories from sales products
        const uniqueCategories = Array.from(new Set(data.map(item => item.Product?.nama_barang).filter(Boolean)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching sales report:', error);
        setSalesData([]);
        setCategories([]);
      }
    };

    const fetchReceivingTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/toko-kyu-ryu/api/receiving-transactions');
        const data = response.data;

        setReceivingData(data);

        // Extract unique employees from data
        const uniqueEmployees = Array.from(new Set(data.map(item => item.pegawai_pencatat).filter(Boolean)));
        setEmployees(uniqueEmployees);
      } catch (error) {
        console.error('Error fetching receiving transactions:', error);
        setReceivingData([]);
        setEmployees([]);
      }
    };

    const fetchDailyCustomerCount = async () => {
      try {
        const response = await axios.get('http://localhost:8000/toko-kyu-ryu/api/customers/daily-customer-count-report');
        const data = response.data;
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching daily customer count report:', error);
        setCustomerData([]);
      }
    };

    if (selectedCategory === 'Stok') {
      fetchStockReport();
    } else if (selectedCategory === 'Penjualan') {
      fetchSalesReport();
    } else if (selectedCategory === 'Penerimaan') {
      fetchReceivingTransactions();
    } else if (selectedCategory === 'Pelanggan') {
      fetchDailyCustomerCount();
    }
  }, [selectedCategory]);

  return (
    <>
      <Breadcrumb title="Laporan">
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

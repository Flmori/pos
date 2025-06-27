import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';

//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';

import { gridSpacing } from 'config.js';

// assets
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();

  // Sales summary state
  const [salesSummary, setSalesSummary] = useState({
    totalSales: null,
    transactionCount: null
  });
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);

  // Low stock items state
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales summary
  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        setSalesLoading(true);
        setSalesError(null);
        const response = await fetch('/toko-kyu-ryu/api/sales/daily-sales-summary');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSalesSummary({
          totalSales: data.totalSales,
          transactionCount: data.transactionCount
        });
      } catch (err) {
        setSalesError(err.message);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSalesSummary();
  }, []);

  // Fetch low stock items
  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/toko-kyu-ryu/api/products/stock-report');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Map data to expected format
        // Filter products with stock less than 20 on frontend as fallback
        const filteredItems = data.filter(item => item.stok < 20);
        const items = filteredItems.map(item => ({
          id: item.id_barang,
          name: item.nama_barang,
          stock: item.stok
        }));
        setLowStockItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  // Construct chartData dynamically
  const chartData = {
    options: {
      chart: {
        sparkline: {
          enabled: false
        },
        type: 'line',
        height: 250,
        toolbar: {
          show: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: [theme.palette.primary.main],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      yaxis: {
        min: undefined,
        max: undefined
      },
      tooltip: {
        theme: 'light',
        fixed: {
          enabled: false
        },
        x: {
          show: true
        },
        y: {
          title: {
            formatter: () => 'Sales/Order Per Day'
          }
        },
        marker: {
          show: true
        }
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 4
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    },
    series: [
      {
        name: 'Sales',
        data: salesSummary.totalSales ? [10, 20, 30, 40, 50, 60, salesSummary.totalSales] : [55, 35, 75, 25, 90, 50, 60]
      }
    ]
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Sales Summary */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Ringkasan Penjualan Hari Ini" />
          <CardContent>
            {salesLoading ? (
              <Typography>Loading...</Typography>
            ) : salesError ? (
              <Typography color="error">Error: {salesError}</Typography>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Total Penjualan: Rp {salesSummary.totalSales?.toLocaleString('id-ID') || '0'}
                </Typography>
                <Typography variant="h6">
                  Jumlah Transaksi: {salesSummary.transactionCount || 0}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Low Stock Notifications */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Notifikasi Stok Minimum" />
          <CardContent>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">Error: {error}</Typography>
            ) : lowStockItems.length === 0 ? (
              <Typography>Tidak ada produk dengan stok minimum.</Typography>
            ) : (
              <List>
                {lowStockItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      <WarningAmberIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={`${item.name} - Stok tersisa: ${item.stock}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Sales Chart */}
      <Grid item xs={12} md={6}>
        <SalesLineCard
          chartData={chartData}
          title="Penjualan Per Hari"
          percentage="3%"
          icon={<TrendingDownIcon />}
          footerData={[
            {
              value: salesSummary.totalSales,
              label: 'Total Penjualan'
            },
            {
              value: salesSummary.transactionCount,
              label: 'Jumlah Transaksi'
            }
          ]}
        />
      </Grid>

      {/* Revenue Chart */}
      {/*
      <Grid item xs={12}>
        <RevenuChartCard chartData={RevenuChartCardData} />
      </Grid>
      */}
    </Grid>
  );
};

export default Default;

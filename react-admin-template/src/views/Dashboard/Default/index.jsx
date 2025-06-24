import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';

import { gridSpacing } from 'config.js';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import ThumbUpAltTwoTone from '@mui/icons-material/ThumbUpAltTwoTone';
import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone';
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

// Mock data for sales summary and stock notifications
const salesSummary = {
  totalSales: 'Rp 50.000.000',
  transactionCount: 120
};

const lowStockItems = [
  { id: 1, name: 'Produk A', stock: 3 },
  { id: 2, name: 'Produk B', stock: 5 },
  { id: 3, name: 'Produk C', stock: 2 }
];

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={gridSpacing}>
      {/* Sales Summary */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Ringkasan Penjualan Hari Ini" />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Total Penjualan: {salesSummary.totalSales}
            </Typography>
            <Typography variant="h6">
              Jumlah Transaksi: {salesSummary.transactionCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Low Stock Notifications */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Notifikasi Stok Minimum" />
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>

      {/* Sales Chart */}
      <Grid item xs={12} md={6}>
        <SalesLineCard
          chartData={SalesLineCardData}
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
      <Grid item xs={12}>
        <RevenuChartCard chartData={RevenuChartCardData} />
      </Grid>
    </Grid>
  );
};

export default Default;


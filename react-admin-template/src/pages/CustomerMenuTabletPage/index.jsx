import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Chip,
  Box,
  CardMedia,
  Stack
} from '@mui/material';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import logoMeko from 'assets/images/logo_meko_no_mori.png';

// ==============================|| CUSTOMER MENU TABLET PAGE ||============================== //

const categories = [
  'Semua',
  'Kopi Klasik',
  'Kopi Signature',
  'Manual Brew',
  'Non-Kopi',
  'Pastry & Roti',
  'Kudapan Berat',
  'Dessert'
];

const products = [
  {
    id: 1,
    category: 'Kopi Klasik',
    name: 'Es Kopi Susu Aren',
    price: 25000,
    description: 'Kopi susu dingin dengan sentuhan manis gula aren asli Indonesia.',
    image: null,
    inStock: true
  },
  {
    id: 2,
    category: 'Pastry & Roti',
    name: 'Croissant Butter',
    price: 15000,
    description: 'Roti croissant dengan mentega asli.',
    image: null,
    inStock: false
  },
  {
    id: 3,
    category: 'Dessert',
    name: 'Pudding Coklat',
    price: 20000,
    description: 'Puding coklat lembut dan manis.',
    image: null,
    inStock: true
  }
];

const CustomerMenuTabletPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredProducts =
    selectedCategory === 'Semua'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <Breadcrumb title="Aplikasi Pelanggan">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Aplikasi Pelanggan
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src={logoMeko} alt="Logo Toko KyuRyu" style={{ height: 50, marginRight: 16 }} />
            <Typography variant="h5">Toko KyuRyu</Typography>
          </Box>
          <Divider />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(category)}
                  sx={{ cursor: 'pointer', mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {product.image && (
                    <CardMedia component="img" height="140" image={product.image} alt={product.name} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Rp {product.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {product.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, color: product.inStock ? 'green' : 'red', fontWeight: 'bold' }}
                    >
                      {product.inStock ? 'Tersedia' : 'Habis'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1">Silakan informasikan pilihan Anda kepada Kasir.</Typography>
            <Typography variant="body1">
              Untuk diskon member, sebutkan ID Member Anda kepada Kasir saat pembayaran.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerMenuTabletPage;

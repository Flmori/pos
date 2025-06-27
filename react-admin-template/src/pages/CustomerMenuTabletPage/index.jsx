import React, { useState, useEffect } from 'react';
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

const categoriesStatic = [
  'Semua',
  'Kopi Klasik',
  'Kopi Signature',
  'Manual Brew',
  'Non-Kopi',
  'Pastry & Roti',
  'Kudapan Berat',
  'Dessert'
];

const CustomerMenuTabletPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(categoriesStatic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/toko-kyu-ryu/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      // Extract unique categories from products
      const uniqueCategories = Array.from(
        new Set(data.map((product) => product.Category?.nama_kategori || 'Lainnya'))
      );
      setCategories(['Semua', ...uniqueCategories]);

      // Map products to frontend format
      const mappedProducts = data.map((product) => ({
        id: product.id_barang,
        category: product.Category?.nama_kategori || 'Lainnya',
        name: product.nama_barang,
        price: product.harga_jual,
        description: product.deskripsi,
        image: null, // Assuming no image from backend
        inStock: product.stok > 0,
        stock: product.stok
      }));
      setProducts(mappedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'Semua'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const getStockStatus = (stock) => {
    if (stock > 20) {
      return { text: 'Tersedia', color: 'green' };
    } else if (stock > 0 && stock <= 20) {
      return { text: 'Stok akan habis', color: 'orange' };
    } else {
      return { text: 'Habis', color: 'red' };
    }
  };

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
          {loading && <Typography>Loading products...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <Grid container spacing={2}>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
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
                        sx={{ mt: 2, color: stockStatus.color, fontWeight: 'bold' }}
                      >
                        {stockStatus.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            {filteredProducts.length === 0 && !loading && (
              <Grid item xs={12}>
                <Typography align="center">Tidak ada produk ditemukan.</Typography>
              </Grid>
            )}
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

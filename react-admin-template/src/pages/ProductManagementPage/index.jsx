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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

// icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| PRODUCT MANAGEMENT PAGE ||============================== //

const initialProducts = [
  { id: 1, name: 'Produk A', quantity: 100, price: 50000 },
  { id: 2, name: 'Produk B', quantity: 50, price: 75000 }
];

const ProductManagementPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: ''
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
  );

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        quantity: product.quantity,
        price: product.price
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        quantity: '',
        price: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProduct = () => {
    // Basic validation
    if (!formData.name || !formData.quantity || !formData.price) {
      alert('Please fill all fields correctly.');
      return;
    }

    if (editingProduct) {
      // Update product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? { ...product, ...formData } : product
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        ...formData
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setOpenDialog(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

  return (
    <>
      <Breadcrumb title="Manajemen Stok Barang">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Manajemen Stok Barang
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Manajemen Stok Barang</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Tambah Stok Barang Baru
                  </Button>
                </Grid>
              }
            />
            <Divider />
            <CardContent>
              <TextField
                label="Cari berdasarkan Nama / ID Produk"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Produk</TableCell>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell>Jumlah Stok</TableCell>
                      <TableCell>Harga</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Tidak ada produk ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Stok Barang' : 'Tambah Stok Barang Baru'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Produk"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Jumlah Stok"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Harga"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSaveProduct}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductManagementPage;

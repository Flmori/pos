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

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    id_barang: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/toko-kyu-ryu/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Map backend product fields to frontend fields including category name
      const mappedProducts = data.map((p) => ({
        id_barang: p.id_barang,
        name: p.nama_barang || p.name,
        quantity: p.stok !== undefined ? p.stok : p.quantity,
        price: p.harga_jual !== undefined ? p.harga_jual : p.price,
        category: p.Category ? p.Category.nama_kategori : ''
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Product Management Error:', error);
      alert('Terjadi kesalahan: ' + error.message);
    }
    setLoading(false);
  };

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
        price: product.price,
        id_barang: product.id_barang // add id_barang to formData for update
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        quantity: '',
        price: '',
        id_barang: null
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

  const handleSaveProduct = async () => {
    // Basic validation
    if (!formData.name || !formData.quantity || !formData.price) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      if (editingProduct && editingProduct.id_barang) {
        // Update product
        const response = await fetch(`http://localhost:8000/toko-kyu-ryu/api/products/${editingProduct.id_barang}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama_barang: formData.name,
            stok: Number(formData.quantity),
            harga_jual: Number(formData.price)
          })
        });
        if (!response.ok) throw new Error('Failed to update product');
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((product) =>
            product.id_barang === updatedProduct.id_barang
              ? {
                  id_barang: updatedProduct.id_barang,
                  name: updatedProduct.nama_barang,
                  quantity: updatedProduct.stok,
                  price: updatedProduct.harga_jual
                }
              : product
          )
        );
      } else {
        // Add new product
        const response = await fetch('http://localhost:8000/toko-kyu-ryu/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama_barang: formData.name,
            stok: Number(formData.quantity),
            harga_jual: Number(formData.price),
            deskripsi: '',
            harga_beli: 0,
            id_kategori: 1 // default category id, adjust as needed
          })
        });
        if (!response.ok) throw new Error('Failed to add product');
        const newProduct = await response.json();
        setProducts((prev) => [
          ...prev,
          {
            id_barang: newProduct.id_barang,
            name: newProduct.nama_barang,
            quantity: newProduct.stok,
            price: newProduct.harga_jual
          }
        ]);
      }
      setOpenDialog(false);
      // Fix UI bug: reload page after save to refresh UI properly
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteProduct = async (id_barang) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:8000/toko-kyu-ryu/api/products/${id_barang}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        setProducts((prev) => prev.filter((product) => product.id_barang !== id_barang));
      } catch (error) {
        alert(error.message);
      }
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
                label="Cari berdasarkan Nama / ID Barang"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={loading}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                  <TableCell>ID Barang</TableCell>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Jumlah Stok</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <TableRow key={product.id_barang ?? index}>
                        <TableCell>{product.id_barang}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteProduct(product.id_barang)}>
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

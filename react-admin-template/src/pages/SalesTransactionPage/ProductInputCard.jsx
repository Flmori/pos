import React from 'react';
import { Card, CardHeader, CardContent, Divider, TextField, Box, Typography, Button } from '@mui/material';

const ProductInputCard = ({
  productInput,
  filteredProducts,
  selectedProduct,
  onProductInputChange,
  onSelectProduct,
  onAddToCart
}) => {
  return (
    <Card>
      <CardHeader title="Input Barang" />
      <Divider />
      <CardContent>
        <TextField
          label="Masukkan Nama Barang"
          variant="outlined"
          fullWidth
          value={productInput}
          onChange={onProductInputChange}
          autoComplete="off"
        />
        {productInput && filteredProducts.length > 0 && (
          <Box sx={{ border: '1px solid #ccc', maxHeight: 200, overflowY: 'auto', mt: 1 }}>
            {filteredProducts.map((product) => (
              <Box
                key={product.id}
                sx={{ p: 1, cursor: 'pointer', '&:hover': { backgroundColor: '#eee' } }}
                onClick={() => onSelectProduct(product)}
              >
                {product.code} - {product.name}
              </Box>
            ))}
          </Box>
        )}
        {selectedProduct && (
          <Box sx={{ mt: 2, p: 1, border: '1px solid #ccc' }}>
            <Typography>Nama: {selectedProduct.name}</Typography>
            <Typography>Harga per Unit: Rp {selectedProduct.price.toLocaleString()}</Typography>
            <Typography>Stok Tersedia: {selectedProduct.stock}</Typography>
            <Button variant="contained" sx={{ mt: 1 }} onClick={onAddToCart}>
              Tambah ke Keranjang
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductInputCard;

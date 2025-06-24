import React from 'react';
import { Grid, Card, CardContent, Typography, Button, CardMedia } from '@mui/material';

const ProductMenuGrid = ({ products, onAddProduct }) => {
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={4} key={product.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
            {product.image && (
              <CardMedia component="img" height="140" image={product.image} alt={product.name} />
            )}
            <CardContent sx={{ flexGrow: 1, p: 1 }}>
              <Typography variant="subtitle1">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Rp {product.price.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: product.stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}
              >
                {product.stock > 0 ? 'Tersedia' : 'Habis'}
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => onAddProduct(product)}
                disabled={product.stock === 0}
              >
                Tambah ke Keranjang
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductMenuGrid;

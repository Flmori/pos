import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartListCard = ({
  cartItems,
  onQuantityChange,
  onRemoveItem
}) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title="Daftar Item Penjualan (Keranjang)" />
      <Divider />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Barang</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Harga per Unit</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button onClick={() => onQuantityChange(item.id, -1)}>-</Button>
                    {item.quantity}
                    <Button onClick={() => onQuantityChange(item.id, 1)}>+</Button>
                  </TableCell>
                  <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                  <TableCell>Rp {(item.price * item.quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => onRemoveItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {cartItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Keranjang kosong.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default CartListCard;

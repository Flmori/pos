import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Paper,
  Grid
} from '@mui/material';

const SalesDocumentCard = ({
  city,
  transactionDate,
  customerName,
  invoiceNumber,
  items,
  totalPrice,
  discount,
  totalPayable,
  amountPaid,
  change,
  cashierName
}) => {
  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          NOTA PENJUALAN
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          MENJUAL... Sedian... JL... Telp...
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>{city}, {transactionDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Nomor Nota:</strong> NOTA No. {invoiceNumber}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Kepada Yth,</strong> {customerName || 'Pelanggan Umum'}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Detail Item Penjualan Table */}
      <TableContainer>
        <Table size="small" aria-label="detail item penjualan">
          <TableHead>
            <TableRow>
              <TableCell>Banyaknya</TableCell>
              <TableCell>Nama Barang</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Jumlah</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{item.jumlah_barang || item.quantity || 0}</TableCell>
                  <TableCell>{item.nama_barang || item.name || '-'}</TableCell>
                  <TableCell>{item.harga_per_unit !== undefined ? item.harga_per_unit : item.price || 0}</TableCell>
                  <TableCell>{item.subtotal_item !== undefined ? item.subtotal_item : (item.price || 0) * (item.quantity || 0)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Tidak ada data item penjualan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Ringkasan Pembayaran */}
      <Box sx={{ mb: 2 }}>
        <Typography><strong>TOTAL:</strong> {totalPayable}</Typography>
        {discount !== undefined && discount > 0 && (
          <>
            <Typography>Total Harga (Bruto): {totalPrice}</Typography>
            <Typography>Diskon: {discount}</Typography>
          </>
        )}
        <Typography>Jumlah Bayar: {amountPaid}</Typography>
        <Typography>Kembalian: {change}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Catatan Kaki & Tanda Tangan */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={6} sx={{ textAlign: 'center' }}>
            <Typography><strong>Penerima,</strong></Typography>
            <Box sx={{ mt: 8, borderBottom: '1px solid black', mx: 4 }} />
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'center' }}>
            <Typography><strong>Hormat Kami,</strong></Typography>
            <Typography>{cashierName || 'Nama Toko KyuRyu'}</Typography>
            <Box sx={{ mt: 8, borderBottom: '1px solid black', mx: 4 }} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SalesDocumentCard;

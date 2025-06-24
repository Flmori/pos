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

const ReceivingDocumentCard = ({
  documentNumber,
  date,
  supplierName,
  reference,
  items,
  notes,
  deliveredBy,
  receivedBy,
  approvedBy
}) => {
  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          BUKTI PENERIMAAN BARANG
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><strong>Tanggal:</strong> {date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Nomor Bukti:</strong> {documentNumber}</Typography>
          </Grid>
          {supplierName && (
            <Grid item xs={6}>
              <Typography><strong>Terima Dari:</strong> {supplierName}</Typography>
            </Grid>
          )}
          {reference && (
            <Grid item xs={6}>
              <Typography><strong>Referensi:</strong> {reference}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Detail Item Penerimaan Table */}
      <TableContainer>
        <Table size="small" aria-label="detail item penerimaan">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Kode Barang</TableCell>
              <TableCell>Nama Barang</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Keterangan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={item.id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.kode_barang || '-'}</TableCell>
                  <TableCell>{item.nama_barang || '-'}</TableCell>
                  <TableCell>{item.jumlah_diterima || item.quantity || 0}</TableCell>
                  <TableCell>{item.kondisi_barang || item.condition || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Tidak ada data item penerimaan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Catatan & Persetujuan */}
      <Box>
        <Typography><strong>Catatan:</strong> {notes && notes.trim() !== '' ? notes : 'sudah diterima'}</Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography><strong>Diserahkan oleh:</strong></Typography>
            <Box sx={{ mt: 8, borderBottom: '1px solid black', mx: 2 }} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography><strong>Diterima oleh:</strong></Typography>
            <Typography>{receivedBy || '-'}</Typography>
            <Box sx={{ mt: 8, borderBottom: '1px solid black', mx: 2 }} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Typography><strong>Mengetahui:</strong></Typography>
            <Box sx={{ mt: 8, borderBottom: '1px solid black', mx: 2 }} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ReceivingDocumentCard;

import React, { useState, useRef } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

import ReceivingDocumentCard from './ReceivingDocumentCard';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addPdfHeaderReceiving } from 'layout/PdfHeader/PdfHeader.jsx';

// ==============================|| RECEIVING TRANSACTION PAGE ||============================== //

const mockScannedData = {
  documentNumber: 'PNR-20230601-001',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toLocaleTimeString(),
  supplierName: 'Supplier ABC',
  reference: 'REF-20230601-XYZ',
  items: [
    { id: 1, kode_barang: 'KB001', nama_barang: 'Produk A', jumlah_diterima: 10, kondisi_barang: 'Baik' },
    { id: 2, kode_barang: 'KB002', nama_barang: 'Produk B', jumlah_diterima: 5, kondisi_barang: 'Baik' }
  ],
  notes: 'Pengiriman dalam kondisi baik.',
  receivedBy: 'Nama Pegawai Gudang'
};

const ReceivingTransactionPage = () => {
  const [scannedData, setScannedData] = useState(null);
  const [transactionSaved, setTransactionSaved] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const printRef = useRef(null);

  const handleScanQRCode = () => {
    // Simulate scanning QR code and loading data
    setScannedData(mockScannedData);
    setTransactionSaved(false);
  };

  const handleVerifyAndSave = () => {
    if (!scannedData) {
      alert('Belum ada data penerimaan.');
      return;
    }
    // Simulate saving transaction and updating stock
    setTransactionSaved(true);
    alert('Penerimaan berhasil diverifikasi dan disimpan.');
  };

  const handlePrintDocument = () => {
    setPrintDialogOpen(true);
  };

  const handleCancel = () => {
    if (window.confirm('Batalkan transaksi penerimaan?')) {
      setScannedData(null);
      setTransactionSaved(false);
    }
  };

  const handleClosePrintDialog = () => {
    setPrintDialogOpen(false);
  };

  const handlePrintPDF = async () => {
    if (!printRef.current) return;
    html2canvas(printRef.current, { scale: 2 }).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add header
      await addPdfHeaderReceiving(pdf);

      // Add image below header
      pdf.addImage(imgData, 'PNG', 0, 44, pdfWidth, pdfHeight);

      pdf.save(`Dokumen_Penerimaan_${scannedData.documentNumber}.pdf`);
    });
  };

  return (
    <>
      <Breadcrumb title="Transaksi Penerimaan Barang">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Transaksi Penerimaan Barang
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Transaksi Penerimaan Barang" />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography>No Dok. Penerimaan: {scannedData ? scannedData.documentNumber : 'Otomatis'}</Typography>
                <Typography>Tanggal: {scannedData ? scannedData.date : 'Otomatis'}</Typography>
                <Typography>Waktu: {scannedData ? scannedData.time : 'Otomatis'}</Typography>
              </Box>
              <Button variant="contained" onClick={handleScanQRCode}>
                Scan QR Code Penerimaan
              </Button>
              {scannedData && (
                <>
                  <TableContainer sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nama Barang</TableCell>
                          <TableCell>Jumlah Diterima</TableCell>
                          <TableCell>Kondisi Barang</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scannedData.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.nama_barang || item.name}</TableCell>
                            <TableCell>{item.jumlah_diterima || item.quantity}</TableCell>
                            <TableCell>{item.kondisi_barang || item.condition}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ mt: 2 }}>
                    <Typography>Catatan Penerimaan:</Typography>
                    <Typography>{scannedData.notes}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleVerifyAndSave} disabled={transactionSaved}>
                      Verifikasi dan Simpan Penerimaan
                    </Button>
                    {transactionSaved && (
                      <Button variant="outlined" sx={{ ml: 2 }} onClick={handlePrintDocument}>
                        Cetak Dokumen Penerimaan
                      </Button>
                    )}
                    <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={handleCancel}>
                      Batal
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={printDialogOpen} onClose={handleClosePrintDialog} maxWidth="md" fullWidth>
        <DialogTitle>Dokumen Penerimaan Barang</DialogTitle>
        <DialogContent dividers>
          {scannedData && (
            <div ref={printRef}>
              <ReceivingDocumentCard
                documentNumber={scannedData.documentNumber}
                date={scannedData.date}
                supplierName={scannedData.supplierName}
                reference={scannedData.reference}
                items={scannedData.items}
                notes={scannedData.notes}
                receivedBy={scannedData.receivedBy}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrintDialog} color="primary">
            Tutup
          </Button>
          <Button onClick={handlePrintPDF} color="primary" variant="contained">
            Cetak PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceivingTransactionPage;

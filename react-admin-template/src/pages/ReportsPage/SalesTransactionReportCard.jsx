import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Stack
} from '@mui/material';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addPdfHeaderReceiving } from 'layout/PdfHeader/PdfHeader.jsx';

const SalesTransactionReportCard = ({ salesData, categories }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [selectedMemberStatus, setSelectedMemberStatus] = useState('');
  const [filteredSales, setFilteredSales] = useState(salesData);

  useEffect(() => {
    let filtered = salesData;

    if (fromDate) {
      filtered = filtered.filter(sale => new Date(sale.tanggal_transaksi) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(sale => new Date(sale.tanggal_transaksi) <= new Date(toDate));
    }
    if (selectedCategory) {
      filtered = filtered.filter(sale => sale.kategori_produk_terbanyak === selectedCategory);
    }
    if (selectedPaymentType) {
      filtered = filtered.filter(sale => sale.tipe_pembayaran === selectedPaymentType);
    }
    if (selectedMemberStatus) {
      if (selectedMemberStatus === 'Member') {
        filtered = filtered.filter(sale => sale.status_member === 'Member');
      } else if (selectedMemberStatus === 'Non-Member') {
        filtered = filtered.filter(sale => sale.status_member === 'Non-Member');
      }
    }

    setFilteredSales(filtered);
  }, [salesData, fromDate, toDate, selectedCategory, selectedPaymentType, selectedMemberStatus]);

  const handleExportExcel = () => {
    try {
      // Prepare title row
      const title = ['Laporan Transaksi Penjualan'];

      // Prepare header row with numbering column
      const headers = ['No', 'Tanggal & Waktu Transaksi', 'Nomor Nota/Invoice', 'Kasir', 'Pelanggan/Member', 'Kategori Produk Terbanyak', 'Total Penjualan (Final)', 'Jumlah Diskon', 'Tipe Pembayaran'];

      // Prepare data rows with numbering
      const dataRows = filteredSales.map((sale, index) => [
        index + 1,
        sale.tanggal_transaksi,
        sale.nomor_invoice,
        sale.kasir,
        sale.pelanggan || 'Umum',
        sale.kategori_produk_terbanyak || 'Semua Kategori',
        sale.total_bayar,
        sale.jumlah_diskon,
        sale.tipe_pembayaran
      ]);

      // Combine title, headers and data rows
      const worksheetData = [title, headers, ...dataRows];

      // Create worksheet from array of arrays
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Merge title row cells across all columns (A1:I1)
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

      // Set alignment and border for title row (center, bold, size 14, border all sides)
      worksheet['A1'].s = {
        alignment: { horizontal: 'center', vertical: 'center' },
        font: { bold: true, sz: 14 },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      };

      // Set column widths based on max length of content in each column
      const colWidths = headers.map((header, colIndex) => {
        // Get max length of content in this column (including title and data)
        const maxLength = Math.max(
          header.length,
          ...dataRows.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
        );
        // Approximate width: 1 character ~ 1.2 width unit, min 10, max 30
        return { wch: Math.min(Math.max(maxLength * 1.2, 10), 30) };
      });
      worksheet['!cols'] = colWidths;

      // Apply borders to header row (no fill color)
      for (let col = 0; col < headers.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: { bold: true }
        };
      }

      // Apply borders and white background to data cells and title row (no fill color)
      for (let row = 1; row < worksheetData.length; row++) {
        for (let col = 0; col < headers.length; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            fill: { fgColor: { rgb: 'FFFFFF' } }, // white background
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };
        }
      }

      // Create workbook and append worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Transaksi Penjualan');

      // Write workbook to binary string with cellStyles enabled
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary', cellStyles: true });

      // Convert binary string to array buffer
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

      // Save file using FileSaver.js
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Laporan_Transaksi_Penjualan.xlsx');
    } catch (error) {
      alert('Gagal mengekspor ke Excel: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    const input = document.getElementById('sales-report-table');
    if (!input) {
      alert('Tabel laporan tidak ditemukan untuk ekspor PDF.');
      return;
    }
    html2canvas(input, { scale: 2 }).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add header
      await addPdfHeaderReceiving(pdf);

      // Remove explicit title here to let title be part of captured content

      // Add image below header
      pdf.addImage(imgData, 'PNG', 0, 44, pdfWidth, pdfHeight);

      pdf.save('Laporan_Transaksi_Penjualan.pdf');
    }).catch(error => {
      alert('Gagal mengekspor ke PDF: ' + error.message);
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laporan Transaksi Penjualan
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Dari Tanggal"
            type="date"
            fullWidth
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Sampai Tanggal"
            type="date"
            fullWidth
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filter Kategori Produk"
            fullWidth
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filter Tipe Pembayaran"
            fullWidth
            value={selectedPaymentType}
            onChange={e => setSelectedPaymentType(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Tunai">Tunai</MenuItem>
            <MenuItem value="Kredit">Kredit</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Filter Status Member"
            fullWidth
            value={selectedMemberStatus}
            onChange={e => setSelectedMemberStatus(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Non-Member">Non-Member</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <TableContainer id="sales-report-table">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Laporan Transaksi Penjualan
          </Typography>
        </Box>
        <Table size="small" aria-label="laporan transaksi penjualan">
          <TableHead>
            <TableRow>
              <TableCell>Tanggal & Waktu Transaksi</TableCell>
              <TableCell>Nomor Nota/Invoice</TableCell>
              <TableCell>Kasir</TableCell>
              <TableCell>Pelanggan/Member</TableCell>
              <TableCell>Kategori Produk Terbanyak</TableCell>
              <TableCell>Total Penjualan (Final)</TableCell>
              <TableCell>Jumlah Diskon</TableCell>
              <TableCell>Tipe Pembayaran</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map(sale => (
                <TableRow key={sale.nomor_invoice}>
                  <TableCell>{sale.tanggal_transaksi}</TableCell>
                  <TableCell>{sale.nomor_invoice}</TableCell>
                  <TableCell>{sale.kasir}</TableCell>
                  <TableCell>{sale.pelanggan || 'Umum'}</TableCell>
                  <TableCell>{sale.kategori_produk_terbanyak || 'Semua Kategori'}</TableCell>
                  <TableCell>{sale.total_bayar}</TableCell>
                  <TableCell>{sale.jumlah_diskon}</TableCell>
                  <TableCell>{sale.tipe_pembayaran}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => handleExportExcel()} type="button">
          Export ke Excel
        </Button>
        <Button variant="contained" onClick={() => handleExportPDF()} type="button">
          Export ke PDF
        </Button>
      </Stack>
    </Paper>
  );
};

export default SalesTransactionReportCard;

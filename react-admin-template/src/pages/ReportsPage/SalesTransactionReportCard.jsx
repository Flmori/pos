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
  Button,
  Stack
} from '@mui/material';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addPdfHeaderReceiving } from 'layout/PdfHeader/PdfHeader.jsx';

const SalesTransactionReportCard = ({ salesData }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredSales, setFilteredSales] = useState(salesData);

  useEffect(() => {
    let filtered = salesData;

    if (fromDate) {
      filtered = filtered.filter(sale => new Date(sale.created_at) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(sale => new Date(sale.created_at) <= new Date(toDate));
    }

    setFilteredSales(filtered);
  }, [salesData, fromDate, toDate]);

  const handleExportExcel = () => {
    try {
      const title = ['Laporan Detail Transaksi Penjualan'];
      const headers = ['No', 'ID Penjualan', 'Nomor Nota/Invoice', 'ID Barang', 'Jumlah Barang', 'Harga Per Unit', 'Subtotal Item', 'Tanggal Transaksi'];
      const dataRows = filteredSales.map((sale, index) => [
        index + 1,
        sale.id_penjualan,
        sale.no_nota,
        sale.id_barang,
        sale.jumlah_barang,
        sale.harga_per_unit,
        sale.total_bayar,
        sale.tanggal_transaksi,
      ]);
      const worksheetData = [title, headers, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
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
      const colWidths = headers.map((header, colIndex) => {
        const maxLength = Math.max(
          header.length,
          ...dataRows.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
        );
        return { wch: Math.min(Math.max(maxLength * 1.2, 10), 30) };
      });
      worksheet['!cols'] = colWidths;
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
      for (let row = 1; row < worksheetData.length; row++) {
        for (let col = 0; col < headers.length; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            fill: { fgColor: { rgb: 'FFFFFF' } },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };
        }
      }
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Transaksi Penjualan');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary', cellStyles: true });
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Laporan_Detail_Transaksi_Penjualan.xlsx');
    } catch (error) {
      alert('Gagal mengekspor ke Excel: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    const rowsPerPage = 25;
    const totalRows = filteredSales.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const generatePage = async (pageIndex) => {
      const pageData = filteredSales.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
      const tempTable = document.createElement('table');
      tempTable.style.width = '100%';
      tempTable.style.borderCollapse = 'collapse';
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['ID Penjualan', 'Nomor Nota/Invoice', 'ID Barang', 'Jumlah Barang', 'Harga Per Unit', 'Subtotal Item', 'Tanggal Transaksi'].forEach(text => {
        const th = document.createElement('th');
        th.style.border = '1px solid black';
        th.style.padding = '4px';
        th.style.fontWeight = 'bold';
        th.textContent = text;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      tempTable.appendChild(thead);
      const tbody = document.createElement('tbody');
      pageData.forEach(sale => {
        const row = document.createElement('tr');
        [sale.id_penjualan, sale.no_nota, sale.id_barang, sale.jumlah_barang, sale.harga_per_unit, sale.total_bayar, sale.tanggal_transaksi].forEach(text => {
          const td = document.createElement('td');
          td.style.border = '1px solid black';
          td.style.padding = '4px';
          td.textContent = text ?? '';
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      tempTable.appendChild(tbody);
      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      const titleElement = document.createElement('div');
      titleElement.style.textAlign = 'center';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.fontSize = '18px';
      titleElement.style.marginBottom = '12px';
      titleElement.textContent = 'Laporan Detail Transaksi Penjualan';
      container.appendChild(titleElement);
      container.appendChild(tempTable);
      document.body.appendChild(container);
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: true, windowWidth: container.scrollWidth, windowHeight: container.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      document.body.removeChild(container);
      await addPdfHeaderReceiving(pdf);
      pdf.addImage(imgData, 'PNG', 0, 44, pdfWidth, pdfHeight);
      if (pageIndex < totalPages - 1) {
        pdf.addPage();
      }
    };
    (async () => {
      for (let i = 0; i < totalPages; i++) {
        await generatePage(i);
      }
      pdf.save('Laporan_Detail_Transaksi_Penjualan.pdf');
    })().catch(error => {
      alert('Gagal mengekspor ke PDF: ' + (error?.message ?? error));
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laporan Detail Transaksi Penjualan
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Dari Tanggal"
            type="date"
            fullWidth
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Sampai Tanggal"
            type="date"
            fullWidth
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <TableContainer id="sales-report-table">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Laporan Detail Transaksi Penjualan
          </Typography>
        </Box>
        <Table size="small" aria-label="laporan detail transaksi penjualan">
          <TableHead>
            <TableRow>
              <TableCell>ID Penjualan</TableCell>
              <TableCell>Nomor Nota/Invoice</TableCell>
              <TableCell>ID Barang</TableCell>
              <TableCell>Jumlah Barang</TableCell>
              <TableCell>Harga Per Unit</TableCell>
              <TableCell>Subtotal Item</TableCell>
              <TableCell>Tanggal Transaksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.length > 0 ? (
              filteredSales.map(sale => (
                <TableRow key={`${sale.id_penjualan}-${sale.id_barang}`}>
              <TableCell>{sale.id_penjualan}</TableCell>
              <TableCell>{sale.no_nota}</TableCell>
              <TableCell>{sale.id_barang}</TableCell>
              <TableCell>{sale.jumlah_barang}</TableCell>
              <TableCell>{sale.harga_per_unit}</TableCell>
              <TableCell>{sale.total_bayar}</TableCell>
              <TableCell>{sale.tanggal_transaksi}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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

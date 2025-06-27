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

const ReceivingTransactionReportCard = () => {
  const [receivingData, setReceivingData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/toko-kyu-ryu/api/receiving-transactions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReceivingData(data);

        // Extract unique employees and conditions for filters
        const uniqueEmployees = Array.from(new Set(data.map(item => item.nama_pegawai_gudang))).filter(Boolean);
        const uniqueConditions = Array.from(new Set(data.map(item => item.kondisi_barang))).filter(Boolean);

        setEmployees(uniqueEmployees);
        setConditions(uniqueConditions);
      } catch (error) {
        console.error('Failed to fetch receiving transactions:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = receivingData;

    if (fromDate) {
      filtered = filtered.filter(item => new Date(item.tanggal_penerimaan) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(item => new Date(item.tanggal_penerimaan) <= new Date(toDate));
    }
    if (selectedEmployee) {
      filtered = filtered.filter(item => item.nama_pegawai_gudang === selectedEmployee);
    }
    if (selectedCondition) {
      filtered = filtered.filter(item => item.kondisi_barang === selectedCondition);
    }

    setFilteredData(filtered);
  }, [receivingData, fromDate, toDate, selectedEmployee, selectedCondition]);

  const handleExportExcel = () => {
    try {
      // Prepare title row
      const title = ['Laporan Transaksi Penerimaan Barang'];

      // Prepare header row with numbering column
      const headers = ['No', 'Tanggal & Waktu Penerimaan', 'Nomor Dokumen Penerimaan', 'Pegawai Pencatat', 'Nama Produk', 'Jumlah Diterima', 'Kondisi Barang', 'Catatan'];

      // Prepare data rows with numbering
      const dataRows = filteredData.map((item, index) => [
        index + 1,
        item.tanggal_penerimaan,
        item.nomor_dokumen_penerimaan,
        item.pegawai_pencatat,
        item.nama_produk,
        item.jumlah_diterima,
        item.kondisi_barang,
        item.catatan
      ]);

      // Combine title, headers and data rows
      const worksheetData = [title, headers, ...dataRows];

      // Create worksheet from array of arrays
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Merge title row cells across all columns (A1:H1)
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Transaksi Penerimaan');

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
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Laporan_Transaksi_Penerimaan.xlsx');
    } catch (error) {
      alert('Gagal mengekspor ke Excel: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    const rowsPerPage = 25;
    const totalRows = filteredData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const generatePage = async (pageIndex) => {
      // Slice the data for the current page
      const pageData = filteredData.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

      // Create a temporary table element for the page data
      const tempTable = document.createElement('table');
      tempTable.style.width = '100%';
      tempTable.style.borderCollapse = 'collapse';

      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Tanggal & Waktu Penerimaan', 'Nomor Dokumen Penerimaan', 'Pegawai Pencatat', 'Nama Produk', 'Jumlah Diterima', 'Kondisi Barang', 'Catatan'].forEach(text => {
        const th = document.createElement('th');
        th.style.border = '1px solid black';
        th.style.padding = '4px';
        th.style.fontWeight = 'bold';
        th.textContent = text;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      tempTable.appendChild(thead);

      // Create table body
      const tbody = document.createElement('tbody');
      pageData.forEach(item => {
        const row = document.createElement('tr');
        [item.tanggal_penerimaan, item.nomor_dokumen_penerimaan, item.pegawai_pencatat, item.nama_produk, item.jumlah_diterima, item.kondisi_barang, item.catatan].forEach(text => {
          const td = document.createElement('td');
          td.style.border = '1px solid black';
          td.style.padding = '4px';
          td.textContent = text ?? '';
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      tempTable.appendChild(tbody);

      // Append the table to a container div
      const container = document.createElement('div');
      container.style.width = '210mm'; // A4 width
      container.style.position = 'fixed'; // Fix position to avoid layout shift
      container.style.left = '-9999px'; // Move offscreen
      container.style.top = '0';

      // Create and append title element
      const titleElement = document.createElement('div');
      titleElement.style.textAlign = 'center';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.fontSize = '18px';
      titleElement.style.marginBottom = '12px';
      titleElement.textContent = 'Laporan Transaksi Penerimaan Barang';
      container.appendChild(titleElement);

      container.appendChild(tempTable);

      // Append container temporarily to the document body to fix html2canvas error
      document.body.appendChild(container);

      // Render the container to canvas
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, logging: true, windowWidth: container.scrollWidth, windowHeight: container.scrollHeight });
      const imgData = canvas.toDataURL('image/png');
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Remove the container from the document after rendering
      document.body.removeChild(container);

      // Add header
      await addPdfHeaderReceiving(pdf);

      // Add image
      pdf.addImage(imgData, 'PNG', 0, 44, pdfWidth, pdfHeight);

      if (pageIndex < totalPages - 1) {
        pdf.addPage();
      }
    };

    (async () => {
      for (let i = 0; i < totalPages; i++) {
        await generatePage(i);
      }
      pdf.save('Laporan_Transaksi_Penerimaan.pdf');
    })().catch(error => {
      alert('Gagal mengekspor ke PDF: ' + (error?.message ?? error));
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laporan Transaksi Penerimaan Barang
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
        <Grid item xs={12} sm={3}>
          <TextField
            label="Sampai Tanggal"
            type="date"
            fullWidth
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Filter Pegawai Gudang"
            fullWidth
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            {employees.map(emp => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Filter Kondisi Barang"
            fullWidth
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            {conditions.map(cond => (
              <MenuItem key={cond} value={cond}>
                {cond}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer id="receiving-report-table" sx={{ overflowX: 'auto' }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Laporan Transaksi Penerimaan Barang
          </Typography>
        </Box>
        <Table size="small" aria-label="laporan transaksi penerimaan barang">
          <TableHead>
            <TableRow>
              <TableCell>Tanggal & Waktu Penerimaan</TableCell>
              <TableCell>Nomor Dokumen Penerimaan</TableCell>
              <TableCell>Pegawai Pencatat</TableCell>
              <TableCell>Nama Produk</TableCell>
              <TableCell>Jumlah Diterima</TableCell>
              <TableCell>Kondisi Barang</TableCell>
              <TableCell>Catatan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={`${item.nomor_dokumen_penerimaan}-${index}`}>
                  <TableCell>{item.tanggal_penerimaan}</TableCell>
                  <TableCell>{item.nomor_dokumen_penerimaan}</TableCell>
                  <TableCell>{item.pegawai_pencatat}</TableCell>
                  <TableCell>{item.nama_produk}</TableCell>
                  <TableCell>{item.jumlah_diterima}</TableCell>
                  <TableCell>{item.kondisi_barang}</TableCell>
                  <TableCell>{item.catatan}</TableCell>
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

export default ReceivingTransactionReportCard;

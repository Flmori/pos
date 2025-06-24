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

const DailyCustomerCountReportCard = ({ customerData }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMemberStatus, setSelectedMemberStatus] = useState('');
  const [filteredData, setFilteredData] = useState(customerData);

  useEffect(() => {
    let filtered = customerData;

    if (fromDate) {
      filtered = filtered.filter(item => new Date(item.tgl_daftar_member) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(item => new Date(item.tgl_daftar_member) <= new Date(toDate));
    }
    if (selectedMemberStatus) {
      if (selectedMemberStatus === 'Member Baru') {
        filtered = filtered.filter(item => item.is_member === true);
      } else if (selectedMemberStatus === 'Non-Member') {
        filtered = filtered.filter(item => item.is_member === false);
      }
    }

    setFilteredData(filtered);
  }, [customerData, fromDate, toDate, selectedMemberStatus]);

  // Aggregate counts per date
  const countsByDate = filteredData.reduce((acc, item) => {
    const date = item.tgl_daftar_member;
    if (!acc[date]) {
      acc[date] = { total: 0, member: 0 };
    }
    acc[date].total += 1;
    if (item.is_member) {
      acc[date].member += 1;
    }
    return acc;
  }, {});

  const dates = Object.keys(countsByDate).sort();

  const handleExportExcel = () => {
    try {
      // Prepare title row
      const title = ['Laporan Jumlah Pelanggan per Hari'];

      // Prepare header row with numbering column
      const headers = ['No', 'Tanggal', 'Jumlah Pelanggan Baru', 'Jumlah Member Baru'];

      // Prepare data rows with numbering
      const dataRows = dates.map((date, index) => [
        index + 1,
        date,
        countsByDate[date].total,
        countsByDate[date].member
      ]);

      // Combine title, headers and data rows
      const worksheetData = [title, headers, ...dataRows];

      // Create worksheet from array of arrays
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Merge title row cells across all columns (A1:D1)
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Jumlah Pelanggan per Hari');

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
      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Laporan_Jumlah_Pelanggan_per_Hari.xlsx');
    } catch (error) {
      alert('Gagal mengekspor ke Excel: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    const input = document.getElementById('daily-customer-count-report-table');
    if (!input) {
      alert('Tabel laporan tidak ditemukan untuk ekspor PDF.');
      return;
    }
    html2canvas(input).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add header
      await addPdfHeaderReceiving(pdf);

      // Add image below header
      pdf.addImage(imgData, 'PNG', 0, 44, pdfWidth, pdfHeight);

      pdf.save('Laporan_Jumlah_Pelanggan_per_Hari.pdf');
    }).catch(error => {
      alert('Gagal mengekspor ke PDF: ' + error.message);
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laporan Jumlah Pelanggan per Hari
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
            label="Filter Status Member"
            fullWidth
            value={selectedMemberStatus}
            onChange={e => setSelectedMemberStatus(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Member Baru">Member Baru</MenuItem>
            <MenuItem value="Non-Member">Non-Member</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <TableContainer id="daily-customer-count-report-table">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Laporan Jumlah Pelanggan per Hari
          </Typography>
        </Box>
        <Table size="small" aria-label="laporan jumlah pelanggan per hari">
          <TableHead>
            <TableRow>
              <TableCell>Tanggal</TableCell>
              <TableCell>Jumlah Pelanggan Baru</TableCell>
              <TableCell>Jumlah Member Baru</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dates.length > 0 ? (
              dates.map(date => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{countsByDate[date].total}</TableCell>
                  <TableCell>{countsByDate[date].member}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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

export default DailyCustomerCountReportCard;


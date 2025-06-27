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
    console.log('customerData:', customerData);
    let filtered = customerData;

    if (fromDate) {
      filtered = filtered.filter(item => {
        if (!item.tgl_daftar_member) return false;
        return new Date(item.tgl_daftar_member) >= new Date(fromDate);
      });
    }
    if (toDate) {
      filtered = filtered.filter(item => {
        if (!item.tgl_daftar_member) return false;
        return new Date(item.tgl_daftar_member) <= new Date(toDate);
      });
    }
    if (selectedMemberStatus) {
      if (selectedMemberStatus === 'Member Baru') {
        filtered = filtered.filter(item => item.is_member === true);
      } else if (selectedMemberStatus === 'Non-Member') {
        filtered = filtered.filter(item => item.is_member === false);
      }
    }

    console.log('filteredData:', filtered);
    setFilteredData(filtered);
  }, [customerData, fromDate, toDate, selectedMemberStatus]);

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d)) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Aggregate counts per date with formatted date keys
  const countsByDate = filteredData.reduce((acc, item) => {
    const date = formatDate(item.tgl_daftar_member);
    if (!date) return acc; // skip if no valid date
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Pelanggan');

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
    const rowsPerPage = 25;
    const totalRows = dates.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const generatePage = async (pageIndex) => {
      // Slice the data for the current page
      const pageDates = dates.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

      // Create a temporary table element for the page data
      const tempTable = document.createElement('table');
      tempTable.style.width = '100%';
      tempTable.style.borderCollapse = 'collapse';

      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Tanggal', 'Jumlah Pelanggan Baru', 'Jumlah Member Baru'].forEach(text => {
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
      pageDates.forEach(date => {
        const row = document.createElement('tr');
        [date, countsByDate[date].total, countsByDate[date].member].forEach(text => {
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
      titleElement.textContent = 'Laporan Jumlah Pelanggan per Hari';
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
      pdf.save('Laporan_Jumlah_Pelanggan_per_Hari.pdf');
    })().catch(error => {
      alert('Gagal mengekspor ke PDF: ' + (error?.message ?? error));
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


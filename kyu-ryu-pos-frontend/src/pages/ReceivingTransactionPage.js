import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Button from '../components/common/Button/Button';
import Table from '../components/common/Table/Table';

const ReceivingTransactionPage = () => {
  const [documentNumber] = useState('PNR-20230601-001');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [time] = useState(new Date().toLocaleTimeString());
  const [scannedItems, setScannedItems] = useState([]);
  const [notes, setNotes] = useState('');

  const handleScanQRCode = () => {
    // Dummy scan result for demonstration
    const scannedData = [
      { id: 1, name: 'Kopi Arabika', quantity: 10, condition: 'Baik' },
      { id: 2, name: 'Roti Tawar', quantity: 5, condition: 'Baik' },
    ];
    setScannedItems(scannedData);
    setNotes('Barang diterima dalam kondisi baik.');
  };

  const handleVerifyAndSave = () => {
    alert('Penerimaan diverifikasi dan disimpan.');
    // Implement save logic here
  };

  const handlePrintDocument = () => {
    alert('Mencetak dokumen penerimaan.');
    // Implement print logic here
  };

  const handleCancel = () => {
    setScannedItems([]);
    setNotes('');
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="receiving-transaction-page">
          <h1>Transaksi Penerimaan Barang</h1>
          <div className="info-otomatis">
            <p>No Dok. Penerimaan: {documentNumber}</p>
            <p>Tanggal: {date}</p>
            <p>Waktu: {time}</p>
          </div>
          <Button onClick={handleScanQRCode}>Scan QR Code Penerimaan</Button>
          {scannedItems.length > 0 && (
            <>
              <Table>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Jumlah Diterima</th>
                    <th>Kondisi Barang</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="catatan-penerimaan">
                <p>Catatan Penerimaan: {notes}</p>
              </div>
              <div className="tombol-aksi">
                <Button onClick={handleVerifyAndSave}>Verifikasi dan Simpan Penerimaan</Button>
                <Button onClick={handlePrintDocument}>Cetak Dokumen Penerimaan</Button>
                <Button onClick={handleCancel}>Batal</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceivingTransactionPage;

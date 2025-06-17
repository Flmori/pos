import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Input from '../components/common/Input/Input';
import Button from '../components/common/Button/Button';
import Table from '../components/common/Table/Table';
import SaleItemRow from '../components/sales/SaleItemRow';

const paymentTypes = ['Tunai', 'Kredit'];

const SalesTransactionPage = () => {
  const [productInput, setProductInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState('Tunai');
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);

  // Dummy product list for auto-suggest
  const products = [
    { id: 1, name: 'Kopi Arabika', price: 25000, stock: 10 },
    { id: 2, name: 'Roti Tawar', price: 15000, stock: 5 },
  ];

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const existingItem = cartItems.find(item => item.id === selectedProduct.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...selectedProduct, quantity: 1 }]);
    }
    setProductInput('');
    setSelectedProduct(null);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAfterDiscount = totalPrice - discount;
  const calculatedChange = paymentType === 'Tunai' ? (amountPaid - totalAfterDiscount) : 0;

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    if (e.target.value !== 'Tunai') {
      setAmountPaid('');
      setChange(0);
    }
  };

  const handleAmountPaidChange = (e) => {
    const value = Number(e.target.value);
    setAmountPaid(value);
    setChange(value - totalAfterDiscount);
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="sales-transaction-page">
          <h1>Transaksi Penjualan</h1>
          <section className="input-barang">
            <Input
              type="text"
              placeholder="Scan Kode Barang / Masukkan Nama Barang"
              value={productInput}
              onChange={(e) => {
                setProductInput(e.target.value);
                const found = products.find(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()));
                setSelectedProduct(found || null);
              }}
            />
            <Button onClick={handleAddToCart}>Tambah</Button>
            {selectedProduct && (
              <div className="product-details">
                <p>Nama: {selectedProduct.name}</p>
                <p>Harga per Unit: Rp {selectedProduct.price.toLocaleString()}</p>
                <p>Stok Tersedia: {selectedProduct.stock}</p>
              </div>
            )}
          </section>
          <section className="keranjang-penjualan">
            <h2>Daftar Item Penjualan</h2>
            <Table>
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Harga per Unit</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <SaleItemRow
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={() => handleQuantityChange(item.id, 0)}
                  />
                ))}
              </tbody>
            </Table>
          </section>
          <section className="ringkasan-penjualan">
            <p>Total Harga: Rp {totalPrice.toLocaleString()}</p>
            <Input
              type="text"
              placeholder="ID Member (Opsional)"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            {memberId && <p>Nama Member: {memberName || 'Validasi member belum diimplementasikan'}</p>}
            {memberId && <p>Diskon: Rp {discount.toLocaleString()}</p>}
            <p><strong>TOTAL BAYAR: Rp {totalAfterDiscount.toLocaleString()}</strong></p>
          </section>
          <section className="area-pembayaran">
            <label>
              Tipe Pembayaran:
              <select value={paymentType} onChange={handlePaymentTypeChange}>
                {paymentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            {paymentType === 'Tunai' && (
              <>
                <Input
                  type="number"
                  placeholder="Jumlah Bayar"
                  value={amountPaid}
                  onChange={handleAmountPaidChange}
                />
                <p>Kembalian: Rp {change.toLocaleString()}</p>
              </>
            )}
          </section>
          <section className="tombol-aksi">
            <Button onClick={() => alert('Transaksi disimpan')}>Simpan Transaksi</Button>
            <Button onClick={() => alert('Cetak nota')}>Cetak Nota</Button>
            <Button onClick={() => {
              setCartItems([]);
              setMemberId('');
              setMemberName('');
              setDiscount(0);
              setAmountPaid('');
              setChange(0);
            }}>Batal Transaksi</Button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesTransactionPage;

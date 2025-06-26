import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import axios from 'axios';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

// components
import ProductInputCard from './ProductInputCard';
import CategoryMenu from './CategoryMenu';
import ProductMenuGrid from './ProductMenuGrid';
import CartListCard from './CartListCard';
import SalesSummaryCard from './SalesSummaryCard';
import PaymentCard from './PaymentCard';

import SalesDocumentCard from './SalesDocumentCard';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addPdfHeader } from 'layout/PdfHeader/PdfHeader.jsx';
import { UserContext } from 'context/UserContext.jsx';

const categoriesForMenu = ['Semua', 'Kopi Klasik', 'Kopi Signature', 'Manual Brew', 'Non-Kopi', 'Pastry & Roti', 'Kudapan Berat', 'Dessert'];

const SalesTransactionPage = () => {
  const [productInput, setProductInput] = useState('');
  const { user } = useContext(UserContext);
  const [productsData, setProductsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [memberInfo, setMemberInfo] = useState(null);
  const [paymentType, setPaymentType] = useState('Tunai');
  const [amountPaid, setAmountPaid] = useState('');
  const [change, setChange] = useState(0);
  const [transactionSaved, setTransactionSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoriesForMenu[0]);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const printRef = useRef(null);

  // Fetch products from backend
  useEffect(() => {
    axios.get('http://localhost:8000/toko-kyu-ryu/api/products')
      .then(response => {
        // Map backend product fields to frontend expected fields
        const mappedProducts = response.data.map(product => ({
          id: product.id_barang,
          name: product.nama_barang,
          price: product.harga_jual,
          stock: product.stok,
          category: product.Category ? product.Category.nama_kategori : product.id_kategori,
          // Include other fields if needed
        }));
        setProductsData(mappedProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Fetch member info by memberId
  useEffect(() => {
    if (memberId) {
      axios.get(`http://localhost:8000/toko-kyu-ryu/api/customers/${memberId}`)
        .then(response => {
          setMemberInfo(response.data);
        })
        .catch(() => {
          setMemberInfo(null);
        });
    } else {
      setMemberInfo(null);
    }
  }, [memberId]);

  // Handle product input change
  const handleProductInputChange = (e) => {
    setProductInput(e.target.value);
    setSelectedProduct(null);
  };

  // Auto-suggest products based on input
  const filteredProducts = productsData.filter(
    (p) =>
      (p.code && p.code.toLowerCase().includes(productInput.toLowerCase())) ||
      (p.name && p.name.toLowerCase().includes(productInput.toLowerCase()))
  );

  // Select product from auto-suggest
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductInput('');
  };

  // Add selected product to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const existingItem = cartItems.find((item) => item.id === selectedProduct.id);
    if (existingItem) {
      if (existingItem.quantity < selectedProduct.stock) {
        setCartItems(
          cartItems.map((item) =>
            item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        alert('Stok tidak cukup');
      }
    } else {
      setCartItems([...cartItems, { ...selectedProduct, quantity: 1 }]);
    }
    setSelectedProduct(null);
  };

  // Update quantity in cart
  const handleQuantityChange = (id, delta) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            if (newQuantity > item.stock) {
              alert('Stok tidak cukup');
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate totals
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = memberInfo ? (totalPrice * memberInfo.discount) / 100 : 0;
  const totalPayable = totalPrice - discountAmount;

  // Handle member ID input change
  const handleMemberIdChange = (e) => {
    const id = e.target.value.toUpperCase();
    setMemberId(id);
  };

  // Handle payment type change
  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setAmountPaid('');
    setChange(0);
  };

  // Handle amount paid change
  const handleAmountPaidChange = (e) => {
    const value = e.target.value;
    setAmountPaid(value);
  };

  // Calculate change
  useEffect(() => {
    if (paymentType === 'Tunai') {
      const paid = parseFloat(amountPaid);
      if (!isNaN(paid)) {
        setChange(paid - totalPayable);
      } else {
        setChange(0);
      }
    } else {
      setChange(0);
    }
  }, [amountPaid, totalPayable, paymentType]);

  // Handle save transaction
  const handleSaveTransaction = async () => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong');
      return;
    }
    if (paymentType === 'Tunai' && (amountPaid === '' || change < 0)) {
      alert('Jumlah bayar tidak cukup');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/toko-kyu-ryu/api/sales/transaction', {
        customerId: memberInfo ? memberInfo.id_pelanggan : null,
        paymentType,
        amountPaid: paymentType === 'Tunai' ? parseFloat(amountPaid) : totalPayable,
        cartItems: cartItems.map(item => ({
          id_barang: item.id, // Use string ID as in database
          jumlah_barang: item.quantity,
          harga_per_unit: item.price,
          subtotal_item: item.price * item.quantity,
        })),
        discountAmount,
        totalPrice,
        totalPayable,
      });
      setTransactionSaved(true);
      alert('Transaksi berhasil disimpan');
    } catch (error) {
      alert('Gagal menyimpan transaksi');
      if (error.response && error.response.data) {
        console.error('Save transaction error:', error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    setPrintDialogOpen(true);
  };

  // Handle cancel transaction
  const handleCancelTransaction = () => {
    if (window.confirm('Batalkan transaksi?')) {
      setCartItems([]);
      setMemberId('');
      setMemberInfo(null);
      setPaymentType('Tunai');
      setAmountPaid('');
      setChange(0);
      setTransactionSaved(false);
      setProductInput('');
      setSelectedProduct(null);
      setSelectedCategory(categoriesForMenu[0]);
    }
  };

  // Filter products for selected category
  const productsForMenu = selectedCategory === 'Semua' ? productsData : productsData.filter((p) => p.category === selectedCategory);

  // Add product from menu to cart
  const handleAddProductFromMenu = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        alert('Stok tidak cukup');
      }
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleClosePrintDialog = () => {
    setPrintDialogOpen(false);
  };

  const handlePrintPDF = async () => {
    if (!printRef.current) return;
    html2canvas(printRef.current, { scale: 2 }).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [80, 297]);
      const pdfWidth = 80;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      await addPdfHeader(pdf);

      pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight);

      pdf.save(`Nota_Penjualan_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  return (
    <>
      <Breadcrumb title="Transaksi Penjualan">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Transaksi Penjualan
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={8}>
          <ProductInputCard
            productInput={productInput}
            filteredProducts={filteredProducts}
            selectedProduct={selectedProduct}
            onProductInputChange={handleProductInputChange}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
          <CategoryMenu
            categories={categoriesForMenu}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductMenuGrid
            products={productsForMenu}
            onAddProduct={handleAddProductFromMenu}
          />
          <CartListCard
            cartItems={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
          <SalesSummaryCard
            totalPrice={totalPrice}
            memberId={memberId}
            memberInfo={memberInfo}
            onMemberIdChange={handleMemberIdChange}
            totalPayable={totalPayable}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PaymentCard
            paymentType={paymentType}
            amountPaid={amountPaid}
            change={change}
            onPaymentTypeChange={handlePaymentTypeChange}
            onAmountPaidChange={handleAmountPaidChange}
            onSaveTransaction={handleSaveTransaction}
            onPrintReceipt={handlePrintReceipt}
            onCancelTransaction={handleCancelTransaction}
            transactionSaved={transactionSaved}
          />
        </Grid>
      </Grid>

      <Dialog open={printDialogOpen} onClose={handleClosePrintDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nota Penjualan</DialogTitle>
        <DialogContent dividers>
          <div ref={printRef}>
            <SalesDocumentCard
              city="Surabaya"
              transactionDate={new Date().toLocaleDateString()}
              customerName={memberInfo ? memberInfo.nama_pelanggan : 'Pelanggan Umum'}
              invoiceNumber={new Date().getTime()}
              items={cartItems.map(item => ({
                id: item.id,
                nama_barang: item.name,
                jumlah_barang: item.quantity,
                harga_per_unit: item.price,
                subtotal_item: item.price * item.quantity
              }))}
              totalPrice={totalPrice}
              discount={discountAmount}
              totalPayable={totalPayable}
              amountPaid={amountPaid}
              change={change}
              cashierName={user?.nama_lengkap || "Nama Kasir"}
            />
          </div>
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

export default SalesTransactionPage;
